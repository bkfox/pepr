from django.utils.translation import ugettext_lazy as _

from pepr.utils.register import Register
from pepr.utils.metaclass import RegisterMeta


class Permissions(RegisterMeta):
    """
    Register class for permissions
    """
    class Register(Register):
        def get_entry_key(self, entry):
            return (entry.model, entry.codename)

    register_class = Register

    @classmethod
    def should_add(cls, cl):
        return cl.model and cl.codename and \
                super().should_add(cl)

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

    def has_perm(self, role):
        return self.granted

    def _get_formated(self, attr):
        attr = getattr(self, attr)
        return attr.format(
            model=self.model,
            model_name=self.model._meta.verbose_name.title()
                if self.model else _('element'),
        )

    def get_name(self):
        self._get_formated('name')

    def get_description(self):
        self._get_formated('description')


class PermissionCreate(Permission):
    """ Permission to create object """
    codename = 'create'
    name = _('Create a new {model_name}')

class PermissionUpdate(Permission):
    """ Permission to update object """
    codename = 'update'
    description = _('Update any existing {model_name}')

class PermissionDelete(Permission):
    codename = 'delete'
    description = _('Delete any existing {model_name}')

