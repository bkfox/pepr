"""
This module provides mixins that behave differently depending of the
transport used to make the request. For example this allows to optimize
API calls when request is done over WebSockets, etc.
"""
import asyncio
from inspect import getmembers

from django.core.exceptions import PermissionDenied
from django.urls.conf import path

from channels.db import database_sync_to_async
from rest_framework import decorators

from .request import RouterRequest


action = decorators.action


def is_extra_action(obj):
    """ Return True if the given object is a DRF action"""
    return hasattr(obj, 'mapping') and callable(obj)


class ConsumerSetMixin:
    """
    Equivalent of ViewSet adapted to consumers. Usage is the same.
    """
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

    # TODO: cached result
    @classmethod
    def get_actions(cls):
        return [func for _, func in getmembers(cls, is_extra_action)]

    @classmethod
    def get_urls(cls, prefix, basename):
        """
        Return url patterns for all actions. Urls patterns follows this
        format: ``prefix + func.url_path + '/'``.
        """
        return [
            path(prefix + func.url_path + '/', cls, {'action': func},
                 name=basename + '-' + func.url_name)
            for func in cls.get_actions()
        ]

    async def websocket_receive(self, message):
        """
        Expects a `message` created by a RouterConsumer (or having at
        least same values).
        """
        kwargs = message['kwargs']
        func = kwargs.pop('action', None)
        if not is_extra_action(func):
            return 404, {}

        request = message['request']
        args = message['args']
        # message['kwargs'] overrides func.kwargs, because given to
        # `path()` (more customizable this way)
        kwargs.update({k: v for k, v in func.kwargs.items()
                       if k not in kwargs})

        try:
            action = func.mapping[request.method.lower()]
            action = getattr(self, action)
        except KeyError:
            raise PermissionDenied('method not allowed')

        message['response'] = await action(request, *args, **kwargs)

