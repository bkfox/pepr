from pepr.settings import Settings
from .roles import Role, default_roles

__all__ = ('PeprPermsSettings', 'settings')

class PeprPermsSettings(Settings):
    roles = {}

    def validate(self, config):
        if 'roles' in config:
            # TODO: check on anonymous and admin role
            roles = (role if issubclass(role, Role) else self.import_item(role)
                     for role in config['roles'])
            config['roles'] = { role.access: role for role in roles }
        return config

settings = PeprPermsSettings('PEPR_PERMS', {
    'roles': default_roles
})

