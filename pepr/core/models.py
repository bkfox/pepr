"""
Models for permission management.
"""
import uuid

from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models import F, Q
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _

from ..utils.iter import as_choices
from .permissions import *
from .roles import *
from .settings import settings


__all__ = ['access_choices',
           'Context', 'Accessible', 'Owned', 'Subscription',
           'Authorization', 'Service',
           'ContextQuerySet', 'AccessibleQuerySet', 'OwnedQuerySet']


def access_choices(pred=None):
    """
    Return Roles' access as field choices. If ``pred`` is given,
    use it to filter access choices
    """
    roles = settings.roles.values() if pred is None else \
        (r for r in settings.roles.values() if pred(r))
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


class BaseAccessibleQuerySet(models.QuerySet):
    """ Queryset used by the Accessible model. """
    def access(self, access):
        """
        Return contexts available for this access level
        """
        return self.filter(access__lte=access)

    # We use a distinct function to get Q objet in order to allow
    # extensibility of the identity() method.
    def get_identity_q(self, identity, subscription_prefix=''):
        """
        Return Q object used to filter Accessible instances for the
        given identity by :func:`AccessibleQuerySet.identity`.
        """
        # special identity case
        role = Context.get_special_role(identity)
        if role:
            return Q(access__lte=role.access)

        subscription_prefix += 'subscription__'
        # registered identity
        return (
            # identity with registered access
            Q(**{ subscription_prefix + 'role__gte': F('access'),
                  subscription_prefix + 'status': Subscription.STATUS_ACCEPTED,
                  subscription_prefix + 'owner': identity }) |
            # identity with no access, but who is platform member
            (~Q(**{subscription_prefix + 'status': Subscription.STATUS_ACCEPTED,
                   subscription_prefix + 'owner': identity}) &
             Q(access__lte=DefaultRole.access))
        )

    def identity(self, identity):
        """ Return queryset of objects accessible by identity. """
        return self.filter(self.get_identity_q(identity)).distinct()


class BaseAccessible(models.Model):
    """
    Simple abstract class used to define basic access control
    based on access's privilege.
    """
    uuid = models.UUIDField(
        db_index=True, unique=True, primary_key=True,
        default=None, blank=True
    )
    access = models.SmallIntegerField(
        _('visibility'),
        choices=access_choices(),
        help_text=_('Only people with at least this role can see this.')
    )
    objects = BaseAccessibleQuerySet.as_manager()

    basename = ''

    @property
    def api_list_url(self):
        """ Get list url for this object's model """
        return reverse(f'api:{self.basename}-list')

    @property
    def api_detail_url(self):
        """ Get detail url for this object """
        return reverse(f'api:{self.basename}-detail',  pk=str(self.pk))

    @property
    def is_saved(self):
        """ Return True if object has yet been saved. """
        return self.pk is not None

    def get_role(self, identity, force=False):
        """ Return role for identity on accessible. """
        raise NotImplemented('Not implemented')

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.pk = uuid.uuid4()
        super().save(*args, **kwargs)

    class Meta:
        abstract = True


class ContextQuerySet(BaseAccessibleQuerySet):
    @classmethod
    def get_identities_q(cls):
        return (Q(identity_policy__isnull=False) |
                Q(identity_owner__isnull=False))

    def identities(self):
        """ Filter identities only contexts. """
        return self.filter(self.get_identities_q())

    def user_identities(self, user, strict=False):
        """
        Filter contexts that user can personify. If ``strict``, only user's
        identities will be provided.

        Resulting queryset is order with User's context first.
        """
        if strict:
            return self.filter(identity_owner=user)

        # FIXME/TODO: default user's context
        return self.identities().filter(
            Q(identity_owner=user) |
            Q(subscription__status=Subscription.STATUS_ACCEPTED,
              subscription__role__gte=F('identity_policy'),
              subscription__owner__identity_owner=user)
        ).order_by('-identity_owner')

    def get_identities(self, user, pk):
        """
        Return current user's identity and available identities as
        ``(identity, identities_qs)``. Raise 404 if an invalid identity
        pk has been provided through.
        """
        if user.is_anonymous:
            return None, None

        identities = self.user_identities(user)
        if pk:
            return (identities.get_or_404(pk), identities)

        identity = self.user_identities(user, True) \
            .first()
        return (identity, identities)

    def subscription(self, identity, access=None, status=None):
        """ Get contexts that identity has a subscription to. """
        if identity is None:
            return self.none()
        qs = self
        filters = { 'subscription_set__owner': identity }
        if access is not None:
            filters['subscription_set__access'] = access
        if status is not None:
            filters['subscription_set__status'] = status
        return self.filter(subscription_set__owner=identity)


