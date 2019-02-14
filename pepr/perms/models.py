"""
Models for permission management.
"""
from functools import lru_cache

from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models import F, Q
from django.core.exceptions import ValidationError, PermissionDenied
from django.utils.functional import cached_property
from django.utils.translation import ugettext_lazy as _

from model_utils.managers import InheritanceQuerySetMixin, \
        InheritanceManager

from .filters import IsAccessibleFilterBackend
from .roles import Roles, AnonymousRole, DefaultRole, \
        AdminRole
from ..utils.iter import as_choices


SUBSCRIPTION_REQUEST = 1
SUBSCRIPTION_INVITATION = 2
SUBSCRIPTION_ACCEPTED = 3

SUBSCRIPTION_CHOICES = (
    (SUBSCRIPTION_REQUEST, _('Request')),
    (SUBSCRIPTION_INVITATION, _('Invitation')),
    (SUBSCRIPTION_ACCEPTED, _('Accepted')),
)


accessible_access_choices = list(as_choices('access', 'name', Roles.values()))
subscription_access_choices = [
    access for access in accessible_access_choices
    if access[0] > DefaultRole.access
]


class ContextQuerySet(InheritanceQuerySetMixin, models.QuerySet):
    def subscription(self, user, access=None):
        """
        Get contexts that user has a subscription to (filtered by
        ``role`` if given).
        """
        if user.is_anonymous:
            raise RuntimeError('user can not be anonymous')
        if access is not None:
            return self.filter(subscription_set__owner=user,
                               subscription_setaccess=access)
        return self.filter(subscription_set__owner=user)


class Context(models.Model):
    """
    Each instance of ``Context`` defines a context in which permissions,
    subscriptions and access to objects take place.
    """
    subscription_policy = models.SmallIntegerField(
        verbose_name=_('subscription policy'),
        choices=SUBSCRIPTION_CHOICES,
        default=SUBSCRIPTION_INVITATION,
        help_text=_('Defines how subscription works')
    )
    subscription_default_access = models.SmallIntegerField(
        verbose_name=_("subscription's default role"),
        choices=subscription_access_choices,
        blank=True, null=True,
        help_text=_('Role set by default to new subscribers'),
    )

    role = None
    objects = ContextQuerySet.as_manager()

    @property
    def can_request_subscription(self):
        """ Return True if context accepts subscription requests. """
        return self.subscription_policy in (SUBSCRIPTION_REQUEST,
                                            SUBSCRIPTION_ACCEPTED)

    @staticmethod
    def get_special_role(user):
        """
        Return user's role class based on User's object (not subscription)
        or None if nothing special.

        This is used to get special roles as for anonymous users.
        """
        if user is None or user.is_anonymous:
            return AnonymousRole
        return None

    def get_role(self, user, force=False):
        """
        Return role for user with related user subscription if present.
        If ``is_current``, resulting role will be set as ``self.role``.

        :param User user: user whose access is being fetched;
        :param bool is_current: this role is of the current request's user;
        """
        if not force and self.role and self.role.user == user:
            return self.role

        # check for special roles (overwrites the subscription)
        role = self.get_special_role(user)
        subscription = None

        if user is not None and not user.is_anonymous:
            subscription = Subscription.objects.filter(
                context=self, owner=user, status=SUBSCRIPTION_ACCEPTED,
            ).first()

            # get role from subscription or from default only if role is
            # not yet given
            if role is None:
                role = Roles.get(subscription.access) \
                    if subscription and subscription.is_subscribed \
                    else DefaultRole

        if role is None:
            role = AnonymousRole

        self.role = role(self, user, subscription)
        return self.role


class AccessibleQuerySet(InheritanceQuerySetMixin, models.QuerySet):
    """
    Queryset used by the Accessible model.
    """
    def access(self, access):
        """
        Return contexts available for this access level
        """
        return self.filter(access__lte=access)

    def context(self, context):
        """
        Filter in elements for the given context
        """
        return self.filter(context=context)

    # We use a distinct function to get Q objet in order to allow
    # extensibility of the user() method.
    def _get_user_q(self, user):
        """
        Return Q object used to filter Accessible instances for the
        given user by :func:`AccessibleQuerySet.user`.
        """
        # special user case
        # FIXME: this is not extensible
        role = Context.get_special_role(user)
        if role:
            return Q(access__lte=role.access)

        # registered user
        return (
            # user with registered access
            Q(context__subscription__access__gte=F('access'),
              context__subscription__status=SUBSCRIPTION_ACCEPTED,
              context__subscription__owner=user) |
            # user with no access, but who is platform member
            (
                ~Q(context__subscription__status=SUBSCRIPTION_ACCEPTED,
                   context__subscription__owner=user) &
                Q(access__lte=DefaultRole.access)
            )
        )

    def user(self, user):
        """
        Filter Accessible objects based on user's role.
        """
        return self.filter(self._get_user_q(user)).distinct()


