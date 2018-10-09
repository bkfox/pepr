from django.db.models import Prefetch
from django.forms import HiddenInput, models as model_forms
from django.views.generic.base import View
from django.views.generic.detail import DetailView
from django.http import HttpResponse

from rest_framework import viewsets

from pepr.content.models import Container, Content, Service
from pepr.perms.views import AccessibleMixin
from pepr.ui.views import ComponentMixin, Slots, WidgetsComp, SiteView



class BaseDetailView(SiteView, AccessibleMixin, DetailView):
    """
    Base class for ContainerItem elements.
    """
    template_name = 'pepr/content/container.html'

    def get_container(self):
        return self.object.related_context

    def get_queryset(self):
        # FIXME: prefetch context select_subclasses()
        return super().get_queryset().select_subclasses()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['container'] = self.get_container()
        return context


class ContainerDetailView(BaseDetailView):
    """
    Detail view for container
    """
    template_name = 'pepr/content/container.html'

    def get_container(self):
        return self.object

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object'] = Service.objects.filter(
            context=self.object, is_enabled=True,
        ).select_subclasses().order_by('-is_default').first()
        return context


class ServiceDetailView(BaseDetailView):
    def get_queryset(self):
        return super().get_queryset().filter(is_enabled=True)


class ContentFormComp(ComponentMixin):
    """
    Simple wrapper component over a form
    Provide a view that can be used to render form of Content.
    It uses its Serializer in order to retrieve the fields list
    to display.
    """
    slots = Slots({
    })

    model = None
    """
    Model concerned by the form.
    """

    form_class = None
    """
    Form class used for rendering. If None, get serializer from Content
    model and create a form using it.
    """
    context_id = None
    """ context to post content on """
    form_kwargs = None
    """ form init kwargs """
    template_name = 'pepr/content/content_form.html'

    def get_form_class(self):
        if self.form_class:
            return self.form_class

        serializer = self.model.get_serializer_class()
        fields = serializer._writable_fields
        return model_forms.modelform_factory(self.model, fields=fields)

    def get_form_kwargs(self):
        kwargs = self.form_kwargs
        return kwargs

    def get_form(self):
        form_class = self.get_form_class()
        form = form_class(**self.get_form_kwargs())
        self.prepare_form(form)
        return form

    def prepare_form(self, form):
        form.fields['context'].widget = HiddenInput()
        pass

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = self.get_form()
        return context

    def __init__(self, form_class, template_name=template_name,
                 **form_kwargs):
        self.form_class = form_class
        self.template_name = template_name
        self.form_kwargs = form_kwargs


#
# API
#
from .serializers import ContentSerializer

class ContentViewSet(viewsets.ModelViewSet):
    model = Content
    serializer_class = ContentSerializer

    def get_queryset(self):
        return self.model.objects.user(self.request.user)

