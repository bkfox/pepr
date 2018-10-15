from rest_framework import filters


class IsAccessibleFilterBackend(filters.BaseFilterBackend):
    """
    Filter Accessible object to what user can access. If
    object is not an Accessible, return queryset as is.
    """
    def filter_queryset(self, request, queryset, view):
        from .models import Accessible
        if issubclass(queryset.model, Accessible):
            return queryset.user(request.user)
        return queryset

