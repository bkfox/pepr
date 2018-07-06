"""
Define default ready-to-use values for permission system.
"""
from django.utils.functional import cached_property
from django.utils.translation import ugettext_lazy as _

from pepr.perms.permissions import Permission, Permissions, Privilege
from pepr.perms.roles import Role


class AnonymousRole(Role):
    access = -0x01
    name = _('Anonymous')
    description = _('Unregistered user')

class DefaultRole(Role):
    access = 0x00
    name = _('User')
    description = _('User not subscribed, we don\'t know who they are.')

class SubscriberRole(Role):
    access = 0x02
    name = _('Subscriber')
    description = _('Subscribed people that follow the place')

class MemberRole(Role):
    access = 0x04
    name = _('Member')
    description = _(
        'Subscribed people that can participate'
    )

class ModeratorRole(Role):
    access = 0x10
    name = _('Moderator')
    description = _(
        'People that must moderate the place'
    )

class AdminRole(Role):
    access = 0x1312
    name = _('Admin')
    description = _(
        'Thoses who have all rights in the place'
    )

    @cached_property
    def permissions(self):
        return [ Permission(codename, None, Privilege.Allowed)
                    for codename in Permissions.items.keys() ]

    def get_perm(self, codename, model = None):
        return Permission(codename, model, Privilege.Allowed)

    def has_perm(self, codename, model = None):
        return True


