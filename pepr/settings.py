"""
Provide settings helpers for Django applications.
"""
from importlib import import_module
import glob
import os.path


__all__ = ('load_conf', 'Settings')


def load_conf(*source_dirs, globals = None, ext='.conf.py'):
    """
    Load config files from given directories, returning updated globals.
    """
    globals = globals or {}
    for src in source_dirs:
        files = glob.glob(os.path.join(src, f'*{ext}'))
        files.sort()
        for f in files:
            try:
                exec(open(f).read(), globals)
            except Exception as err:
                raise RuntimeError(f'{f}: {err}')
    return globals


class Settings:
    """ Settings class helper """
    deprecated = set()
    """ Deprecated items in config. """

    def __init__(self, key, default_config=None):
        # load_conf should be accessible BEFORE django loads config
        from django.conf import settings

        if default_config:
            self.set_config(default_config)

        if key and hasattr(settings, key):
            config = getattr(settings, key)
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


