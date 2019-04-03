from django.http import Http404, HttpResponse
from django.views.generic import DetailView, ListView, UpdateView, View
from django.views.generic.detail import SingleObjectMixin
from django.utils.translation import ugettext_lazy as _

from django_filters import rest_framework as filters_drf, \
                           views as filters_views
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from ..perms.forms import SubscriptionFormSet
from ..perms.mixins import PermissionMixin, ContextViewMixin, AccessibleViewMixin
from ..perms.views import AccessibleViewSet
from ..ui.views import SiteView
from ..ui.components import Slots, Widgets
from ..ui.widgets import DropdownLinkWidget, DropdownWidgets

from .components import ContentFormComp
from .filters import ContentFilter
from .forms import ContainerForm
from .models import Container, Content, Service
from .serializers import ContentSerializer
from .widgets import ContainerServicesWidget


class ServiceView(PermissionMixin, SiteView):
    """
    A ServiceView is a view rendered inside a container, that can uses
    a Service model as user configuration.
    """
    slots = Slots(SiteView.slots, [
        # left sidebar
        Widgets('container-sidebar', 'div', {'class': 'col-2 sidebar'},
                items=[ContainerServicesWidget()]),
        # settings menu
        DropdownWidgets('container-settings-menu', '', {'right': True},
            items=[
                DropdownLinkWidget(
                    text=_("Subscriptions"), icon="fa-user-friends fas",
                    url_name='pepr.container.subscriptions',
                    url_kwargs=lambda s, object, **kwargs: {'pk': str(object.pk)},
                    # required_perm='manage',
                ),
                DropdownLinkWidget(
                    text=_("Settings"), icon="fa-cog fas",
                    url_name='pepr.container.settings',
                    url_kwargs=lambda s, object, **kwargs: {'pk': str(object.pk)},
                    # required_perm='manage',
                )
            ]
        ),
    ])

    template_name = 'pepr/content/container.html'

    service = None
    """ Service configuration if any """

    def dispatch(self, request, *args, service=None, context=None,
                 **kwargs):
        if context:
            self.context = context
        if service:
            self.service = service
        return super().dispatch(request, *args, service=service, **kwargs)


class ContainerServiceView(SingleObjectMixin, View):
    """
    Fetch service by ``slug`` or ``pk`` and call corresponding
    ServiceView. Theses are given with ``service_pk`` and
    ``service_slug`` attribute in kwargs.
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
        if not service:
            raise Http404('not found')
        view = service.as_view()
        return view(request, *args, context=self.object,
                    service=service, **kwargs)


class ContainerUpdateView(ServiceView, ContextViewMixin, UpdateView):
    """
    Service used to manage container's settings.
    """
    # TODO: permission_classes = tuple()
    model = Container
    form_class = ContainerForm
    template_name = 'pepr/content/container_form.html'

    def get_form_kwargs(self):
        kw = super().get_form_kwargs()
        kw['role'] = self.object.get_role(self.request.user)
        return kw

    def form_valid(self, form):
        # form.instance.save_by(self.role)
        self.object = form.save()
        return self.get(self.request, *self.args, **self.kwargs)

    def get_queryset(self):
        return super().get_queryset().select_subclasses()


class SubscriptionsUpdateView(ServiceView, ContextViewMixin, DetailView):
    # TODO: permission_classes = tuple()
    model = Container
    formset_class = SubscriptionFormSet
    template_name = 'pepr/content/subscriptions_form.html'

    def get_formset_queryset(self):
        return self.formset_class.model.objects \
                   .context(self.context) \
                   .user(self.request.user) \
                   .select_related('owner')

    def get_formset(self, **initkwargs):
        initkwargs.setdefault('form_kwargs', {'role': self.role})
        if 'queryset' not in initkwargs:
            initkwargs['queryset'] = self.get_formset_queryset()
        return self.formset_class(**initkwargs)

    def get_context_data(self, **kwargs):
        if not 'formset' in kwargs:
            kwargs['formset'] = self.get_formset()

        formset = kwargs['formset']
        for form in formset:
            print(form, form.fields)
        return super().get_context_data(**kwargs)

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        formset = self.get_formset(data=request.POST)
        if not formset.is_valid():
            raise ValueError('invalid form data')

        formset.save()
        for obj in formset.deleted_objects:
            obj.delete(by=self.role)

        return self.get(request, *args, **kwargs)


class ContentListView(AccessibleViewMixin, ServiceView,
                      filters_views.FilterView):
    """ Display a list of content, either for a given context or not """
    # TODO: permission_classes = tuple()
    model = Content
    template_name = 'pepr/content/content_list.html'
    filterset_class = ContentFilter
    filterset_fields = ('modified', 'created')
    strict = False

    def get_filterset_kwargs(self, filterset_class):
        kwargs = super().get_filterset_kwargs(filterset_class)
        if self.context and kwargs['data']:
            kwargs['data'] = dict(kwargs['data'])
            kwargs['data']['context'] = [self.context.id]
        return kwargs

    def get_queryset(self):
        qs = super().get_queryset().select_subclasses() \
                      .user(self.request.user)
        if self.context:
            qs = qs.context(self.context)
        return qs


#
# API
#
class ContentViewSet(AccessibleViewSet):
    """
    Model ViewSet for Content elements.
    """
    model = Content
    serializer_class = ContentSerializer
    form_comp = ContentFormComp()
    filter_backends = (filters_drf.DjangoFilterBackend,)
    filterset_fields = ContentListView.filterset_fields + (
        'context', 'modifier', 'owner', 'text'
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

    @action(detail=True)
    def edit_form(self, request, pk=None):
        """ Render an edit form for the given object """
        instance = self.get_object()
        role = instance.get_context().get_role(request.user)
        content = self.form_comp.render(role, instance)
        return HttpResponse(content=content)