class Accessible(models.Model):
    """
    Simple abstract class used to define basic access control
    based on access's privilege.
    """
    context = models.ForeignKey(
        Context, on_delete=models.CASCADE,
    )
    access = models.SmallIntegerField(
        _('access'), default=0,
        choices=accessible_access_choices,
        help_text=_('who has access this element and its content.')
    )

    objects = AccessibleQuerySet.as_manager()
    filter_backends = (IsAccessibleFilterBackend,)

    @cached_property
    def related_context(self):
        """
        Related Context as its real subclass.
        """
        return Context.objects.get_subclass(id=self.context_id) \
            if self.context_id is not None else None

    @property
    def is_saved(self):
        """
        Return True if object has yet been saved.
        """
        return self.pk is not None

    class Meta:
        abstract = True


class OwnedQuerySet(AccessibleQuerySet):
    def owner(self, user):
        """
        Filter based on accessible's owner.
        """
        return self.filter(owner=user)

    def _get_owner_q(self, user):
        """
        Return Q object used to filter Accessible based on the
        ownership of the Accessible objects.
        """
        return Q(owner=user)

    def user(self, user):
        q = self._get_user_q(user)
        if not user.is_anonymous:
            q |= Q(owner=user)
        return self.filter(q).distinct()


class Owned(Accessible):
    """
    Accessible owned by an end-user.

    The principle underlied by this class is that *end-user always has
    access to objects that he owns and the right to edit it*. The use
    case of object ownership is up to the class user (e.g. ownership by
    the creator of content).
    """
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE,
        null=True, blank=True,
        help_text=_('user owning this object'),
    )

    objects = OwnedQuerySet.as_manager()

    class Meta:
        abstract = True

    def is_owner(self, role):
        """
        Return True if given role is considered the owner of the object.
        """
        return self.is_saved and not role.is_anonymous and \
                self.owner == role.user


class Subscription(Owned):
    """
    Subscription of a User to a Context used in order to determine its
    role (for access and permission management) for this Context.

    Subscription is an Owned where the owner is the user
    concerned by the subscription. **The ``access`` here determines
    owner's role for the given ``context``, and should not be used
    to grant access to subsciptions without a prior privilege check**:
    the access here determines which subscriptions a user with the
    related privileges granted has access to (for reading or writing).

    There can be only one Subscription for a pair of owner and context.
    """
    status = models.SmallIntegerField(
        _('status'),
        choices=SUBSCRIPTION_CHOICES,
        blank=True
    )

    class Meta:
        unique_together = ('context', 'owner')

    @property
    def is_subscribed(self):
        return self.status == SUBSCRIPTION_ACCEPTED

    def get_role(self, access=None):
        """
        Return an instance of Role for this subscription. If ``access``
        is given, it overrides ``self.access``.
        """
        if access is None:
            access = self.access
        cls = Roles.get(access)
        return cls(self.context, self.owner, self)

    def delete(self):
        # TODO: ensure that also at context creation
        # Rule: there is always at least one admin subscribed in Context
        if self.access == AdminRole.access:
            qs = Subscription.objects.context(self.context) \
                                     .access(self.access)
            if qs.count() < 2:
                raise ValidationError(
                    "there must be at least one admin in context."
                )
        return super().delete()


# Rule: Subscription access can not be <= DefaultRole's
#       -> Enforce access restriction for Subscription
Subscription._meta.get_field('access').choices = subscription_access_choices


class Authorization(Accessible):
    """
    Permission defined for a specific Context, overriding the ones
    assigned statically (on a per Role basis).
    """
    codename = models.CharField(
        verbose_name=_('permission'),
        max_length=32,
    )
    model = models.ForeignKey(
        ContentType, on_delete=models.CASCADE,
    )
    granted = models.BooleanField(
        default=False,
    )

