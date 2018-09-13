from enum import IntEnum

from django.apps import apps
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models import F, Q
from django.utils.functional import cached_property
from django.utils.translation import ugettext_lazy as _

from pepr.perms.permissions import Permission, Permissions
from pepr.perms.roles import Roles, Role, AnonymousRole, DefaultRole, \
        AdminRole
from pepr.utils.iter import as_choices


class Context(models.Model):
    #visibility = models.SmallIntegerField(
    #    verbose_name = _('visibility'),
    #    choices = as_choices('access','name', Roles.values()),
    #    blank = True, null = True,
    #)


    def get_special_role(self, user):
        """
        Return user's role based on User's object (not subscription)
        only; return None if nothing special.

        This is used to get special roles as for admin or anonymous user.
        """
        if user is None or user.is_anonymous:
            return AnonymousRole
        if user.is_superuser:
            return AdminRole

    def get_role(self, user):
        """
        Return role for user with related user subscription if present.

        :param User user: user whose access is being fetched
        """
        # special roles overwrites subscriptions
        role = self.get_special_role(user)
        subscription = None

        if user is not None and not user.is_anonymous:
            subscription = Subscription.objects.filter(
                context = self, user = user
            ).select_subclasses().first()

            # get role from subscription or from default only if role is
            # not yet given
            if role is None:
                role = Roles.get(subscription.access) if subscription \
                        else DefaultRole

        if role is None:
            role = AnonymousRole
        return role(self, user, subscription)


class SubscriptionQuerySet(models.QuerySet):
    def context(self, context):
        return self.filter(context = context)

    def access(self, access):
        return self.filter(access = access)

    def user(self, user):
        return self.filter(user = user)


class Subscription(models.Model):
    """
    User's subscription for a given context that can be used for access/perms
    management. This is also used as base for a generic subscription model.
    """
    context = models.ForeignKey(
        Context, on_delete = models.CASCADE,
    )
    access = models.SmallIntegerField(
        verbose_name = _('access'),
        choices = as_choices('access','name', Roles.values()),
    )
    user = models.ForeignKey(
        User, on_delete = models.CASCADE,
    )

    objects = SubscriptionQuerySet.as_manager()

    def get_role(self, access = None):
        """
        Return an instance of Role for this subscription. If ``access``
        is given, it overrides ``self.access``.
        """
        if access is None:
            access = self.access
        cl = Roles.get(access)
        return cl(self.context, self.user, self)

    class Meta:
        unique_together = ('context','user')


class Authorization(models.Model):
    """
    Permission set by users for a context and specific role access.
    """
    context = models.ForeignKey(
        Context, on_delete = models.CASCADE,
        verbose_name = _('context'),
    )
    access = models.SmallIntegerField(
        verbose_name = _('access'),
        choices = as_choices('access','name', Roles.values()),
    )
    codename = models.CharField(
        verbose_name = _('permission'),
        max_length = 32,
    )
    model = models.ForeignKey(
        ContentType, on_delete = models.CASCADE,
        blank = True, null = True,
    )
    is_allowed = models.BooleanField(
        default = False,
    )

    def as_permission(self):
        """
        Return an instance of Permission using informations from this
        Authorization.
        """
        model = self.model.model_class() if self.model else None
        cl = Permissions.get(self.codename) or Permission
        return cl(self.codename, model, self.is_allowed)


class AccessibleQuerySet(models.QuerySet):
    def context(self, context):
        """
        Filter in elements for the given context
        """
        return self.filter(context = context)

    def access(self, access):
        """
        Filter in elements accessible at this access level.
        """
        return self.filter(access__lte = access)

    def user(self, user):
        """
        Filter accessibles based on related Subscription
        """
        if user is None or user.is_anonymous:
            # anonymous user
            q = Q(access__lte = AnonymousRole.access)
        else:
            q = (
                # user with registered access
                Q(context__subscription__access__gte = F('access'),
                  context__subscription__user = user) |
                # user with no access, but who is platform member
                (
                    ~Q(context__subscription__user = user) &
                    Q(access__lte = DefaultRole.access)
                )
            )
        return self.filter(q).distinct()


class Accessible(models.Model):
    """
    Simple abstract class used to define basic access control
    based on access's privilege.
    """
    context = models.ForeignKey(
        Context, on_delete = models.CASCADE,
        related_name='+',
    )
    access = models.SmallIntegerField(
        _('access'), default = 0,
        choices = as_choices('access','name', Roles.values()),
        help_text = _('minimal level to access this element')
    )

    class Meta:
        abstract = True

