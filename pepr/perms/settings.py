from pepr.utils.settings import Settings
from .roles import Role, default_roles

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

