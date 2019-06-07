from django.core.exceptions import PermissionDenied

from rest_framework import exceptions
from rest_framework.views import APIView

from ..api.mixins import SingleObjectMixin
from .roles import Roles
from .permissions import CanAccess, CanCreate, CanUpdate, CanDestroy


class PermissionMixin:
    """
    Add support for permission check on the child class. Works in a
    similar way DRF ``APIView``, except it has an ``action_permissions``
    attribute that allows specifying permission on a per action or per
    request's method basis.

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
        """
        Return permissions for the given action or defaults.
        """
        permission_classes = cls.permission_classes
        if action is not None and cls.action_permissions:
            permission_classes = cls.action_permissions.get(
                action, permission_classes
            )
        return [perm() for perm in permission_classes]

    @classmethod
    def get_api_actions(cls, role, obj=None):
        """
        Return a list of api actions key allowed for this role.
        """
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
    """
    role = None

    @property
    def context(self):
        return self.role and self.role.context

    @context.setter
    def context(self, obj):
        self.role = obj.get_role(self.request.identity)

    @property
    def object(self):
        return getattr(self, '_object', None)

    @object.setter
    def object(self, obj):
        setattr(self, '_object', obj)
        self.role = obj.get_role(self.request.identity)

    def get_permissions(self):
        return self.get_action_permissions(self.action)

    def get_context_data(self, **kwargs):
        """ Ensure 'role' and 'context' are in resulting context """
        kwargs.setdefault('identity', self.request.identity)
        kwargs.setdefault('role', self.role)
        kwargs.setdefault('context', self.context)
        kwargs.setdefault('roles', Roles.register)
        return super().get_context_data(**kwargs)

class ContextViewMixin(PermissionViewMixin):
    """
    View mixin for views that work with a single Context.
    """
    def get_queryset(self):
        model = getattr(self, 'model', None)
        if not model:
            model = self.get_serializer_class().Meta.model
        return model.objects.all()


class AccessibleViewMixin(PermissionViewMixin):
    """
    View mixin handling Accessible objects permission check.
    """
    def get_queryset(self):
        qs = self.model.objects.identity(self.request.identity)
        if self.context:
            qs = qs.filter(context=self.context)
        return qs


class AccessibleConsumerMixin(SingleObjectMixin, PermissionMixin):
    """
    Consumer mixin handling Accessible objects permission check
    """
    def get_queryset(self, request):
        return super().get_queryset(request).identity(request.identity)

    def get_object(self, request):
        obj = super().get_object(request)
        self.check_object_permissions(request, obj)

