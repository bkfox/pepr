from django.core.exceptions import PermissionDenied

from rest_framework import views as rf_views

from .permissions import CanAccess, CanCreate, CanUpdate, CanDelete, IsOwner


class PermissionMixin:
    """
    Mixin adding permission check capabilities to the class. Similar to
    rf ``APIView``, except it has an ``action_permissions`` attribute
    that allows specifying permission on a per action or per request's
    method basis.

    Context can be assigned for this instance's view, updating current
    role. Usage of this feature is up to class user, although a good
    practice is to always define a current permission context.
    """
    permission_classes = tuple()
    """ Permissions to check as request is being proceeded """
    action_permissions = {
        'GET': (CanAccess,),
        'POST': (CanCreate,),
        'PUT': (CanUpdate,),
        'DELETE': (CanDelete,),
    }
    """
    Permission to apply for a specific action instead of
    `self.permission_classes`. It can either be a request method or an
    action (as given by ``viewset.action``)
    """
    role = None

    @property
    def context(self):
        """ Permission context in which current request occurs. """
        return self.role.context if self.role else None

    @context.setter
    def context(self, obj):
        """ Setting ``context``updates current role and check
        permissions """
        self.role = obj.get_role(self.request.user) if obj else None

    check_permissions = rf_views.APIView.check_permissions
    check_object_permissions = rf_views.APIView.check_object_permissions

    def get_permissions(self):
        """ Return permissions """
        return [perm() for perm in self.action_permissions.get(
            getattr(self, 'action', self.request.method),
            self.permission_classes
        )]

    def get_context_data(self, **kwargs):
        """ Ensure 'role' and 'context' are in resulting context """
        kwargs.setdefault('role', self.role)
        kwargs.setdefault('context', self.context)
        return super().get_context_data(**kwargs)


class ContextMixin(PermissionMixin):
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
        """  """
        obj = super().get_object()
        self.context = obj
        self.check_object_permissions(self.request, obj)
        return obj


class AccessibleMixin(PermissionMixin):
    """
    View mixin handling Accessible objects permission check.
    """
    permission_classes = (CanAccess,)

    def get_object(self):
        """  """
        obj = super().get_object()
        self.context = obj.related_context
        self.assert_perms(self.request, obj)
        return obj

    def get_queryset(self):
        return self.model.objects.user(self.request.user)


class OwnedMixin(AccessibleMixin):
    """
    Mixin handling Owned objects permission check
    """
    permission_classes = (IsOwner | CanAccess,)


