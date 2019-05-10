from django.forms import TextInput

from ..ui.components import Component, Slots, FormComp
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


class ContentFormComp(FormComp):
    """
    Component rendering a form to create/edit Content instances.
    """
    form_class = ContentForm
    template_name = 'pepr/content/content_form.html'

    def get_form(self, **kwargs):
        """ Return form instance """
        form = super().get_form(**kwargs)
        # TODO: remove this ↓
        form.fields['text'].widget = TextInput()
        return form


