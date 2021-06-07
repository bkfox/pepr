""" Generic views and mixins. """
from django.urls import reverse
from django.http import Http404
from django.views.generic import DetailView, ListView

from rest_framework import exceptions

from .. import models
from ..permissions import CanAccess, CanCreate, CanUpdate, CanDestroy
from ..settings import settings
from ..roles import display_roles


__all__ = ('ApplicationMixin', 'PermissionMixin',
    'AccessibleMixin', 'AccessibleListView', 'AccessibleDetailView',
    'ContextMixin', 'ContextListView', 'ContextDetailView',
    'BaseServiceMixin', 'ServiceMixin')


class ApplicationMixin:
    """
    Provide utilities to work with client side application.

    - embed: render view application content only.
    - application data: include application data in script tag ``#app-props``,
        using ``json_script`` template filter. This allows assets'
        ``pepr.core.App`` to load initial data from page.
    """
    template_base = 'pepr_core/base.html'
    """ Extend view's template from it. """
    template_embed = 'pepr_core/base_embed.html'
    """ Extend view's template from it when embed. """

    def get_app_props(self, **kwargs):
        """ Return dict of data to pass to client application. """
        if 'baseURL' not in kwargs:
            kwargs['baseURL'] = reverse('api-base-url')
        kwargs.setdefault('roles', display_roles())

        return self.get_perms_app_props(**kwargs) \
                if isinstance(self, PermissionMixin) else kwargs

    def get_perms_app_props(self, **kwargs):
        """
        Return application properties for PermissionMixin subclasses.
        """
        from ..serializers import ContextSerializer, SubscriptionSerializer
        kwargs.setdefault('contextId', self.role.context.pk)
        store = kwargs.setdefault('store', {})
        if self.role.context:
            ser = ContextSerializer(self.role.context,
                    identity=self.request.identity)
            store.setdefault('context', []).append(ser.data)
        if self.role.subscription:
            ser = SubscriptionSerializer(self.role.subscription,
                    identity=self.request.identity)
            store.setdefault('subscription', []).append(ser.data)
        return kwargs

    def get_context_data(self, **kwargs):
        if not kwargs.get('template_base'):
            if kwargs.pop('embed', None) or self.request.GET.get('embed'):
                kwargs['template_base'] = self.template_embed
            else:
                kwargs['template_base'] = self.template_base
        if not kwargs.get('app_props'):
            kwargs['app_props'] = self.get_app_props()
        return super().get_context_data(**kwargs)



