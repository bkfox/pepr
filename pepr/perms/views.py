from django.core.exceptions import PermissionDenied
from django.shortcuts import render


class AccessibleMixin:
    """
    Mixin for Accessible objects. It automatically filters elements
    accessible to user on queryset.
    """
    def get_queryset(self):
        user = self.request.user
        return super().get_queryset().user(user)


class AccessibleGenericAPIMixin:
    """
    This mixin enforce permissions checks on the accessible elements.
    Serializer must inherits from ``.serializer.AccessibleSerializer``.
    """
    def perform_destroy(self, instance):
        role = instance.context.get_role(self.request.user)
        instance.delete_by(role)

    def perform_create(self, serializer):
        serializer.current_user = self.request.user
        super().perform_create(serializer)

    def perform_update(self, serializer):
        serializer.current_user = self.request.user
        super().perform_update(serializer)


