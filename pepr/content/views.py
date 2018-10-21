import inspect

from django.db.models import Prefetch
from django.forms import HiddenInput, models as model_forms
from django.http import HttpResponse, Http404
from django.views.generic.base import View
from django.views.generic.detail import SingleObjectMixin, DetailView
from django.utils.translation import ugettext_lazy as _, ugettext as __

from django_filters import rest_framework as filters
from rest_framework import viewsets

from pepr.perms.views import AccessibleMixin
from pepr.ui.views import ComponentMixin, Slots, WidgetsComp, SiteView

from .models import Container, Content, Service
from .serializers import ContentSerializer
from .widgets import ContainerServicesWidget


class ContainerView(SingleObjectMixin, View):
    """
    Dispatch request to the view of corresponding Container's Service.
    """
    object = None
    model = Container
    service_model = Service

    def get_queryset(self):
        return super().get_queryset().select_subclasses() \
                   .user(self.request.user)

    def get_service_queryset(self):
        """
        Return queryset to retrieve service; container is available as
        ``self.object`` when this method is called from ``dispatch``.
        """
        if 'service_pk' in self.kwargs:
            kwargs = {'pk': self.kwargs['service_pk']}
        elif 'service_slug' in self.kwargs:
            kwargs = {'slug': self.kwargs['service_slug']}
        else:
            kwargs = {}

        return self.service_model.objects \
                   .select_subclasses() \
                   .filter(context=self.object, **kwargs) \
                   .user(self.request.user) \
                   .order_by('-is_default')

    def get_service(self):
        """ Return service for current request. """
        return self.get_service_queryset().first()

    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        if self.object is None:
            raise Http404(__('{container} not found').format(
                container=self.model._meta.verbose_name
            ))

        service = self.get_service()
        view = service.get_view()
        return view(request, service, *args, container=self.object,
                    **kwargs)

class ServiceView(SiteView, AccessibleMixin, View):
    """
    Base view class used for services rendering.
    """
    template_name = 'pepr/content/container.html'
    container = None
    service = None

    slots = Slots(SiteView.slots, {
        'sidebar': WidgetsComp('', items=[
            ContainerServicesWidget()
        ]),
    })

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['service'] = self.service
        context['container'] = self.container
        return context

    def dispatch(self, request, service, *args, container=None, **kwargs):
        self.service = service
        self.container = container or service.related_context
        return super().dispatch(request, *args, **kwargs)


class ContentFormComp(ComponentMixin):
    """
    Generic component rendering Content's form, whose class is
    ``form_class`` or created using Content's serializer (retrieved from
    ``Content.get_serializer_class``).
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
class ContentViewSet(viewsets.ModelViewSet):
    model = Content
    serializer_class = ContentSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ('mod_by','mod_date','created_by','created_date')

    def get_queryset(self):
        return self.model.objects.user(self.request.user)