class Context(BaseAccessible):
    """
    Each instance of ``Context`` defines a context in which permissions,
    subscriptions and objects' access take place.
    """
    allow_subscription_request = models.BooleanField(
        verbose_name=_('Allow subscription request'),
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
        verbose_name=_("Subscription's default visibility"),
        choices=subscription_role_choices,
        default=MemberRole.access,
        help_text=_("Default visibility for users' subscriptions."),
    )
    subscription_default_role = models.SmallIntegerField(
        verbose_name=_("Subscription's default role"),
        choices=subscription_role_choices,
        default=MemberRole.access,
        help_text=_('Role set by default to new subscribers'),
    )
    identity_policy = models.SmallIntegerField(
        _('Identity Policy'), choices=subscription_role_choices,
        blank=True, null=True,
        help_text=_(
            'Define which members can act taking context\'s as identity'
        )
    )
    identity_owner = models.ForeignKey(
        User, on_delete=models.CASCADE,
        verbose_name=_('Real user behind the identity'),
        blank=True, null=True, db_index=True,
        help_text=_('If user page, set to the actual user.')
    )
    title = models.CharField(
        _('Title'), max_length=64,
        blank=True, null=True
    )
    headline = models.CharField(
        _('headline'), max_length=128,
        blank=True, null=True
    )

    identity_user = None
    """ User impersonating current identity instance (request's user). """

    role = None
    """
    Current identity role (which is the last one get using `get_role`.
    """
    objects = ContextQuerySet.as_manager()
    basename = 'context'


    @staticmethod
    def get_special_role(identity):
        """
        Return identity's role class based on identity (not subscription)
        or None if nothing special.

        This is used to get special roles as for anonymous users.
        """
        if identity is None:
            return settings.roles.get(AnonymousRole.access)
        return None

    def get_role(self, identity, force=False):
        """
        Return role for identity with related identity subscription if present.
        If ``is_current``, resulting role will be set as ``self.role``.

        :param (Context|None) identity: identity whose access is being fetched;
        :param bool is_current: this role is of the current request's identity;
        """
        if not force and self.role and self.role.identity == identity:
            return self.role

        # check for special roles (overwrites the subscription)
        role = self.get_special_role(identity)
        subscription = None

        if identity is not None:
            if self.pk == identity.pk:
                role = settings.roles.get(AdminRole.access)
            else:
                subscription = Subscription.objects.filter(
                    context=self, owner=identity, status=Subscription.STATUS_ACCEPTED,
                ).first()

                # get role from subscription or from default only if role is
                # not yet given
                if role is None:
                    role = settings.roles.get(subscription.role) \
                        if subscription and subscription.is_subscribed \
                        else DefaultRole

        if role is None:
            role = AnonymousRole

        self.role = role(self, identity, subscription)
        return self.role

    def save(self, *args, **kwargs):
        if self.subscription_accept_role:
            self.subscription_default_role = min(
                self.subscription_accept_role, self.subscription_default_role
            )
        return super().save(*args, **kwargs)


class AccessibleQuerySet(BaseAccessibleQuerySet):
    """
    Queryset used by the Accessible model.
    """
    def role(self, role):
        """ Filter elements available by this role. """
        return self.identity(role.identity).access(role.access) \
                   .context(role.context)

    def context(self, context):
        """
        Filter in elements for the given context
        """
        return self.filter(context=context)

    def get_identity_q(self, identity, subscription_prefix=''):
        return super().get_identity_q(identity, subscription_prefix or
                                        'context__')


class AccessibleMeta(models.base.ModelBase):
    def __new__(cls, name, bases, attrs):
        if 'context_class' in attrs:
            attrs['context'].remote_field.to = attrs['context_class']
        return super().__new__(cls, name, bases, attrs)


class Accessible(BaseAccessible,metaclass=AccessibleMeta):
    """
    Simple abstract class used to define basic access control
    based on access's privilege.
    """
    context = models.ForeignKey(
        Context, on_delete=models.CASCADE,
        # we do this because context related_name clashes
        related_name='%(class)s'
    )
    objects = AccessibleQuerySet.as_manager()

    def get_role(self, identity, force=False):
        """ Return role for identity on accessible. """
        return self.context.get_role(identity, force)

    class Meta:
        abstract = True


