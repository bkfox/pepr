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

from pepr.perms.views import AccessibleViewMixin, AccessibleGenericAPIMixin
from pepr.ui.views import ComponentMixin, Slots, Widgets, SiteView
from pepr.ui.widgets import DropdownLinkWidget

from .models import Container, Content, Service
from .forms import ContainerForm
from .serializers import ContentSerializer
from .widgets import ContainerServicesWidget


class ContainerBaseView(SiteView):
    """
    Base view class related to a container.
    """
    slots = Slots(SiteView.slots, {
        # settings menu
        'container-settings-menu': Widgets('', items=[
            DropdownLinkWidget(
                title="Settings", icon="fa-cog fas",
                url_name='pepr.container.settings',
                get_url_kwargs=lambda s: {'pk': s.context.pk},
            )
        ]),
        # subscription menu management (invitation, etc.)
        'container-subscriptions-menu': Widgets('', items=[
        ]),
        # left sidebar
        'container-sidebar': Widgets(
            'div', {'class': 'col-2 sidebar'},
            items=[ContainerServicesWidget(slot='container-sidebar')]
        ),
    })

    template_name = 'pepr/content/container.html'
    object = None



# FIXME: generic version as RoleViewMixin in perms or ui?
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
        # FIXME: more elegant flow
        self.object = self.get_object()
        if self.object is None:
            raise Http404(__('{context} not found').format(
                context=self.model._meta.verbose_name
            ))

        role = self.object.get_role(request.user)
        service = self.get_service()
        view = service.as_view()
        return view(request, service, *args, role=role,
                    **kwargs)


class ServiceView(ContainerBaseView):
    """
    Base view class used for services rendering.
    """
    template_name = 'pepr/content/container.html'
    service = None

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['service'] = self.service
        return context

    def dispatch(self, request, service, *args, role=None, **kwargs):
        self.service = service
        if role is None:
            role = service.related_context.get_user(request.user)
        return super().dispatch(request, *args, role=role, **kwargs)


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
##
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


