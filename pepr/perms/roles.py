from enum import IntEnum

from django.utils.functional import cached_property

from pepr.perms.permissions import Permission, Privilege
from pepr.utils.metaclass import RegisterMeta


class Roles(RegisterMeta):
    """
    Register class that list all defined Role for the project. It also
    keeps track of which role is related to a specific role.
    """
    key = 'access'

    @classmethod
    def get_base_class(cls):
        return Role

    @classmethod
    def register(cls, role):
        # TODO: warning when key exists yet in items
        if not isinstance(role.permissions, dict):
            role.defaults = {
                role.perm_key(p): p for p in role.defaults
            }
        super().register(role)


class Role(metaclass=Roles):
    access = 0
    """
    [class] Defines an access level for the role (used as key), that is
    also used as a unique identifier.

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
        Permissions for this role instance (and its context).
        """
        from pepr.perms.models import Authorization

        perms = self.defaults.copy()
        if not self.context:
            return perms

        qs = Authorization.objects.filter(
            context = self.context, role = self.role
        ).select_related('model')
        qs = ( p.as_permission() for p in qs )

        perms.update({ self.perm_key(p): p for p in qs })
        return perms

    def get_perm(self, codename, model = None):
        """
        Return Permision object corresponding to the given info, get
        default permission if permission for the given model is not
        found.
        """
        permissions = self.permissions
        return permissions.get((codename, model)) or \
                model and permissions.get((codename, None))

    def has_perm(self, codename, model = None):
        """
        Return True if user has the given permission allowed.

        :param str codenmae: permission or permission codename
        :param Model model: if perm is a string, specifies model.
        """
        perm = self.get_perm(codename, model)
        return perm and perm.privilege == Privilege.Allowed

    @classmethod
    def register(cl, perm):
        """
        Register a default permission for this Role class
        """
        cl.defaults[cl.perm_key(perm)] = perm

    @classmethod
    def unregister(cl, perm):
        """
        Unregister a default permission for this Role class
        """
        del cl.defaults[cl.perm_key(perm)]

    @staticmethod
    def perm_key(perm, model = None):
        """
        Key for permission in role's permissions.

        :param Permission|str perm: permission or permission codename
        :param Model model: if perm is a string, specifies model.
        """
        if isinstance(perm, str):
            return (perm, model)
        return (perm.codename, perm.model)

    def __init__(self, context, user, subscription = None):
        self.context = context
        self.user = user
        self.subcription = subscription


