from enum import IntEnum

from django.apps import apps
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models import F, Q
from django.utils.functional import cached_property
from django.utils.translation import ugettext_lazy as _

from model_utils.managers import InheritanceManager

from pepr.perms.permissions import Permission, Permissions, Privilege
from pepr.perms.roles import Roles, Role
from pepr.perms.defaults import AnonymousRole, DefaultRole, AdminRole


class Context(models.Model):
    def get_special_role(self, user):
        """
        Return user's role based on User's object (not subscription)
        only; return None if nothing special.

        This is used to get special roles as for admin or anonymous user.
        """
        if user.is_superuser:
            return AdminRole
        if user.is_anonymous:
            return AnonymousRole

    def get_role(self, user):
        """
        Return role for user.

        :param User user: user whose access is being fetched
        """
        role = self.get_special_role(user)
        subscription = None

        if not user.is_anonymous:
            subscription = Subscription.objects.filter(
                context = self, user = user
            ).select_subclasses().first()

            # get role from subscription or from default only if role is
            # not yet given
            if role is None and subscription:
                role = Roles.get(subscription.access) if subscription \
                        else DefaultRole

        if role is None:
            role = AnonymousRole
        return role(self, user, subscription)


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
        choices = Roles.as_choices('access','name'),
    )
    user = models.ForeignKey(
        User, on_delete = models.CASCADE,
    )

    objects = InheritanceManager()

    def get_role(self, access = None):
        """
        Return a Role instance for self. Get Role subclass using
        ``self.access`` or the given access.
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
        choices = Roles.as_choices('access','name'),
    )
    codename = models.CharField(
        verbose_name = _('permission'),
        max_length = 32,
    )
    model = models.ForeignKey(
        ContentType, on_delete = models.CASCADE,
        blank = True, null = True,
    )
    privilege = models.BooleanField(
        default = False,
        choices = [ (v, _(k)) for k,v in Privilege.__members__.items() ],
    )

    def as_permission(self):
        model = self.model.model_class()
        cl = Permissions.get(self.codename) or Permission
        return cl(self.codename, model, self.privilege)


class AccessibleQuerySet(models.QuerySet):
    def access(self, access):
        """
        Filter in elements authorized for this access level.
        """
        return self.filter(access__lte = access)

    def for_user(self, user):
        """
        Filter accessibles based on related Subscription
        """
        if user.is_anonymous:
            # anonymous user
            q = Q(access__lte = Roles.get(Access.Anonymous))
        else:
            q = (
                # user with registered access
                Q(context__useraccess__access__gte = F('access'),
                  context__useraccess__user = user) |
                # user with no access, but is platform member
                (
                    ~Q(context__useraccess__user = user) &
                    Q(access__lte = Roles.get(Access.Default).access)
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
        choices = Roles.as_choices('access','name'),
        help_text = _('minimal privilege to access this element')
    )

    objects = AccessibleQuerySet.as_manager()

    class Meta:
        abstract = True

