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
from .permissions import Permission, Permissions
from .roles import Roles, AnonymousRole, DefaultRole, \
        AdminRole
from pepr.utils.iter import as_choices


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
                               subscription_set__access=access)
        return self.filter(subscription_set__owner=user)


class Context(models.Model):
    """
    Each instance of ``Context`` defines a context in which permissions,
    subscriptions and access to objects take place.
    """
    # visibility = models.SmallIntegerField(
    #     verbose_name = _('visibility'),
    #     choices = as_choices('access','name', Roles.values()),
    #     blank = True, null = True,
    # )

    role = None

    objects = ContextQuerySet.as_manager()

    @staticmethod
    def get_special_role(user):
        """
        Return user's role class based on User's object (not subscription)
        or None if nothing special.

        This is used to get special roles as for admin or anonymous user.
        """
        if user is None or user.is_anonymous:
            return AnonymousRole
        if user.is_superuser:
            return AdminRole
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

        # special roles overwrites subscriptions
        role = self.get_special_role(user)
        subscription = None

        if user is not None and not user.is_anonymous:
            subscription = Subscription.objects.filter(
                context=self, owner=user
            ).first()

            # get role from subscription or from default only if role is
            # not yet given
            if role is None:
                role = Roles.get(subscription.access) if subscription \
                        else DefaultRole
        if role is None:
            role = AnonymousRole

        role = role(self, user, subscription)
        self.role = role
        return role

    def has_access(self, user, *args, **kwargs):
        """ Return True if user has this access. """
        return self.get_role(user).has_access(*args, **kwargs)

    def has_perm(self, user, *args, **kwargs):
        """ Shortcut to user's Role ``has_perm``. """
        return self.get_role(user).has_perm(*args, **kwargs)


class AccessibleQuerySet(InheritanceQuerySetMixin, models.QuerySet):
    """
    Queryset used by the Accessible model.
    """

    def context(self, context):
        """
        Filter in elements for the given context
        """
        return self.filter(context=context)

    def access(self, access):
        """
        Filter in elements available for this access level.
        """
        return self.filter(access__lte=access)

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
              context__subscription__owner=user) |
            # user with no access, but who is platform member
            (
                ~Q(context__subscription__owner=user) &
                Q(access__lte=DefaultRole.access)
            )
        )

    def user(self, user):
        """
        Filter Accessible objects based on user's role.
        """
        return self.filter(self._get_user_q(user)).distinct()


class AccessibleBase(models.Model):
    """
    Base class for accessible objects. The `context` field must be
    implemented in children classes.
    """
    access = models.SmallIntegerField(
        _('access'), default=0,
        choices=as_choices('access', 'name', Roles.values()),
        help_text=_('who has access this element and its content.')
    )

    filter_backends = (IsAccessibleFilterBackend,)
    objects = AccessibleQuerySet.as_manager()

    @cached_property
    def related_context(self):
        """
        Related Context as its real subclass.
        """
        return Context.objects.get_subclass(id=self.context_id) \
                if self.context_id is not None else None

    class Meta:
        abstract = True

    @property
    def is_saved(self):
        """
        Return True if object has yet been saved.
        """
        return self.pk is None

    def has_access(self, role):
        return role.has_access(self.access)

    def has_perm(self, role, codename):
        """
        Return wether user has given permission on this object.
        """
        return self.has_access(role) and \
               role.has_perm(codename, type(self))

    def assert_perm(self, role, codename):
        """
        Assert permission for this instance's model. If permission
        is not granted, raises a PermissionDenied.
        """
        if not self.has_perm(role, codename):
            raise PermissionDenied(
                'missing "{}" permission'.format(codename)
            )

    def delete_by(self, role):
        """
        Perform deletion by this role+user; run permissions check before
        delete.
        """
        self.assert_perm(role, 'delete')

    def save_by(self, role):
        """
        Save object performed by this role+user; run permissions checks
        before saving.
        """
        if not self.is_saved:
            self.assert_perm(role, 'create')
        else:
            self.assert_perm(role, 'update')

    def delete(self, *args, by=None, **kwargs):
        if by is not None:
            self.delete_by(by)
        super().delete(*args, **kwargs)

    def save(self, *args, by=None, **kwargs):
        if by is not None:
            self.save_by(by)
        super().save(*args, **kwargs)


class Accessible(AccessibleBase):
    """
    Simple abstract class used to define basic access control
    based on access's privilege.
    """
    context = models.ForeignKey(
        Context, on_delete=models.CASCADE,
    )

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

    def has_access(self, role):
        if self.owner is not None and not role.user.is_anonymous and \
                self.owner != role.user:
            owner_role = self.related_context.get_role(self.owner)
            if role.context.pk != owner_role.context.pk or \
                    not role.has_access(owner_role.access):
                return False
        return super().has_access(role)

    def has_perm(self, role, codename):
        if self.owner is not None and not role.user.is_anonymous and \
                self.owner == role.user:
            return True
        return super().has_perm(role, codename)

    def save_by(self, role):
        """
        User will be set as owner if there is none or object is being
        created.
        """
        super().save_by(role)
        if not self.is_saved and not role.user.is_anonymous:
            self.owner = role.user


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

    class Meta:
        unique_together = ('context', 'owner')

    def get_role(self, access=None):
        """
        Return an instance of Role for this subscription. If ``access``
        is given, it overrides ``self.access``.
        """
        if access is None:
            access = self.access
        cls = Roles.get(access)
        return cls(self.context, self.owner, self)


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
        blank=True, null=True,
    )
    granted = models.BooleanField(
        default=False,
    )

    def as_permission(self):
        """
        Return an instance of Permission (sub)class based on self's
        informations.
        """
        model = self.model.model_class() if self.model else None
        cls = Permissions.get((model, self.codename)) or Permission
        return cls(self.codename, model, self.granted)

