"""
Models for permission management.
"""
import uuid

from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models import F, Q
from django.utils.translation import ugettext_lazy as _

from model_utils.managers import InheritanceQuerySetMixin

from ..utils.iter import as_choices
from ..utils.functional import cached_method
from .permissions import *
from .roles import *


__all__ = ['STATUS_INVITE, STATUS_REQUEST', 'STATUS_ACCEPTED',
           'STATUS_CHOICES', 'access_choices',
           'Context', 'Accessible', 'Owned', 'Subscription',
           'Authorization',
           'ContextQuerySet', 'AccessibleQuerySet', 'OwnedQuerySet']


STATUS_INVITE = 1
STATUS_REQUEST = 2
STATUS_ACCEPTED = 3

STATUS_CHOICES = (
    (STATUS_INVITE, _('Invite')),
    (STATUS_REQUEST, _('Request')),
    (STATUS_ACCEPTED, _('Accepted')),
)


def access_choices(pred=None):
    """
    Return Roles' access as field choices. If ``pred`` is given,
    use it to filter which access
    """
    roles = Roles.values() if pred is None else \
        (r for r in Roles.values() if pred(r))
    return list(as_choices('access', 'name', roles))

# Rule: Subscription allowed roles are all with access > than default
#       role.
subscription_role_choices = access_choices(
    lambda r: r.access > DefaultRole.access
)
""" Available roles for subscription  """
subscription_request_role_choices = access_choices(
    lambda r: r.access > DefaultRole.access and r.access < ModeratorRole.access
)
""" Available roles for subscription request """


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
            Q(context__subscription__role__gte=F('access'),
              context__subscription__status=STATUS_ACCEPTED,
              context__subscription__owner=user) |
            # user with no access, but who is platform member
            (
                ~Q(context__subscription__status=STATUS_ACCEPTED,
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
    uuid = models.UUIDField(
        db_index=True, unique=True, primary_key=True,
        default=uuid.uuid4
    )
    context = models.ForeignKey(
        'pepr_perms.ContextBase', on_delete=models.CASCADE,
        # we do this because context related_name clashes
        related_name='%(class)s'
    )
    access = models.SmallIntegerField(
        _('access'),
        choices=access_choices(),
        help_text=_('People with the given access or higher would be '
                    'able to access this element.')
    )
    objects = AccessibleQuerySet.as_manager()

    @cached_method
    def get_context(self):
        """ Return context as its real class. """
        return Context.objects.get_subclass(pk=self.context_id) \
            if self.context_id is not None else None

    @property
    def is_saved(self):
        """
        Return True if object has yet been saved.
        """
        return self.pk is not None

    class Meta:
        abstract = True


class ContextQuerySet(AccessibleQuerySet):
    def subscription(self, user, access=None):
        """
        Get contexts that user has a subscription to (filtered by
        ``role`` if given).
        """
        if user.is_anonymous:
            raise RuntimeError('user can not be anonymous')
        if access is not None:
            return self.filter(subscription_set__owner=user,
                               subscription_set__access=access)
        return self.filter(subscription_set__owner=user)


class ContextBase(Accessible):
    """
    Each instance of ``Context`` defines a context in which permissions,
    subscriptions and access to objects take place.
    """
    allow_subscription_request = models.BooleanField(
        verbose_name=_('allow subscription request'),
        default=False,
        help_text=_('User can request a subscription. If not, only by '
                    'Invite.')
    )
    subscription_accept_role = models.SmallIntegerField(
        verbose_name=_('Accept subscription for roles'),
        choices=subscription_role_choices,
        default=SubscriberRole.access,
        blank=True, null=True,
        help_text=_('Automatically accept all subscription requests up '
                    'to this role.')
    )
    subscription_default_access = models.SmallIntegerField(
        verbose_name=_("subscription's default access"),
        choices=subscription_role_choices,
        default=MemberRole.access,
        help_text=_("Default access for users' subscriptions."),
    )
    subscription_default_role = models.SmallIntegerField(
        verbose_name=_("subscription's default role"),
        choices=subscription_role_choices,
        default=MemberRole.access,
        help_text=_('Role set by default to new subscribers'),
    )
    title = models.CharField(
        _('title'), max_length=128,
        blank=True, null=True
    )


    role = None
    objects = ContextQuerySet.as_manager()

    class Meta:
        db_table = 'pepr_perms_context'

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
                context=self, owner=user, status=STATUS_ACCEPTED,
            ).first()

            # get role from subscription or from default only if role is
            # not yet given
            if role is None:
                role = Roles.get(subscription.role) \
                    if subscription and subscription.is_subscribed \
                    else DefaultRole

        if role is None:
            role = AnonymousRole

        self.role = role(self, user, subscription)
        return self.role

    def save(self, *args, **kwargs):
        if self.subscription_accept_role:
            self.subscription_default_role = min(
                self.subscription_accept_role, self.subscription_default_role
            )
        return super().save(*args, **kwargs)


# We use ContextBase as concrete model class because we'll have a clash
# with related_name of `Accessible.context` field and Context's parent pointer.
Context = ContextBase
Context._meta.get_field('context').blank = True
Context._meta.get_field('context').null = True


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
                self.owner_id == role.user.id


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
        choices=STATUS_CHOICES,
        blank=True
    )
    role = models.SmallIntegerField(
        _('role'), default=0,
        choices=subscription_role_choices,
        help_text=_('Defines the role of the user and his access level '
                    'to content.')
    )

    class Meta:
        unique_together = ('context', 'owner')

    @property
    def is_subscribed(self):
        return self.status == STATUS_ACCEPTED

    def get_role(self, access=None):
        """
        Return an instance of Role for this subscription. If ``access``
        is given, it overrides ``self.access``.
        """
        if access is None:
            access = self.role
        cls = Roles.get(access) or AnonymousRole
        return cls(self.context, self.owner, self)


# User must at least been subscribed in order to have a access to
# subscriptions.
Subscription._meta.get_field('access').choices=subscription_role_choices

MemberRole.register(Subscription, False, CanSubscribe)
ModeratorRole.register(Subscription, True, CanSubscribe,
    CanAcceptSubscription, CanUnsubscribe)
AdminRole.register(Subscription, True, CanSubscribe,
    CanAcceptSubscription, CanUnsubscribe)


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

