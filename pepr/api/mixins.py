"""
This module provides mixins that behave differently depending of the
transport used to make the request. For example this allows to optimize
API calls when request is done over WebSockets, etc.
"""
from django.core.exceptions import ImproperlyConfigured


class MultipleObjectMixin:
    """
    Provides basic functionalities to retrieve multiple objects.
    """
    queryset = None
    model = None

    def get_queryset(self, request):
        """
        Return queryset for the given request.

        Calling this base method implies that one of `queryset` and
        `model` attributes is set.
        """
        if self.queryset is not None:
            return self.queryset.all()
        if self.model:
            return self.model.objects.all()
        raise ImproperlyConfigured('`queryset` or `model` must be set.')


class SingleObjectMixin(MultipleObjectMixin):
    """
    Provides basic functionalities to retrieve a single object.
    """
    pk_attr = 'pk'
    pk_field = 'pk'

    def get_object(self, request):
        """
        Return object for the given request.
        """
        queryset = self.get_queryset(request)

        pk = request.data.get(self.pk_attr, None)
        if pk is None:
            return None

        key = self.pk_field or self.pk_attr
        kwargs = {key: pk}
        return queryset.get(**kwargs)


