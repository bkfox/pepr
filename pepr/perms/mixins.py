from django.core.exceptions import PermissionDenied

from rest_framework import exceptions
from rest_framework.views import APIView

from ..api.mixins import SingleObjectMixin
from .permissions import CanAccess, CanCreate, CanUpdate, CanDelete, IsOwner


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
    permission_classes = tuple()
    """ Permissions to check as request is being proceeded """
    action_permissions = {
        'GET': (IsOwner | CanAccess,),
        'POST': (CanCreate,),
        'PUT': (IsOwner | CanUpdate,),
        'DELETE': (IsOwner | CanDelete,),
    }
    """
    Permission to apply for a specific action instead of
    `self.permission_classes`. It can either be a request method or an
    action (as given by ``viewset.action``)
    """

    def get_permissions(self, action=None):
        """
        Return permissions for the given action or defaults.
        """
        permission_classes = self.permission_classes
        if action is not None and self.action_permissions:
            permission_classes = self.action_permissions.get(
                action, permission_classes
            )
        return [perm() for perm in permission_classes]

    def can(self, role, action=None, throws=False):
        """
        Return True when user has permissions for the given action.
        """
        failed = next(
            (permission for permission in self.get_permissions(action)
             if not permission.can(role)), None
        )
        if throws and failed is None:
            raise exceptions.PermissionDenied('permission denied')
        return failed is None

    def can_obj(self, role, obj, action=None, throws=False):
        """
        Return True when user has permissions for the given action and
        object.
        """
        failed = next(
            (permission for permission in self.get_permissions(action)
             if not permission.can_obj(role, obj)), None
        )
        if throws and failed is None:
            raise exceptions.PermissionDenied('permission denied')
        return failed is None


class PermissionViewMixin(PermissionMixin):
    """
    Base mixin for views handling permissions access.
    """
    role = None

    @property
    def context(self):
        """ Permission context in which current request occurs. """
        return self.role.context if self.role else None

    @context.setter
    def context(self, obj):
        """ Set ``context``updates current role.  """
        self.role = obj.get_role(self.request.user) if obj else None

    def get_permissions(self, action=None):
        action = self.action if action is None else action
        return super().get_permissions(action)

    def get_context_data(self, **kwargs):
        """ Ensure 'role' and 'context' are in resulting context """
        kwargs.setdefault('role', self.role)
        kwargs.setdefault('context', self.context)
        return super().get_context_data(**kwargs)


class ContextViewMixin(PermissionViewMixin):
    """
    View mixin for views that work with a single Context.
    """
    permission_classes = (CanAccess,)

    @property
    def object(self):
        return self.context

    @object.setter
    def object(self, value):
        self.context = value

    def get_object(self):
        obj = super().get_object()
        self.context = obj
        self.check_object_permissions(self.request, obj)
        return obj


class AccessibleViewMixin(PermissionViewMixin):
    """
    View mixin handling Accessible objects permission check.
    """
    permission_classes = (IsOwner | CanAccess,)

    @property
    def object(self):
        return getattr(self, '_object')

    @object.setter
    def object(self, obj):
        self.context = obj.get_context()
        self.check_object_permissions(self.request, obj)

    def get_queryset(self):
        return self.model.objects.user(self.request.user)


class AccessibleConsumerMixin(SingleObjectMixin, PermissionMixin):
    """
    Consumer mixin handling Accessible objects permission check
    """
    permission_classes = (IsOwner | CanAccess,)

    def get_queryset(self, request):
        return super().get_queryset(request).user(request.user)

    def get_object(self, request):
        obj = super().get_object(request)
        self.check_object_permissions(request, obj)

