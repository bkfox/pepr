from django.urls import reverse
from rest_framework import exceptions
from rest_framework.views import APIView

from .permissions import CanAccess, CanCreate, CanUpdate, CanDestroy
from .models import Context, Service
from .settings import settings
from .roles import display_roles


__all__ = ('BaseViewMixin', 'PermissionMixin', 'ViewMixin',
           'AccessibleViewMixin', 'ContextViewMixin', 'ServiceMixin')


class BaseViewMixin:
    """
    Provide utilities to work with client side application.

    - embed: render view application content only.
    - application data: include application data in script tag ``#app-config``,
        using ``json_script`` template filter. This allows assets' ``pepr.core.App`` to load initial data from page.
    """
    template_base = 'pepr_core/base.html'
    """ Extend view's template from it. """
    template_embed = 'pepr_core/base_embed.html'
    """ Extend view's template from it when embed. """

    def get_app_config(self, **kwargs):
        """ Return dict of data to pass to client application. """
        if 'base_url' not in kwargs:
            kwargs['baseUrl'] = reverse('pepr:api-root')
        kwargs.setdefault('roles', display_roles())
        return kwargs

    def get_context_data(self, **kwargs):
        if not kwargs.get('template_base'):
            if kwargs.pop('embed', None) or self.request.GET.get('embed'):
                kwargs['template_base'] = self.template_embed
            else:
                kwargs['template_base'] = self.template_base
        if not kwargs.get('app_config'):
            kwargs['app_config'] = self.get_app_config()
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
    context_model = Context
    """
    Model used as context
    """

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

    def get_context_model(self):
        """
        Return model used as Context (defaults to ``context_model``).
        """
        return self.context_model


class ViewMixin(PermissionMixin, BaseViewMixin):
    """
    Base mixin for views handling permissions access.

    Provide template context variables:
    - ``role``: current user's role;
    - ``roles``: all available roles
    """
    role = None

    def get_app_config(self, **kwargs):
        kwargs.setdefault('contextId', self.role.context.pk)
        return super().get_app_config(**kwargs)

    def get_permissions(self):
        return self.get_action_permissions(self.action)

    def get_context_queryset(self):
        """ Return context queryset """
        return self.get_context_model().objects.identity(self.request.identity)

    def get_context(self, pk=None):
        """ Return context from pk or slug in dispatch kwargs. """
        if pk is not None:
            return self.get_context_queryset().get(pk=pk)
        return None

    def get_context_data(self, **kwargs):
        """ Ensure 'role' and 'roles' are in resulting context """
        kwargs.setdefault('context', self.role.context)
        kwargs.setdefault('role', self.role)
        kwargs.setdefault('roles', settings.roles )
        return super().get_context_data(**kwargs)

    def dispatch(self, request, *args, context_pk=None, **kwargs):
        context = self.get_context(context_pk) if context_pk else None
        if context:
            self.role = context.get_role(request.identity)
        # FIXME self.can(self.role, request.method)
        return super().dispatch(request, *args, **kwargs)


class ContextViewMixin(ViewMixin):
    """
    Mixin handling Accessible objects permission check. Can work with
    PermissionViewMixin
    """
    def get_queryset(self):
        qs = super().get_queryset().identity(self.request.identity)
        role = getattr(self, 'role', None)
        if role and role.context:
            qs = qs.filter(context=role.context)
        return qs


class AccessibleViewMixin(ViewMixin):
    """
    Mixin handling Accessible objects permission check. Can work with
    PermissionViewMixin
    """
    def get_queryset(self):
        qs = super().get_queryset().identity(self.request.identity)
        role = getattr(self, 'role', None)
        if role and role.context:
            qs = qs.filter(context=role.context)
        return qs


class ServiceMixin(ViewMixin):
    """
    Fetch a service for current context.

    Provide context data:
    - 'service': current service object
    - 'services': current context's services
    """
    service_class = None
    """ Service model class to be retrieved if not None. """
    service = None
    """ Service instance found. """

    def get_services(self):
        """ Return available services for current Context. """
        return Service.objects.role(self.role)

    def get_service(self):
        """ Return current service """
        return self.service_class.objects.role(self.role) \
                                         .first()

    def get_context_data(self, **kwargs):
        self.service = kwargs.pop('service', None) or self.get_service()
        if self.service is None:
            raise Http404('Service not found')
        if 'services' not in kwargs:
            kwargs['services'] = self.get_services()
        return super().get_context_data(service=self.service, **kwargs)



