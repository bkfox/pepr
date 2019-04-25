import logging
from collections import namedtuple

from django.utils.functional import cached_property
from django.utils.translation import ugettext_lazy as _

from ..utils.metaclass import RegisterMeta

from .permissions import *

__all__ = ['Roles', 'Role',
           'AnonymousRole', 'DefaultRole', 'SubscriberRole',
           'MemberRole', 'ModeratorRole', 'AdminRole']


logger = logging.getLogger('pepr')


class Roles(RegisterMeta):
    """
    Register class that list all defined Role for the project. It also
    keeps track of which role is related to a specific role.
    """
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
    user = None
    """[instance] user this role applies to."""
    subscription = None
    """[instance] if given, Subscription model."""

    @property
    def is_anonymous(self):
        """ True if role is for a unauthenticated user """
        return self.user is None or self.user.is_anonymous

    @property
    def is_subscribed(self):
        """ True if user is subscribed to related context """
        return not self.is_anonymous and self.subscription is not None \
            and self.subscription.is_subscribed

    @property
    def is_admin(self):
        """ True if user is an admin """
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
        return permissions.get(self.perm_key(perm, model))

    @classmethod
    def register(cls, perm, model, granted=False):
        """ Register a permission for the given model and role.  """
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

    def __init__(self, context, user, subscription=None):
        self.context = context
        self.user = user
        self.subscription = subscription


# Define a set of default roles. They can still be removed using
# ``Roles.remove()``.

class AnonymousRole(Role):
    access = -0x10
    name = _('Anonymous')
    description = _('Unregistered and unknown user (can be anyone).')

class DefaultRole(Role):
    access = 0x10
    name = _('User')
    description = _('Registered user who is not subscribed.')

class SubscriberRole(Role):
    access = 0x20
    name = _('Subscriber')
    description = _('They only follow what happens.')

class MemberRole(Role):
    access = 0x40
    name = _('Member')
    description = _(
        'Subscribed people that can participate.'
    )

class ModeratorRole(Role):
    access = 0x80
    name = _('Moderator')
    description = _(
        'People that must moderate the place.'
    )

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

