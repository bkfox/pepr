"""
This module provides mixins that behave differently depending of the
transport used to make the request. For example this allows to optimize
API calls when request is done over WebSockets, etc.
"""
import asyncio
from inspect import getmembers

from django.urls.resolvers import RoutePattern, URLPattern

from channels.db import database_sync_to_async
from rest_framework import decorators
from rest_framework.viewsets import ViewSetMixin

from .request import RouterRequest


action = decorators.action


def is_action(obj):
    """ Return True if the given object is a DRF action"""
    return callable(obj) and hasattr(obj, 'bind_to_methods')


class ConsumerSetMixin:
    @classmethod
    def as_view(cls, actions, **initkwargs):
        """
        Return API view function for the given actions mapping. Equivalent
        to DRF's ``ViewSetMixin.as_view()`` but only for consumers.
        """
        async def view(request, *args, **kwargs):
            func = actions.get(request.method.lower())
            func = func and getattr(request.consumer, func, None)
            if func is None:
                return 405, {'content': 'method not allowed'}

            if not asyncio.iscoroutinefunction(func):
                func = database_sync_to_async(func)
            return await func(request, *args, **kwargs)

        view.cls = cls
        view.initkwargs = initkwargs
        view.suffix = initkwargs.get('suffix', None)
        view.actions = actions
        return view

    @classmethod
    def get_extra_actions(cls):
        return [action for _, action in getmembers(cls, is_action)]


