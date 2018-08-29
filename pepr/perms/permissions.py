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
    As a class: define a new type of Permission.

    As an instance: used by Access in order to define
    its default permissions.
    """
    codename = ''
    """[class/instance] permission id"""
    name = ''
    """[class] name displayed to user"""
    description = ''
    """[class] description displayed to user"""
    is_allowed = False
    """Allowance set for this permission"""
    model = None
    """
    Permission target a specific model. When None is specified, Permission
    is used as default for any models.
    """

    def __init__(self, codename, model, is_allowed = False):
        self.codename = codename
        self.model = model
        self.is_allowed = is_allowed

