from django.forms import TextInput, models as model_forms

from pepr.ui.views import ComponentMixin, Slots, Widgets
from .widgets import DeleteActionWidget


class ContentComp(ComponentMixin):
    template_name = 'pepr/content/content.html'
    slots = Slots({
        'actions-menu': Widgets('b-dropdown', {
                'right': True, 'toggle-class': 'btn-light'
            },
            items=[
            DeleteActionWidget(
                css_class='dropdown-item',
                action='/content/{this.sender.pk}/',
            ),
        ])
    })


class ContentFormComp(ComponentMixin):
    """
    Generic component rendering Content's form, whose class is
    ``form_class`` or created using Content's serializer (retrieved from
    ``Content.get_serializer_class``).
    """
    slots = Slots({
    })

    model = None
    """ Model concerned by the form.  """
    form_class = None
    """
    Form class used for rendering. If None, get serializer from Content
    model and create a form using it.
    """
    container = None
    """ Context to post content on. """
    form_kwargs = None
    """ Init kwargs for the Form instance. """
    template_name = 'pepr/content/content_form.html'

    def get_form_class(self):
        if self.form_class:
            return self.form_class

        serializer = self.model.get_serializer_class()
        fields = serializer._writable_fields
        return model_forms.modelform_factory(self.model, fields=fields)

    def get_form_kwargs(self):
        kwargs = self.form_kwargs or {}
        initial = kwargs.setdefault('initial', {})
        initial.setdefault('context', self.container.id)
        initial.setdefault('access', self.container.access)
        return kwargs

    def get_form(self):
        form_class = self.get_form_class()
        form = form_class(role=self.role, **self.get_form_kwargs())
        self.prepare_form(form)
        return form

    def prepare_form(self, form):
        form.fields['text'].widget = TextInput()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = self.get_form()
        return context

    def __init__(self, form_class, container, **kwargs):
        self.form_class = form_class
        self.container = container
        self.__dict__.update(kwargs)


