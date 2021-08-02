"""
Provide settings helpers for Django applications.
"""
from importlib import import_module

from .roles import Role, default_roles


__all__ = ('Settings', 'settings')


class Settings:
    """ Settings class helper """
    deprecated = set()
    """ Deprecated items in config. """
    key = ''
    """ Config key in django settings. """

    def __init__(self, key, default_config=None):
        # load_conf should be accessible BEFORE django loads config
        from django.conf import settings as d_settings

        if default_config:
            self.set_config(default_config)

        if key and hasattr(d_settings, key):
            config = d_settings.get(key)
            self.set_config(config)

    def set_config(self, config):
        """ Update Settings from config dict """
        for key, value in config.items():
            if hasattr(Settings, key):
                raise ValueError(f'"{key}" is not allowed')
            if not hasattr(self, key):
                if key in self.deprecated:
                    raise ValueError(f'"{key}" config is deprecated.')
                raise ValueError(f'"{key}" is not a config value')
        config = self.validate(config)
        self.__dict__.update(config)

    def validate(self, config):
        """ Return validated config. """
        return config

    def import_item(self, path):
        """ Import an item from module by path. """
        path, key = path.rsplit('.', 1)
        module = import_module(path)
        if not hasattr(module, key):
            raise ValueError(f'"{key}" not found in module "{path}"')
        return getattr(module, key)


class PeprCoreSettings(Settings):
    """
    Settings for Pepr Core application.
    """
    roles = {}
    """ Roles used by Django project. """

    def validate(self, config):
        if 'roles' in config:
            # TODO: check that all role are respected
            roles = (role if issubclass(role, Role) else self.import_item(role)
                     for role in config['roles'])
            config['roles'] = { role.access: role for role in roles }
        return config


settings = PeprCoreSettings('PEPR', {
    'roles': default_roles
})