class OwnedQuerySet(AccessibleQuerySet):
    def owner(self, identity):
        """
        Filter based on accessible's owner.
        """
        return self.filter(owner=identity)

    def identity(self, identity):
        q = self.get_identity_q(identity)
        if identity is not None:
            q |= Q(owner=identity)
        return self.filter(q).distinct()


class OwnedMeta(AccessibleMeta):
    def __new__(cls, name, bases, attrs):
        if 'owner_class' in attrs:
            attrs['owner'].remote_field.to = attrs['owner_class']
        return super().__new__(cls, name, bases, attrs)


class Owned(Accessible,metaclass=OwnedMeta):
    """
    Accessible owned by an end-identity.

    The principle underlied by this class is that *end-identity always has
    access to objects that he owns and the right to edit it*. The use
    case of object ownership is up to the class identity (e.g. ownership by
    the creator of content).
    """
    owner = models.ForeignKey(
        Context, on_delete=models.CASCADE,
        null=True, blank=True,
        limit_choices_to=ContextQuerySet.get_identities_q(),
        help_text=_('identity that owns this object'),
        related_name='owned_%(class)s'
    )

    objects = OwnedQuerySet.as_manager()

    class Meta:
        abstract = True

    def is_owner(self, role):
        """
        Return True if given role is considered the owner of the object.
        """
        return self.is_saved and not role.is_anonymous and \
               self.owner_id == role.identity.pk


class SubscriptionQuerySet(OwnedQuerySet):
    def subscribed(self, context=None):
        """ Return all accepted subscriptions. """
        qs = self.filter(status=Subscription.STATUS_ACCEPTED)
        return qs if context is None else qs.context(context)

class Subscription(Owned):
    """
    Subscription of a identity to a Context used in order to determine its
    role (for access and permission management) for this Context.

    Subscription is an Owned where the owner is the identity
    concerned by the subscription. **The ``access`` here determines
    owner's role for the given ``context``, and should not be used
    to grant access to subsciptions without a prior privilege check**:
    the access here determines which subscriptions a identity with the
    related privileges granted has access to (for reading or writing).

    There can be only one Subscription for a pair of owner and context.
    """
    STATUS_INVITE = 1
    STATUS_REQUEST = 2
    STATUS_ACCEPTED = 3

    STATUS_CHOICES = (
        (STATUS_INVITE, _('Invite')),
        (STATUS_REQUEST, _('Request')),
        (STATUS_ACCEPTED, _('Accepted')),
    )

    status = models.SmallIntegerField(
        _('status'),
        choices=STATUS_CHOICES,
        blank=True
    )
    role = models.SmallIntegerField(
        _('role'), default=0,
        choices=subscription_role_choices,
        help_text=_('Defines the role of the identity and his access level '
                    'to content.')
    )

    objects = SubscriptionQuerySet.as_manager()
    basename = 'subscription'

    class Meta:
        unique_together = ('context', 'owner')

    @property
    def is_invite(self):
        return self.status == self.STATUS_INVITE

    @property
    def is_request(self):
        return self.status == self.STATUS_REQUEST

    @property
    def is_subscribed(self):
        return self.status == self.STATUS_ACCEPTED

    def get_role(self, access=None):
        """
        Return an instance of Role for this subscription. If ``access``
        is given, it overrides ``self.access``.
        """
        if access is None:
            access = self.role
        cls = settings.roles.get(access) or AnonymousRole
        return cls(self.context, self.owner, self)


# identity must at least been subscribed in order to have a access to
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

    basename = 'authorization'


class Service(Accessible):
    """
    A Service is an application enabled in a context.

    It can be subclassed to provide settings.
    """
    title = models.CharField(_('Title'), max_length=128, blank=True, null=True)
    url_name = models.CharField(_('Url name'), max_length=64, blank=True)

    service_url_name = ''
    basename = 'service'

    def get_absolute_url(self):
        """ Url to service's index """
        return reverse(self.url_name, kwargs={'context_pk': self.context_id})

    def save(self, *args, **kwargs):
        if not self.url_name:
            self.url_name = self.service_url_name
        super().save(*args, **kwargs)


