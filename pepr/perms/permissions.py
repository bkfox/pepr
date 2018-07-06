from enum import IntEnum

from pepr.utils.metaclass import RegisterMeta


class Privilege(IntEnum):
    """
    Defines privilege for a specific Permission (if permission
    is allowed or refused).
    """
    Default = 0x00
    Refused = 0x01
    Allowed = 0x02


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
    privilege = Privilege.Refused
    """Privilege set for this permission"""
    model = None
    """
    Permission target a specific model. When None is specified, Permission
    is used as default for any models.
    """

    def __init__(self, codename, model, privilege = None):
        self.codename = codename
        self.model = model
        self.privilege = Privilege.Default if privilege is None else \
                         privilege

