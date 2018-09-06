from django.shortcuts import render


class AccessibleMixin:
    """
    Mixin for Accessible objects. It automatically filters elements
    accessible to user on queryset.
    """
    def get_queryset(self):
        user = self.request.user
        return super().get_queryset().user(user)



