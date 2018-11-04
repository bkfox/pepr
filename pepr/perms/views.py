from django.core.exceptions import PermissionDenied
from django.shortcuts import render


class AccessibleViewMixin:
    """
    Mixin used to provide Role information.
    """
    role = None
    """ Role for the current user and Context. """

    @property
    def context(self):
        return self.role and self.role.context

    @context.setter
    def context(self, context):
        self.role = context.get_role(self.request.user)

    def assert_perm(self, codename, role=None):
        """
        Assert permission is granted for role on ``self.object``
        using ``role``.
        """
        self.object.assert_perm(
            codename, self.role if role is None else role
        )

    def get_queryset(self):
        user = self.role.user if self.role else \
               self.request.user
        return super().get_queryset().user(user)

    def get_context_data(self, **kwargs):
        kwargs.setdefault('role', self.role)
        kwargs.setdefault(
            'context', self.role and self.role.context
        )
        return super().get_context_data(**kwargs)

    def dispatch(self, request, *args, role=None, **kwargs):
        self.role = role
        return super().dispatch(request, *args, role=role, **kwargs)

class AccessibleGenericAPIMixin:
    """
    This mixin enforce permissions checks on the accessible elements.
    Serializer must inherits from ``.serializer.AccessibleSerializer``.
    """
    def perform_destroy(self, instance):
        role = instance.context.get_role(self.request.user)
        instance.delete_by(role)

    def perform_create(self, serializer):
        role = serializer.context.get_role(self.request.user)
        serializer.role = role
        super().perform_create(serializer)

    def perform_update(self, serializer):
        role = serializer.context.get_role(self.request.user)
        serializer.role = role
        super().perform_update(serializer)


