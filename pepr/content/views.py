from django.views.generic.base import View
from django.views.generic.detail import SingleObjectMixin
from django.views.generic.edit import UpdateView
from django.utils.translation import ugettext_lazy as _

from django_filters import rest_framework as filters
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from pepr.perms.mixins import AccessibleGenericAPIMixin, \
    ContextMixin
from pepr.ui.views import SiteView
from pepr.ui.components import Slots, Widgets
from pepr.ui.widgets import DropdownLinkWidget, DropdownWidgets

from .components import ContentFormComp
from .models import Container, Content, Service
from .serializers import ContentSerializer
from .widgets import ContainerServicesWidget


class ContainerBaseView(SiteView):
    """
    Base view class related to a container.
    """
    slots = Slots(SiteView.slots, [
        # left sidebar
        Widgets('container-sidebar', 'div', {'class': 'col-2 sidebar'},
                items=[ContainerServicesWidget()]),
        # settings menu
        DropdownWidgets('container-settings-menu', '', items=[
            DropdownLinkWidget(
                text=_("Settings"), icon="fa-cog fas",
                url_name='pepr.container.settings',
                url_kwargs=lambda s, object, **kwargs: {'pk': str(object.pk)},
                required_perm='manage',
            )
        ]),
        # subscription menu management (invitation, etc.)
        DropdownWidgets('container-subscriptions-menu', '', items=[]),
    ])

    template_name = 'pepr/content/container.html'


class ContainerServiceView(SingleObjectMixin, View):
    """
    Container detail view for services. Retrieve service using kwargs'
    ``service_pk`` or ``service_slug``, retrieve view and render it.
    """
    object = None
    model = Container
    service_model = Service

    def get_queryset(self):
        return super().get_queryset().select_subclasses()

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
        service = self.get_service()
        view = service.as_view()
        return view(request, *args, context=self.object,
                    service=service, **kwargs)


class ServiceView(ContainerBaseView, ContextMixin):
    """
    Base view class used for services rendering.
    """
    template_name = 'pepr/content/container.html'
    service = None

    def dispatch(self, request, context, service, *args, **kwargs):
        self.context = context
        self.service = service
        return super().dispatch(request, *args, service=service,
                                **kwargs)


# TODO HERE:
# - todo different settings views:
#   - basic: edit container, default service
#   - subscriptions
#   - security: access, permissions
#   - enabled services
class ContainerSettingsView(ContainerBaseView, ContextMixin, UpdateView):
    """
    Service used to manage container's settings.
    """
    required_perm = 'manage'

    model = Container
    fields = ['title', 'description', 'access']
    template_name = 'pepr/content/container_settings.html'

    def form_valid(self, form):
        # form.instance.save_by(self.role)
        self.object = form.save()
        return self.get(self.request, *self.args, **self.kwargs)

    def get_queryset(self):
        return super().get_queryset().select_subclasses()

    def get_object(self):
        obj = super().get_object()
        self.context = obj
        return obj


#
# API
#
class ContentViewSet(AccessibleGenericAPIMixin, viewsets.ModelViewSet):
    """
    Model ViewSet for Content elements.
    """
    model = Content
    serializer_class = ContentSerializer
    form_comp = ContentFormComp()
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = (
        'context',
        'mod_by', 'mod_date', 'created_by', 'created_date'
    )

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

    @action(detail=True)
    def edit_form(self, request, pk=None):
        """ Render an edit form for the given object """
        instance = self.get_object()
        role = instance.related_context.get_role(request.user)
        return Response({
            'html': self.form_comp.render(role, instance)
        })


