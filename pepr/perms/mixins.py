from django.core.exceptions import PermissionDenied
from django.http import Http404

from rest_framework import exceptions
from rest_framework.views import APIView

from .assets import roles
from .settings import settings
from .permissions import CanAccess, CanCreate, CanUpdate, CanDestroy
from .models import Context

# TODO:
# - use role instead of identity: check if it is okay for all mixins
# - identity is passed by role: check if it is okay for all cases (should be as i am smart)
# - content
#   - components.Component: get_context_data, make it beautitful and simple (kwargs)
#   - components.Components: check if accessible, then perm check
#   - render html in serializer


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


class PermissionViewMixin(PermissionMixin):
    """
    Base mixin for views handling permissions access.

    Provide template context variables:
    - ``role``: current user's role;
    - ``roles``: all available roles
    """
    context_class = Context
    role = None

    def get_context_queryset(self):
        """ Return context queryset """
        return self.context_class.objects.identity(self.request.identity)

    def get_context(self, context_pk=None, context_slug=None, **kwargs):
        """ Return context from pk or slug in dispatch kwargs. """
        qs = self.get_context_queryset()
        if context_pk:
            return qs.get(pk=context_pk)
        if context_slug:
            return qs.get(slug=context_slug)
        raise Http404('not found')

    def get_context_data(self, **kwargs):
        """ Ensure 'role' and 'roles' are in resulting context """
        kwargs.setdefault('role', self.role)
        kwargs.setdefault('roles', roles() )
        return super().get_context_data(**kwargs)

    def dispatch(self, request, *args, **kwargs):
        context = self.get_context(**kwargs)
        self.role = context and context.get_role(request.identity)
        # FIXME self.can(self.role, request.method)
        return super().dispatch(request, *args, **kwargs)


class ContextViewMixin(PermissionViewMixin):
    """ View mixin for views that work with a single Context. """
    def get_queryset(self):
        model = getattr(self, 'model', None)
        if not model:
            model = self.get_serializer_class().Meta.model
        return model.objects.all()


class AccessibleViewMixin(PermissionViewMixin):
    """ View mixin handling Accessible objects permission check. """
    def get_queryset(self):
        qs = self.model.objects.identity(self.request.identity)
        if self.role and self.role.context:
            qs = qs.filter(context=self.role.context)
        return qs

