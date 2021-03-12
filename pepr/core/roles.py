import logging

from django.utils.functional import cached_property
from django.utils.translation import ugettext_lazy as _

from .permissions import CanAccess, CanCreate, CanUpdate, CanDestroy

__all__ = ('Role', 'AnonymousRole', 'DefaultRole', 'SubscriberRole',
           'MemberRole', 'ModeratorRole', 'AdminRole',
           'default_roles')

logger = logging.getLogger('pepr')


class Role:
    """
    Role is assigned to user for a specific context defining what user can
    or not do.
    """
    access = 0
    """
    [class] Defines an access level for the role (used as key), that is
    also used as a unique identifier. Only one role per access level is
    authorized.

    Lower means less access, higher means more access.
    """
    name = ''
    """[class] name (displayed to user)"""
    description = ''
    """[class] description displayed to user"""
    defaults = {}
    """
    [class] default permissions as `{ perm_key: granted }`.

    ``perm_key`` is a string such as: ``perm.label ['.' model.db_table]``

    Sugar syntax: it can be set to a list of Permission instead
    of a dict
    """

    context = None
    """[instance] context in which this role applies."""
    identity = None
    """[instance] identity this role applies to."""
    subscription = None
    """[instance] if given, Subscription model."""

    @property
    def is_anonymous(self):
        """ True if role is for a unauthenticated identity """
        return self.identity is None

    @property
    def is_subscribed(self):
        """ True if identity is subscribed to related context """
        return not self.is_anonymous and self.subscription is not None \
            and self.subscription.is_subscribed

    @property
    def is_admin(self):
        """ True if identity is an admin """
        return False

    @cached_property
    def permissions(self):
        """
        Permissions for role instance, based on context and access
        level, as dict of ``{ perm_key: granted }``.
        """
        from .models import Authorization

        perms = self.defaults.copy()
        if not self.context:
            return perms

        qs = Authorization.objects.filter(
            context=self.context, access=self.access
        ).select_related('model')
        for p in qs:
            key = self.perm_key(p)
            # Rule: only permissions statically defined on Role can be
            # changed by users through authorizations.
            if key not in perms:
                continue
            perms[key] = p.granted
        return perms

    def has_access(self, access, strict=False):
        """ Return True if role sufficient access level. If strict is
        used, role access must be strictly bigger than access. """
        return self.access > access if strict else \
               self.access >= access

    def is_granted(self, perm, model=None):
        """ Return wether permission is granted for the given model.  """
        if self.is_admin:
            return True
        permissions = self.permissions
        if model:
            test = permissions.get(self.perm_key(perm, model), None)
            if test is not None:
                return test
        return permissions.get(self.perm_key(perm), False)

    @classmethod
    def register(cls, model, granted, *perms):
        """ Register a permission for the given model and role. """
        for perm in perms:
            cls.defaults[cls.perm_key(perm, model)] = granted

    @classmethod
    def unregister(cls, perm, model):
        """ Unregister a permission for this Role class """
        del cls.defaults[cls.perm_key(perm, model)]

    @staticmethod
    def perm_key(perm, model=None):
        """
        Key for permission in role's permissions.

        :param Permission|str perm: permission or permission codename
        :param Model model: if perm is a string, specifies model.
        """
        from .permissions import Permission
        perm = perm.label if isinstance(perm, Permission) else perm
        if model:
            model = model if isinstance(model, str) else model._meta.db_table
            return f'{perm}.{model}'
        return perm

    def __init__(self, context, identity, subscription=None):
        self.context = context
        self.identity = identity
        self.subscription = subscription


# Define a set of default roles. They can still be removed using
# ``Roles.remove()``.

class AnonymousRole(Role):
    """ Anonymous role: unregistered users. """
    access = -0x10
    name = _('Anonymous')
    description = _('Unregistered user.')


AnonymousRole.register(None, False, CanAccess, CanCreate)


class DefaultRole(Role):
    """ Default role: Registered but not subscribed people. """
    access = 0x10
    name = _('Registered')
    description = _('Registered but not subscribed people.')


DefaultRole.register(None, True, CanAccess)
DefaultRole.register(None, False, CanAccess, CanCreate, CanUpdate, CanDestroy)


class SubscriberRole(Role):
    """ Subscriber role: subscribe to a context. """
    access = 0x20
    name = _('Subscriber')
    description = _('They only follow what happens.')


SubscriberRole.register(None, True, CanAccess, CanCreate)
SubscriberRole.register(None, False, CanCreate, CanUpdate, CanDestroy)


class MemberRole(Role):
    """ Member role: participating subscribed people. """
    access = 0x40
    name = _('Member')
    description = _(
        'Subscribed people that can participate.'
    )


MemberRole.register(None, True, CanAccess, CanCreate)
MemberRole.register(None, False, CanUpdate, CanDestroy)


class ModeratorRole(Role):
    """ Moderator role """
    access = 0x80
    name = _('Moderator')
    description = _(
        'People that must moderate the place.'
    )


ModeratorRole.register(None, True, CanAccess, CanCreate, CanUpdate, CanDestroy)


class AdminRole(Role):
    """ Admin role: has rights above everyone else inside a context """
    access = 0x100
    name = _('Admin')
    description = _(
        'Thoses who have all rights in the place.'
    )

    @property
    def is_admin(self):
        return True

    @cached_property
    def permissions(self):
        # permissions never change => default permissions
        return self.defaults


AdminRole.register(None, True, CanAccess, CanCreate, CanUpdate, CanDestroy)


default_roles = (AnonymousRole, DefaultRole, SubscriberRole, MemberRole,
                 ModeratorRole, AdminRole)
""" Roles provided by default. """

