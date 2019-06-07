from django.http import Http404, HttpResponse
from django.views.generic import DetailView, ListView, UpdateView, View
from django.views.generic.detail import SingleObjectMixin
from django.utils.translation import ugettext_lazy as _

from django_filters import views as filters_views

from ..perms.mixins import PermissionMixin, ContextViewMixin, \
        AccessibleViewMixin
from ..perms.serializers import SubscriptionSerializer
from ..perms.models import Subscription
from ..perms.viewsets import SubscriptionViewSet
from ..ui.views import BaseView
from ..ui.components import Slots, Widgets
from ..ui.widgets import ActionWidget, ActionWidgets, \
        DropdownLinkWidget, DropdownWidgets

from .filters import ContentFilter
from .forms import ContainerForm
from .models import Container, Content, Service
from .viewsets import ContentViewSet
from .widgets import ContainerServicesWidget, DeleteActionWidget


__all__ = ['ContainerServiceView', 'as_service', 'ServiceView',
           'ContainerUpdateView', 'ContentListView', 'SubscriptionsUpdateView']


class ContainerServiceView(SingleObjectMixin, View):
    """
    Fetch a Container of the given ``pk`` or ``slug`` and forward it a
    ServiceView. This service is provided as initkwargs, or is fetched
    from database using ``service_pk`` or ``service_kwargs`` kwargs.
    This views' ``kwargs`` and ``args`` is passed down to the wrapped
    view.

    Detail view for services, whose rendering the fetched service's
    view with the ``kwargs`` and ``args`` provided arguments.
    """
    object = None
    model = Container
    service = None
    service_model = Service

    def get_queryset(self):
        return super().get_queryset().select_subclasses()

    def get_service_queryset(self):
        """
        Return queryset to retrieve service; container is available as
        ``self.object`` when this method is called from ``dispatch``.
        """
        return self.service_model.objects.select_subclasses() \
                   .identity(self.request.identity) \
                   .filter(context=self.object).order_by('-is_default')

    def get_service(self):
        """ Return service for current request. """
        if self.service is not None:
            return self.service

        qs = self.get_service_queryset()
        if 'service_pk' in self.kwargs:
            service = qs.get(self.kwargs['service_pk'])
        elif 'service_slug' in self.kwargs:
            service = qs.get(slug=self.kwargs['service_slug'])
        else:
            service = qs.first()
        return service

    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        service = self.get_service()
        if not service:
            raise Http404()
        view = service.as_view() if hasattr(service, 'as_view') else service
        return view(request, *args, context=self.object,
                    service=service, **kwargs)


def service_view(service=None, **initkwargs):
    """
    Shorthand to wrap a given view into a ContainerServiceView.
    Return the view function.

    This function is useful to wrap views that can't be a detail/edit views
    of a container directly.
    """
    return ContainerServiceView.as_view(service=service, **initkwargs)


