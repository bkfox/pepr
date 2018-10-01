from enum import IntEnum

from pepr.utils.metaclass import RegisterMeta


class Permissions(RegisterMeta):
    """
    Register class for permissions
    """
    key = 'codename'

    @classmethod
    def get_base_class(cls):
        return Permission


class Permission(metaclass=Permissions):
    """
    This class is used to describe permissions and also to grant
    (or not) permission to roles.
    """
    codename = ''
    """[class/instance] permission id"""
    name = ''
    """[class] name displayed to user"""
    description = ''
    """[class] description displayed to user"""
    granted = False
    """Allowance set for this permission"""
    model = None
    """
    Permission target a specific model. When None is specified, Permission
    is used as default for any models.
    """

    def __init__(self, codename, model, granted=False):
        self.codename=codename
        self.model = model
        self.granted = granted

