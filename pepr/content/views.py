import inspect

from django.db.models import Prefetch
from django.forms import HiddenInput, TextInput, models as model_forms
from django.http import HttpResponse, Http404
from django.views.generic.base import View
from django.views.generic.detail import SingleObjectMixin, DetailView
from django.views.generic.edit import CreateView, UpdateView
from django.utils.translation import ugettext_lazy as _, ugettext as __

from django_filters import rest_framework as filters
from rest_framework import viewsets

from pepr.perms.views import AccessibleMixin, AccessibleGenericAPIMixin
from pepr.ui.views import ComponentMixin, Slots, Widgets, SiteView
from pepr.ui.widgets import DropdownLinkWidget

from .models import Container, Content, Service
from .forms import ContainerForm
from .serializers import ContentSerializer
from .widgets import ContainerServicesWidget


class ContainerBaseView(SiteView, View):
    """
    Base view class related to a container.
    """
    slots = Slots(SiteView.slots, {
        # settings menu
        'container-settings-menu': Widgets('', items=[
            DropdownLinkWidget(
                title="Settings", icon="fa-cog fas",
                url_name='pepr.container.settings',
                get_url_kwargs=lambda s: {'pk': s.kwargs['container'].pk},
            )
        ]),
        # subscription menu management (invitation, etc.)
        'container-subscriptions-menu': Widgets('', items=[
        ]),
        # left sidebar
        'container-sidebar': Widgets('', items=[
            ContainerServicesWidget(slot='container-sidebar')
        ]),
    })

    template_name = 'pepr/content/container.html'
    object = None

    def get_container(self):
        """
        Return current container. By default, assume container is
        ``self.object``.
        """
        return self.container or self.object

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['container'] = self.get_container()
        return context

    def dispatch(self, request, *args, container=None, **kwargs):
        self.container = container
        return super().dispatch(request, *args, **kwargs)


class ServeServiceView(SingleObjectMixin, View):
    """
    Dispatch request to the view of requested service.
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


class ServiceView(ContainerBaseView, AccessibleMixin):
    """
    Base view class used for services rendering.
    """
    template_name = 'pepr/content/container.html'
    container = None
    service = None

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['service'] = self.service
        return context

    def dispatch(self, request, service, *args, container=None, **kwargs):
        self.service = service
        container = container or service.related_context
        return super().dispatch(request, *args, container=container, **kwargs)


# TODO HERE:
# - todo different settings views:
#   - basic: edit container, default service
#   - subscriptions
#   - security: access, permissions
#   - enabled services
class ContainerSettingsView(ContainerBaseView, UpdateView):
    """
    Service used to manage container's settings.
    """
    slots = Slots(ContainerBaseView.slots, {
        # use this to add settings tabs
        'container-settings-tabs': Widgets(''),
    })

    model = Container
    fields = ['title', 'description', 'access']
    template_name = 'pepr/content/container_settings.html'

    def form_valid(self, form):
        self.object = form.save()
        return self.get(self.request, *self.args, **self.kwargs)

    def get_queryset(self):
        return super().get_queryset().select_subclasses()



#
# Utils
#
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
    container = None
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
        kwargs = self.form_kwargs or {}
        initial = kwargs.setdefault('initial', {})
        initial.setdefault('context', self.container.id)
        initial.setdefault('access', self.container.access)
        return kwargs

    def get_form(self):
        form_class = self.get_form_class()
        form = form_class(**self.get_form_kwargs())
        self.prepare_form(form)
        return form

    def prepare_form(self, form):
        form.fields['context'].widget = HiddenInput()
        form.fields['text'].widget = TextInput()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = self.get_form()
        return context

    def __init__(self, form_class, container, **kwargs):
        self.form_class = form_class
        self.container = container
        self.__dict__.update(kwargs)

#
# API
#
class ContentViewSet(AccessibleGenericAPIMixin, viewsets.ModelViewSet):
    model = Content
    serializer_class = ContentSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ('mod_by','mod_date','created_by','created_date')

    @classmethod
    def register_to(cls, router):
        """
        Register this viewset to the given router; it should be used in
        order to provide consistent interfaces and urls using model's
        informations (``Content.url_basename`` and ``Content.url_prefix```)
        """
        return router.register(cls.model.url_prefix, cls,
                               cls.model.url_basename)

    def get_queryset(self):
        return self.model.objects.user(self.request.user)

    def get_serializer(self, *args, **kwargs):
        kwargs.setdefault('current_user', self.request.user)
        return super().get_serializer(*args, **kwargs)


