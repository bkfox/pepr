from django.utils.functional import cached_property
from django.utils.translation import ugettext_lazy as _

from pepr.perms.permissions import Permission, Permissions
from pepr.utils.metaclass import RegisterMeta


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
    def add(cls, role):
        if role.access in cls.register:
            logger.debug(
                '[pepr/perms] register {}: another class is yet '
                'registered for this access, it will be replaced.'
                .format(role.__name__)
            )

        if not isinstance(role.permissions, dict):
            role.defaults = {
                role.perm_key(p): p for p in role.defaults
            }
        super().add(role)


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
    defaults = []
    """
    [class] default permissions as `{ (perm, model): Permission }`.

    Sugar syntax: it can be set to a list of Permission instead
    of a dict
    """

    context = None
    """[instance] context in which this role applies."""
    user = None
    """[instance] user this role applies to."""
    subscription = None
    """[instance] if given, Subscription model."""

    @cached_property
    def permissions(self):
        """
        Permissions for this role instance (and its context), as
        a dict of { perm_key: role }
        """
        from pepr.perms.models import Authorization

        perms = self.defaults.copy()
        if not self.context:
            return perms

        qs = Authorization.objects.filter(
            context=self.context, access=self.access
        ).select_related('model')
        qs = (p.as_permission() for p in qs)

        perms.update({self.perm_key(p): p for p in qs})
        return perms

    def has_access(self, access):
        """
        Return True if access level is granted
        """
        return self.access >= access

    def has_perm(self, codename, model=None):
        """
        Return True if user has the given permission allowed.

        :param str codenmae: permission or permission codename
        :param Model model: if perm is a string, specifies model.
        """
        perm = self.get_perm(codename, model)
        return perm and perm.granted

    def get_perm(self, codename, model=None):
        """
        Return Permision object corresponding to the given info, get
        default permission if permission for the given model is not
        found.
        """
        permissions = self.permissions
        return permissions.get((codename, model)) or \
               model and permissions.get((codename, None))

    @classmethod
    def register(cls, codename=None, model=None, *initargs,
                 instance=None, **initkwargs):
        """
        Register a default permissions for this Role. If ``instance``
        is not given, create a new one with provided arguments.

        :return registered Permission instance
        """
        if instance is None:
            cls_ = Permissions.get(codename) or Permission
            instance = cls_(codename, model, *initargs, **initkwargs)
        cls.defaults[cls.perm_key(instance)] = instance
        return instance

    @classmethod
    def unregister(cls, codename=None, model=None, instance=None):
        """
        Unregister a default permission for this Role class
        """
        key = cls.perm_key(instance) if instance is not None else \
              cls.perm_key(codename, model)
        del cls.defautls[key]

    @staticmethod
    def perm_key(perm, model=None):
        """
        Key for permission in role's permissions.

        :param Permission|str perm: permission or permission codename
        :param Model model: if perm is a string, specifies model.
        """
        if isinstance(perm, str):
            return (perm, model)
        return (perm.codename, perm.model)

    def __init__(self, context, user, subscription=None):
        self.context = context
        self.user = user
        self.subcription = subscription


# Define a set of default roles. They can still be removed using
# ``Roles.remove()``.

class AnonymousRole(Role):
    access = -0x10
    name = _('Anonymous')
    description = _('Unregistered user')

class DefaultRole(Role):
    access = 0x10
    name = _('User')
    description = _('User not subscribed, we don\'t know who they are.')

class SubscriberRole(Role):
    access = 0x20
    name = _('Subscriber')
    description = _('Subscribed people that follow the place')

class MemberRole(Role):
    access = 0x40
    name = _('Member')
    description = _(
        'Subscribed people that can participate'
    )

class ModeratorRole(Role):
    access = 0x80
    name = _('Moderator')
    description = _(
        'People that must moderate the place'
    )

class AdminRole(Role):
    access = 0x100
    name = _('Admin')
    description = _(
        'Thoses who have all rights in the place'
    )

    @cached_property
    def permissions(self):
        return [Permission(codename, None, True)
            for codename in Permissions.items.keys()]

    def get_perm(self, codename, model=None):
        return Permission(codename, model, True)

    def has_perm(self, codename, model=None):
        return True
