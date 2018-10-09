"""
This module provides mixins that behave differently depending of the
transport used to make the request. For example this allows to optimize
API calls when request is done over WebSockets, etc.
"""
from inspect import getmembers

from django.urls.resolvers import RoutePattern, URLPattern

from rest_framework.viewsets import ViewSetMixin

from .request import RouterRequest



def is_action(obj):
    """ Return True if the given object is a DRF action"""
    return callable(obj) and hasattr(obj, 'bind_to_methods')


class RoutedMixin:
    """
    Mixin that can be used to declare methods as actions, that then can
    be used to be routed.
    """
    url_prefix = None
    url_basename = None
    url_name_format = r'{basename}-{name}'
    url_format = r'{prefix}/{url_path}/'

    @classmethod
    def get_urlpattern(cls, method):
        """
        Get url pattern for given action method.
        """
        # TODO: action.detail => redeclare an action function to by-pass
        #       this argument.
        if not is_action(method):
            raise ValueError(
                'Method must be decorated with Rest Framewotk\'s `@action`'
            )

        name = cls.url_name_format.format(
            basename=cls.url_basename, name=method.url_name
        )
        kwargs = method.kwargs.get('kwargs')
        pattern_class = method.kwargs.get('url_pattern_class', RoutePattern)
        url = cls.url_format.format(
            prefix=cls.url_prefix, url_path=method.url_path
        )

        def view(request, *args, **kwargs):
            return method(request.router, request, *args, **kwargs)

        return URLPattern(
            pattern_class(url, name=name, is_endpoint=True),
            view, kwargs, url
        )

    @classmethod
    def get_urlpatterns(cls):
        """ Get url patterns of actions declared on this class. """
        return [
            cls.get_urlpattern(method)
            for _, method in getmembers(cls, is_action)
        ]

