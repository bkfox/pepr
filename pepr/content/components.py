from django.forms import TextInput, models as model_forms

from ..ui.components import Component, Slots
from ..ui.widgets import ActionWidgets

from .forms import ContentForm
from .widgets import DeleteActionWidget, EditActionWidget


class ContentComp(Component):
    template_name = 'pepr/content/content.html'
    slots = Slots([
        ActionWidgets(
            'menu',
            tag_attrs={'right': True, 'toggle-class': 'btn-light'},
            items=[
                EditActionWidget(tag_attrs={'class': 'dropdown-item'}),
                DeleteActionWidget(tag_attrs={
                    'class': 'dropdown-item bg-danger text-light'
                }),
            ],
        )
    ])


class ContentFormComp(Component):
    """
    Component rendering a form to create/edit Content instances.
    """
    form_class = ContentForm
    """ form class to use """
    form_kwargs = None
    """ form kwargs to use """

    template_name = 'pepr/content/content_form.html'

    def get_form_class(self, **kwargs):
        """ Return form class """
        return self.form_class

    def get_form_kwargs(self, role, object=None, **kwargs):
        """ Return form init kwargs. """
        kwargs = self.form_kwargs or {}
        kwargs.setdefault('role', role)

        if object:
            kwargs.setdefault('instance', object)
        else:
            initial = kwargs.setdefault('initial', {})
            initial.setdefault('context', role.context.id)
            initial.setdefault('access', role.context.access)
        return kwargs

    def get_form(self, **kwargs):
        """ Return form instance """
        form_class = self.get_form_class(**kwargs)
        form_kwargs = self.get_form_kwargs(**kwargs)
        form = form_class(**form_kwargs)
        # TODO: remove this ↓
        form.fields['text'].widget = TextInput()
        # remove that there ↑
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