class ServiceView(PermissionMixin, BaseView):
    """
    Base view class for rendering something inside a container. If
    ``service`` is provided, renders it.
    """
    slots = Slots(BaseView.slots, [
        # left sidebar
        Widgets('container-sidebar', 'div', {'class': 'col-2 sidebar'},
                items=[ContainerServicesWidget()]),
        # settings menu
        DropdownWidgets('container-settings-menu', '', {'right': True},
            items=[
                DropdownLinkWidget(
                    text=_("Subscriptions"), icon="fa-user-friends fas",
                    url_name='pepr.container.subscriptions',
                    url_kwargs=lambda s, object, **kw: {'pk': str(object.pk)},
                    pred=lambda s, object=None, **kw: object is not None
                    # required_perm='manage',
                ),
                DropdownLinkWidget(
                    text=_("Settings"), icon="fa-cog fas",
                    url_name='pepr.container.settings',
                    url_kwargs=lambda s, object, **kwargs: {'pk': str(object.pk)},
                    pred=lambda s, object=None, **kw: object is not None
                    # required_perm='manage',
                )
            ]
        ),
        # content menu
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


class ContainerCreateAnyView(PermissionMixin, BaseView):
    """
    View that displays a choice to user to create a container. It
    uses slots in order to get the list of container classes and views
    to render.
    """
    slots = Slots(BaseView.slots, [
        Widgets(
            'create-forms',
            items=[]
        ),
    ])
    template_name = 'pepr/content/container_create_any.html'


class ContainerUpdateView(ContextViewMixin, ServiceView, UpdateView):
    """ Service used to edit container's settings.  """
    # TODO: permission_classes = tuple()
    model = Container
    form_class = ContainerForm
    template_name = 'pepr/content/container_form.html'

    def get_form_kwargs(self):
        kw = super().get_form_kwargs()
        kw['role'] = self.object.get_role(self.request.identity)
        return kw

    def form_valid(self, form):
        # form.instance.save_by(self.role)
        self.object = form.save()
        return self.get(self.request, *self.args, **self.kwargs)

    def get_queryset(self):
        return super().get_queryset().select_subclasses()


###### TODO HERE: as Accessible List View?????
class SubscriptionsUpdateView(AccessibleViewMixin, ServiceView, ListView):
    """ Service used to edit users' subscriptions to a context """
    # TODO: permission_classes = tuple()
    model = Subscription
    template_name = 'pepr/content/subscriptions_form.html'
    slots = Slots(ServiceView.slots, [
        ActionWidgets(
            'item-actions',
            items=[
                ActionWidget(
                    text=_('Accept'),
                    tag_attrs={'action': 'api',
                               'api_action': 'accept',
                               'path': 'accept/',
                               'method': 'PUT',
                               ':item': 'item',
                               'class': 'btn btn-sm btn-success'}
                ),
                DeleteActionWidget(),
            ]
        )
    ])
    serializer_class = SubscriptionSerializer

    def serialize(self, obj, **initkwargs):
        """
        Return serialized data from the given object.
        """
        initkwargs.setdefault('identity', self.request.identity)
        initkwargs.setdefault('viewset', SubscriptionViewSet)
        return self.serializer_class(obj, **initkwargs).data

    def get_context_data(self, roles=None, statuses=None, object_data=None,
                         **kwargs):
        # FIXME: remove ? PermissionViewMixin.get_context_data provides 'roles'
        roles = roles or Subscription._meta.get_field('role').choices
        statuses = statuses or Subscription._meta.get_field('status').choices

        if object_data is None:
            object_data = [self.serialize(obj) for obj in self.object_list]

        return super().get_context_data(roles=roles, statuses=statuses,
                                        object_data=object_data, **kwargs)


class ContentListView(AccessibleViewMixin, ServiceView,
                      filters_views.FilterView, ListView):
    """ Display a list of content, either for a given context or not """
    # TODO: permission_classes = tuple()
    model = Content
    template_name = 'pepr/content/content_list.html'
    filterset_class = ContentFilter
    filterset_fields = ('modified', 'created')
    strict = False

    viewset = ContentViewSet
    serializer_class = SubscriptionSerializer

    def serialize(self, obj, **initkwargs):
        """
        Return serialized data from the given object.
        """
        initkwargs.setdefault('identity', self.request.identity)
        initkwargs.setdefault('viewset', self.viewset)
        return self.serializer_class(obj, **initkwargs).data

    def get_filterset_kwargs(self, filterset_class):
        kwargs = super().get_filterset_kwargs(filterset_class)
        if self.context and kwargs['data']:
            kwargs['data'] = dict(kwargs['data'])
            kwargs['data']['context'] = [self.context.pk]
        return kwargs

    def get_queryset(self):
        qs = super().get_queryset().select_subclasses() \
                    .identity(self.request.identity)
        if self.context:
            qs = qs.context(self.context)
        return qs

    # TODO/FIXME: move in a parent class?
    def get_content_slots(self):
        return self.model.get_component_class().slots

    def get_context_data(self, content_slots=None, object_data=None, **kwargs):
        if object_data is None:
            object_data = [self.serialize(obj) for obj in self.object_list]

        return super().get_context_data(
            object_data=object_data,
            content_slots=content_slots or self.get_content_slots(),
            **kwargs
        )




