from django.core.exceptions import PermissionDenied

from .models import Accessible


class PermissionMixin:
    required_perm = None
    """
    Permission codename to always test when calling has_perms.
    """

    def has_perm(self, role, codename, obj=None, model=None):
        """
        Return True if role has the given permission. If ``obj`` is
        an accessible, call ``obj.has_perm``. When model is None but
        object given, set model to ``obj``
        """
        if isinstance(obj, Accessible):
            return obj.has_perm(role, codename)
        model = model if model is not None else \
            type(obj) if obj is not None else None
        return role.has_perm(codename, model)

    def has_perms(self, role, obj=None, model=None):
        """
        Test that role has permissions specific to the view with the
        given parameters.
        """
        if self.required_perm:
            return self.has_perm(role, self.required_perm, obj)
        return obj.has_access(role) if obj else True

    def assert_perms(self, role, obj=None, model=None):
        """
        Raise a PermissionDenied if ``has_perm`` returns False.
        """
        if not self.has_perms(role, obj, model):
            raise PermissionDenied('Permission denied')


class ContextMixin(PermissionMixin):
    """
    Base DetailView for Contexts. Provides permission check and context
    values ('role', 'context').
    """
    role = None
    """ User's role """

    @property
    def context(self):
        return getattr(self, '_context', None)

    @context.setter
    def context(self, context):
        if context:
            role = context.get_role(self.request.user)
            self.assert_perms(role)
            self.role = role
        setattr(self, '_context', context)

    # FIXME: use property & setter instead
    def get_object(self):
        """
        Ensure that `context` is updated to the object found. This also
        ensure permission check.
        """
        obj = super().get_object()
        self.context = obj
        return obj

    def get_context_data(self, **kwargs):
        """ Ensure 'role' and 'context' are in resulting context """
        kwargs.setdefault('role', self.role)
        kwargs.setdefault('context', self.role and self.role.context)
        return super().get_context_data(**kwargs)


class AccessibleMixin(PermissionMixin):
    role = None

    def get_queryset(self):
        return super().get_queryset().user(self.request.user)


class AccessibleGenericAPIMixin(AccessibleMixin):
    """
    This mixin enforce permissions checks on the accessible elements.
    It uses a``.serializer.AccessibleSerializer`` (sub-)class.
    """
    def get_object(self):
        obj = super().get_object()
        role = obj.related_context.get_role(self.request.user)
        if not self.has_perms(role, obj):
            raise PermissionDenied('permission denied')
        return obj

    def get_serializer(self, *args, **kwargs):
        if self.role:
            kwargs.setdefault('role', self.role)
        kwargs.setdefault('user', self.request.user)
        return super().get_serializer(*args, **kwargs)

    def perform_destroy(self, instance):
        role = instance.related_context.get_role(self.request.user)
        instance.delete(by=role)

