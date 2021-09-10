import logging

from django.utils.functional import cached_property
from django.utils.translation import ugettext_lazy as _

from pepr.utils.functional import cached_result
from .permissions import CanAccess, CanCreate, CanUpdate, CanDestroy

__all__ = ('Role', 'AnonymousRole', 'DefaultRole', 'SubscriberRole',
           'MemberRole', 'ModeratorRole', 'AdminRole',
           'default_roles', 'display_roles')

logger = logging.getLogger('pepr')


class Role:
    """
    Role is assigned to user for a specific context defining what user can
    or not do.
    """
    access = 0
    """
    [class] Access permission level of the role, unique per roles set.
    Lower means less access, higher means more access.
    """
    name = ''
    """[class] name (displayed to user). """
    description = ''
    """[class] description displayed to user. """
    status = ''
    """[class] role status: admin, anonymous, etc. """
    # FIXME: inheritance & ref passing
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
        """ True if role is subscribed to context """
        return not self.is_anonymous and self.subscription is not None \
            and self.subscription.is_subscribed

    @property
    def is_admin(self):
        """ True if role is admin """
        return False

    @property
    def is_moderator(self):
        """ True if role is moderator """
        return self.is_admin

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

    @cached_property
    def services(self):
        """ Context's services available to current role. """
        return self.context.service_set.role(self)

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
        if hasattr(perm, 'label'):
            perm = perm.label
        if model:
            model = model if isinstance(model, str) else \
                model._meta.label_lower
            return f'{model}.{perm}'
        return perm

    def __init__(self, context, identity, subscription=None):
        self.context = context
        self.identity = identity
        self.subscription = subscription


# TODO
#class BannedRole(Role):
#    access = -0x20
#    status = 'banned'
#    name =_('Banned')
#    description = _('Banned user'
#
#    @property
#    def permissions(self):
#        return tuple()
#
#    def has_access(self, *a, **kw):
#        return False
#
#    def is_granted(self, *a, **kw):
#        return False
#

# Define a set of default roles. They can still be removed using
# ``Roles.remove()``.

class AnonymousRole(Role):
    """ Anonymous role: unregistered users. """
    access = -0x10
    status = 'anonymous'
    name = _('Anonymous')
    description = _('Unregistered user.')


AnonymousRole.register(None, False, CanAccess, CanCreate)


class DefaultRole(Role):
    """ Default role: Registered but not subscribed people. """
    access = 0x10
    status = 'registered'
    name = _('Registered')
    description = _('Registered but not subscribed people.')


DefaultRole.register(None, True, CanAccess)
DefaultRole.register(None, False, CanAccess, CanCreate, CanUpdate, CanDestroy)


class SubscriberRole(Role):
    """ Subscriber role: subscribe to a context. """
    access = 0x20
    status = 'subscriber'
    name = _('Subscriber')
    description = _('They only follow what happens.')


SubscriberRole.register(None, True, CanAccess, CanCreate)
SubscriberRole.register(None, False, CanCreate, CanUpdate, CanDestroy)


class MemberRole(Role):
    """ Member role: participating subscribed people. """
    access = 0x40
    status = 'member'
    name = _('Member')
    description = _(
        'Subscribed people that can participate.'
    )


MemberRole.register(None, True, CanAccess, CanCreate)
MemberRole.register(None, False, CanUpdate, CanDestroy)


class ModeratorRole(Role):
    """ Moderator role """
    access = 0x80
    status = 'moderator'
    name = _('Moderator')
    description = _(
        'People that must moderate the place.'
    )

    @property
    def is_moderator(self):
        return True


ModeratorRole.register(None, True, CanAccess, CanCreate, CanUpdate, CanDestroy)
# TODO: register subscription related perms


class AdminRole(Role):
    """ Admin role: has rights above everyone else inside a context """
    access = 0x100
    status = 'admin'
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
""" Roles by default. """

@cached_result
def display_roles():
    """ Return available roles as a serializable dictionary """
    from .settings import settings
    return {
        k: {'access': r.access, 'name': r.name, 'description': r.description,
            'status': r.status }
        for k, r in settings.roles.items()
    }