class PermissionMixin:
    """
    Add support for permission check on the child class. Works in a
    similar way DRF ``APIView``, except it has an ``action_permissions``
    attribute specifying permissions per action or request's method basis.

    Context can be assigned for this instance's view, updating current
    role. Usage of this feature is up to class user, although a good
    practice is to always define a current permission context.
    """
    permission_classes = (CanAccess,)
    """ Permissions to check as request is being proceeded """
    action_permissions = {
        'GET': permission_classes,
        'POST': (CanCreate,),
        'PUT': (CanUpdate,),
        'DELETE': (CanDestroy,),
    }
    """
    Overrides permissions for the given actions (as
    ``{'action-name': (permissions,) }``). Can be ``None``.

    FIXME: It can either be a request method or an action (as given by
    ``viewset.action``).
    """
    context_model = models.Context
    """
    Model used as context
    """
    role = None
    """ Current user role on current context. """

    @property
    def context(self):
        return self.role.context

    @classmethod
    def get_action_permissions(cls, action=None):
        """ Return permissions for action. """
        permission_classes = cls.permission_classes
        if action is not None and cls.action_permissions:
            permission_classes = cls.action_permissions.get(
                action, permission_classes
            )
        return [perm() for perm in permission_classes]

    @classmethod
    def get_api_actions(cls, role, obj=None):
        """ Return a list of api actions key allowed for this role. """
        actions = getattr(cls, 'action_permissions', {}).keys()
        return [a for a in actions if cls.can(role, a)] if obj is None else \
            [a for a in actions if cls.can_obj(role, obj, a)]

    # TODO: action mandatory, but can be None (as first argument?)
    #       => ensure identity does not have it to 'None' by mistake
    #       (which test on cls.permission_classes)
    @classmethod
    def can(cls, role, action=None, throws=False):
        """
        Return True when identity has permissions for the given action.
        """
        failed = next(
            (permission for permission in cls.get_action_permissions(action)
             if not permission.can(role)), None
        )
        if throws and failed is not None:
            raise exceptions.PermissionDenied('permission denied')
        return failed is None

    @classmethod
    def can_obj(cls, role, obj, action=None, throws=False):
        """
        Return True when identity has permissions for the given action and
        object.
        """
        success = next(
            (False for permission in cls.get_action_permissions(action)
             if not permission.can_obj(role, obj)), True
        )
        if throws and not success:
            raise exceptions.PermissionDenied('permission denied')
        return success

    def get_permissions(self):
        """ Return permissions for the current action """
        return self.get_action_permissions(self.action)

    def get_context_model(self):
        """
        Return model used as Context (defaults to ``context_model``).
        """
        return self.context_model

    def get_context_queryset(self, identity):
        """ Return context queryset """
        return self.get_context_model().objects.site(self.request.site) \
                                       .identity(identity)

    def get_context(self, identity, pk=None):
        """ Return context from pk or slug in dispatch kwargs. """
        if pk is not None:
            return self.get_context_queryset(identity).get(pk=pk)
        return None

    def get_context_data(self, site_role=None, **kwargs):
        """ Ensure 'role' and 'roles' are in resulting context """
        kwargs.setdefault('role', self.role)
        kwargs.setdefault('context', self.role.context)
        kwargs.setdefault('roles', settings.roles )
        kwargs.setdefault('site_role', self.request.role)
        return super().get_context_data(**kwargs)

    def dispatch(self, request, *args, context=None, context_pk=None, **kwargs):
        if context is None:
            context = self.get_context(request.identity, context_pk) \
                        if context_pk else None
        if context:
            self.role = context.get_role(request.identity)
        return super().dispatch(request, *args, context=context, role=self.role, **kwargs)


class ContextMixin(PermissionMixin):
    """
    Mixin handling Accessible objects permission check. Can work with
    PermissionViewMixin
    """
    def get_queryset(self):
        return super().get_queryset().site(self.request.site) \
                                     .identity(self.request.identity)


class ContextListView(ContextMixin, ApplicationMixin, ListView):
    """ Context list view. """
    model = models.Context


class ContextDetailView(ContextMixin, ApplicationMixin, DetailView):
    """ Context detail view. """
    model = models.Context

    def get_object(self):
        return self.context or super().get_object()



class AccessibleMixin(PermissionMixin):
    """
    Mixin handling Accessible objects permission check. Can work with
    PermissionViewMixin
    """
    def get_queryset(self):
        qs = super().get_queryset().site(self.request.site) \
                                   .identity(self.request.identity)
        role = getattr(self, 'role', None)
        return qs.context(role.context) if role else qs


class AccessibleListView(AccessibleMixin, ApplicationMixin, ListView):
    """ Accessible list view. """


class AccessibleDetailView(AccessibleMixin, ApplicationMixin, DetailView):
    """ Accessible detail view. """



class ServiceMixin(PermissionMixin):
    """
    Fetch a service for current context.

    Provide context data:
    - 'service': current service object
    - 'services': current context's services
    """
    service_class = models.Service
    """ Service model class to be retrieved if not None. """
    service = None
    """ Service instance found. """

    def get_service_queryset(self):
        """ Return services' queryset. """
        return self.service_class.objects.site(self.request.site) \
                                 .identity(self.request.identity)

    def get_service(self, pk=None, slug=None, throw=False):
        """ Return current service """
        qs = self.get_service_queryset().order_by('order')
        if pk is not None:
            qs = qs.filter(pk=pk)
        elif slug is not None:
            qs = qs.filter(slug=slug)
        q = qs.first()
        if q is None and throw:
            raise Http404('Service not found')
        return q

    # should be executed after PermissionMixin.dispatch in MRO order
    def dispatch(self, request, *args, service=None, service_pk=None,
            service_slug=None, **kwargs):
        if service is None:
            service = self.get_service(service_pk, service_slug, throw=True)
        self.service = service
        return super().dispatch(request, *args, service=service, context_pk=service.context_id, **kwargs)


