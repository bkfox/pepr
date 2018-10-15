
from django.core.exceptions import ValidationError
from django.db.models.query import QuerySet
from django.http import Http404
from django.shortcuts import get_object_or_404 as _get_object_or_404

from rest_framework import mixins, views
from rest_framework.settings import api_settings



class GenericAPIConsumer:
    """ 
    Base class for generic api consumers; Provides similar interface than
    ``rest_framework.generics.GenericAPIView``.
    """
    queryset = None
    serializer_class = None

    lookup_field = 'pk'
    lookup_url_kwargs = None

    filter_backends = api_settings.DEFAULT_FILTER_BACKENDS

    def get_queryset(self):
        """
        Get items iterable; it can be an iterable.
        """
        assert self.queryset is not None, (
            "{} should either include a `queryset` attribute, or "
            "override the `get_queryset()` method."
            .format(self.__class__.__name__)
        )
        queryset = self.queryset
        if isinstance(queryset, QuerySet):
            queryset = queryset.all()
        return self.queryset

    def get_object(self):
        """
        Return object
        """
        queryset = self.filter_queryset(self.get_queryset())


