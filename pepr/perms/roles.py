import logging
from collections import namedtuple

from django.utils.functional import cached_property
from django.utils.translation import ugettext_lazy as _

from ..utils.register import Register
from ..utils.metaclass import RegisterMeta

from .permissions import CanAccess, CanCreate, CanUpdate, CanDestroy

__all__ = ['Roles', 'Role',
           'AnonymousRole', 'DefaultRole', 'SubscriberRole',
           'MemberRole', 'ModeratorRole', 'AdminRole']


logger = logging.getLogger('pepr')


class RolesRegister(Register):
    by_name = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.by_name = {}

    def reset(self, *args, **kwargs):
        r = super().reset(*args, **kwargs)
        self.by_name = {r.__name__: r for r in self.values()}
        return r

class Roles(RegisterMeta):
    """
    Register class that list all defined Role for the project. It also
    keeps track of which role is related to a specific role.
    """
    register_class = RolesRegister
    entry_key_attr = 'access'

    @classmethod
    def get_base_class(cls):
        return Role

    @classmethod
    def add(cls, role, *args, **kwargs):
        # ensure defaults is a copy
        defaults, role.defaults = role.defaults, {}
        role.defaults.update(defaults)

        if role.access in cls.register:
            logger.debug(
                '[pepr/perms] register {}: another class is yet '
                'registered for this access, it will be replaced.'
                .format(role.__name__)
            )
        return super().add(role, *args, **kwargs)

# FIXME: Role as a Register class. Problem: Register meant to be used
#        as an instance; __getattr__ is also only for an instance.
# TODO: register/unregister permission
class Role(metaclass=Roles):
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
    [class] default permissions as `{ (perm, model): granted }`.

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
        Permissions for this role taking including context
        authorizations, as dict of ``{ perm_key: granted }``.
        """
        from ..perms.models import Authorization

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

    def is_granted(self, perm, model):
        """ Return RolePermission for the given perm and model.  """
        permissions = self.permissions
        for m in (model, None):
            test = permissions.get(self.perm_key(perm, m), None)
            if test is not None:
                return test
        return False

    @classmethod
    def register(cls, model, granted, *perms):
        """ Register a permission for the given model and role.  """
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
        from .permissions import Permissions
        perm = Permissions.get(perm) if isinstance(perm, str) else perm
        return perm, model

    def __init__(self, context, identity, subscription=None):
        self.context = context
        self.identity = identity
        self.subscription = subscription


# Define a set of default roles. They can still be removed using
# ``Roles.remove()``.

class AnonymousRole(Role):
    access = -0x10
    name = _('Anonymous')
    description = _('Unregistered user.')


AnonymousRole.register(None, False, CanAccess, CanCreate)


class DefaultRole(Role):
    access = 0x10
    name = _('Registered')
    description = _('Registered but not subscribed people.')


DefaultRole.register(None, True, CanAccess)
DefaultRole.register(None, False, CanAccess, CanCreate, CanUpdate, CanDestroy)


class SubscriberRole(Role):
    access = 0x20
    name = _('Subscriber')
    description = _('They only follow what happens.')


SubscriberRole.register(None, True, CanAccess, CanCreate)
SubscriberRole.register(None, False, CanCreate, CanUpdate, CanDestroy)


class MemberRole(Role):
    access = 0x40
    name = _('Member')
    description = _(
        'Subscribed people that can participate.'
    )


MemberRole.register(None, True, CanAccess, CanCreate)
MemberRole.register(None, False, CanUpdate, CanDestroy)


class ModeratorRole(Role):
    access = 0x80
    name = _('Moderator')
    description = _(
        'People that must moderate the place.'
    )


ModeratorRole.register(None, True, CanAccess, CanCreate, CanUpdate, CanDestroy)


class AdminRole(Role):
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


