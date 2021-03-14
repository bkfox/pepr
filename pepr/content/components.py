from django.core.exceptions import ImproperlyConfigured
from django.template import loader
from django.views.generic.base import ContextMixin, TemplateResponseMixin

from pepr.core.assets import roles as roles_info
from pepr.core.models import Accessible
from pepr.core.mixins import PermissionMixin
from pepr.core.settings import settings
from .forms import ContentForm


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

    def get_object(self, object=None):
        """
        Return given object or self.object
        """
        return self.object if object is None else object

    def render(self, role=None, object=None, **kwargs):
        """ Render Component into a string and return it.  """
        obj = self.get_object(object)
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


class FormComp(Component):
    """ Component rendering a form """
    form_class = None
    """ form class to use """
    form_kwargs = None
    """ form kwargs to use """

    def get_form_class(self, **kwargs):
        """ Return form class """
        return self.form_class

    def get_form_kwargs(self, role, object=None, **kwargs):
        """ Return form init kwargs. """
        kwargs = self.form_kwargs or {}

        if role:
            kwargs.setdefault('role', role)

        if object:
            kwargs.setdefault('instance', object)
        elif role:
            initial = kwargs.setdefault('initial', {})
            initial.setdefault('context', role.context.uuid)
            initial.setdefault('access', role.context.access)
        return kwargs

    def get_form(self, **kwargs):
        """ Return form instance """
        form_class = self.get_form_class(**kwargs)
        form_kwargs = self.get_form_kwargs(**kwargs)
        form = form_class(**form_kwargs)
        return form

    def get_context_data(self, **kwargs):
        if 'form' not in kwargs:
            kwargs['form'] = self.get_form(**kwargs)
        kwargs.setdefault('model', kwargs['form']._meta.model)
        return super().get_context_data(**kwargs)

    def __init__(self, form_class=None, form_kwargs=None, **kwargs):
        if form_class is not None:
            self.form_class = form_class
        if form_kwargs is not None:
            self.form_kwargs = form_kwargs
        super().__init__(**kwargs)


class AccessibleFormComp(FormComp):
    def get_context_data(self, roles=None, **kwargs):
        if roles is None:
            roles = roles_info()
        return super().get_context_data(roles=roles, **kwargs)


class ContentFormComp(AccessibleFormComp):
    form_class = ContentForm
    template_name = 'pepr_content/content_form.html'


