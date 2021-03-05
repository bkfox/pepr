from django.core.exceptions import ImproperlyConfigured
from django.template import loader
from django.views.generic.base import ContextMixin, TemplateResponseMixin

from ..perms.models import Accessible
from ..perms.mixins import PermissionMixin
from ..perms.settings import settings


__all__ = ('Component',)


class Component(TemplateResponseMixin, ContextMixin, PermissionMixin):
    """
    A Component renders a template into string, handling permission check
    on ``Accessible`` objects (empty string returned when permissions are
    denied.
    """
    template_name = ''
    """
    Name of the template to load from `get_template` can be a list of/a
    single string.
    """
    object = None
    """ Object """

    permission_classes = tuple()
    action_permissions = None

    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            if not hasattr(self, k):
                raise ValueError('"{}" is not an attribute on class {}'.format(
                                 k, type(self).__name__))
            setattr(self, k, v)

    def get_object(self, obj=None):
        """
        Return given object or self.object
        """
        return self.object if obj is None else obj

    def render(self, role=None, obj=None, **kwargs):
        """ Render Component into a string and return it.  """
        obj = self.get_object(obj)
        if (isinstance(obj, Accessible) and \
                (not role or not self.can_obj(role, obj))) or \
                (obj is None and role and not self.can(role)):
            return ''

        context = self.get_context_data(role=role, object=obj, **kwargs)
        if context is None:
            return ''
        return self.get_template().render(context)

    def get_template(self, template_name=None):
        """
        Return Template instance to be used to render the component.

        :py:param str|None template_name: use this `template_name` \
                instead of `self.template_name`.
        """
        name = template_name or self.template_name
        if name is None:
            raise ImproperlyConfigured(
                "no `self.template_name` and no `template_name` given"
            )
        return loader.get_template(name) if isinstance(name, str) else \
            loader.select_template(name)

    def get_context_data(self, role=None, **kwargs):
        """ Ensure 'role' and 'context' are in resulting context """
        if role:
            kwargs.setdefault('role', role)
            kwargs.setdefault('roles', settings.roles)
        return super().get_context_data(**kwargs)


