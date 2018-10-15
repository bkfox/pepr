import asyncio
from collections import deque
import json

from django.conf import settings
from django.http import HttpRequest, HttpResponse
from django.urls.exceptions import Resolver404
from django.urls.resolvers import RegexPattern, URLResolver
from django.utils.functional import cached_property

from channels.consumer import AsyncConsumer, get_handler_name
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework.response import Response as RestResponse

from .switch import Switch
from .request import RequestSerializer


class RouterConsumerBase(AsyncWebsocketConsumer):
    """
    Consumer that redirect incoming message to different views using
    a ``path`` attribute on incoming messages. The resolved view
    function is called with a request (RouterRequest) created with the
    incoming data. The response is then sent back, if any and of
    supported type: HttpResponse, DRF Response, tuple(status_code, {});

    Actions can also be directly declared on this class in order to be
    routed.
    """
    resolver = None
    """ URLResolver used by instance to resolve """
    serializer_class = RequestSerializer
    """ Serializer class to use for requests and messages """
    media_type = 'application/json'
    """ Data content type (used for request headers) """

    urlpatterns = []
    """ [class] List of patterns to use for routing """

    @cached_property
    def request_defaults(self):
        """
        Request object with data that won't change over different API
        calls. It is used to avoid extra data copy in combination with
        RouterRequest.
        """
        # FIXME: which data to copy, how to update etc.
        request = HttpRequest()
        request.consumer = self
        request.META = dict(self.scope.get('headers'))
        request.META.update({
            'HTTP_ACCEPT': self.media_type,
            'CONTENT_TYPE': self.media_type,
            'CONTENT_LENGTH': str(1),
        })
        request.COOKIES = self.scope.get('cookies').copy()
        request.content_type = request.META['CONTENT_TYPE']
        request.session = self.scope.get('session')
        request.user = self.scope.get('user')
        return request

    def __init__(self, scope):
        super().__init__(scope)
        self.resolver = URLResolver(RegexPattern(r'^/'), self.urlpatterns)

    @classmethod
    def register(cls, patterns):
        """ Add patterns routed by this class' instances. """
        # ensure those class attributes are different from parent class'
        # ones in order to avoid side effects.
        if 'urlpatterns' not in cls.__dict__:
            cls.urlpatterns = list(cls.urlpatterns or [])
        cls.urlpatterns += patterns

    def resolve(self, path):
        """ Resolve given url path. """
        return self.resolver.resolve(path)

    def reverse(self, view_name, **kwargs):
        """ Reverse url using given informations."""
        return self.resolver.reverse(view_name, self, **kwargs)

    def get_serializer(self, **init_kwargs):
        """ Return instance of serializer. """
        return self.serializer_class(**init_kwargs)

    def parse_data(self, value):
        """ Parse received value into data """
        return json.loads(value)

    def render_data(self, data):
        """ Serialize/render data to send """
        return json.dumps(data)

    #
    # Request processing
    #
    async def receive(self, text_data=None, bytes_data=None):
        """ By default, parse the one that isn't None """
        data = self.parse_data(text_data if bytes_data is None else
                               bytes_data)
        if data is None:
            return
        await self.receive_data(data)

    async def receive_data(self, data):
        """ Handle received data once it is parsed. """
        serializer = self.get_serializer(data=data)
        if not serializer.is_valid():
            return await self.reply(data.get('request_id', None), 403, {
                'content': 'invalid request: {}'.format(
                    '\n'.join(serializer.errors)
                ),
            })

        request = serializer.save()
        try:
            match = self.resolve(request.path)
        except Resolver404:
            return await self.reply(request.id, 404, {
                'content': '"{}" not found'.format(request.path)
            })

        try:
            self.prepare_request(request, match)
            func, args, kwargs = match
            if not asyncio.iscoroutinefunction(func):
                func = database_sync_to_async(func)
            response = await func(request, *args, **kwargs)
            await self.process_response(request, response)
        except:
            if settings.DEBUG:
                import traceback, sys
                exc_type, exc_value, exc_traceback = sys.exc_info()
                payload = {
                    'content': 'an exception occured: {}'.format(
                        traceback.format_exception(
                            exc_type, exc_value, exc_traceback
                        )
                    ),
                }
            else:
                payload = {'content': 'internal error'}
            await self.reply(request.id, 500, payload)

    def prepare_request(self, request, match):
        """ Prepare request before calling target view """
        request.defaults = self.request_defaults
        request.router = self

    async def process_response(self, request, response):
        """ Handle response of a view call """
        if response is None:
            return

        if isinstance(response, RestResponse):
            status, data = response.status_code, {'data': response.data}
        elif isinstance(response, HttpResponse):
            status, data = response.status_code, {'content': response.content}
        elif isinstance(response, tuple) and len(response) == 2:
            status, data = response
        else:
            raise ValueError('invalid response from view: {}'.format(response))

        await self.reply(request.id, status, data)

    #
    # Data sending
    #
    async def send_data(self, data):
        """
        Serialize given data/message and send().
        """
        if 'consumer' in data:
            del data['consumer']

        data = self.render_data(data)
        if isinstance(data, str):
            await super().send(text_data=data)
        else:
            await super().send(bytes_data=data)

    async def reply(self, request_id, status, payload, **extra_data):
        """
        Send a response message to client.
        :py:param int request_id: original request id
        :py:param int status: response status
        :py:param dict payload: response payload
        """
        if extra_data:
            payload.update(extra_data)

        payload.update({
            'request_id': request_id,
            'status': status,
        })
        await self.send_data(payload)


# TODO: upstream message handling
class RouterConsumer(RouterConsumerBase):
    """
    Router that also handle routing to consumers. Their life-cycle is
    also handled from this consumer.

    When url patterns are added, consumers are detected by checking the
    attribute ``cls`` on the view function. They are instanciated
    at the same time than the root consumer.
    """
    consumers = set()
    """ [class] List of consumers classes to init and run along me """

    def __init__(self, scope):
        super().__init__(scope)
        self.switch = Switch(scope, self.upstream_dispatch)

    async def __call__(self, receive, send):
        loop = asyncio.get_event_loop()
        my_call = loop.create_task(super().__call__(receive, send))

        try:
            if self.consumers:
                self.switch.create_multiple({
                    consumer: consumer for consumer in self.consumers
                })
                await asyncio.wait([
                    my_call,
                    loop.create_task(self.switch.wait())
                ])
            else:
                await my_call
        finally:
            self.switch.stop()
            my_call.cancel()
            try:
                await my_call
            except asyncio.CancelledError:
                pass

    @staticmethod
    def get_view_consumer_class(view):
        """
        Get consumer class for this view or None.
        """
        cls = getattr(view, 'cls', None)
        return cls if cls and issubclass(cls, AsyncConsumer) else None

    @classmethod
    def register(cls, patterns):
        super().register(patterns)

        # check for consumers
        if 'consumers' not in cls.__dict__:
            cls.urlpatterns = list(cls.urlpatterns or [])

        patterns = deque(patterns)
        while patterns:
            pattern = patterns.pop()
            if isinstance(pattern, URLResolver):
                if pattern.urlpatterns:
                    patterns.extend(pattern.urlpatterns)
                continue

            view = getattr(pattern, 'callback', None)
            c_cls = view and cls.get_view_consumer_class(view)
            if c_cls and c_cls not in cls.consumers:
                cls.consumers.add(c_cls)

    def prepare_request(self, request, match):
        # add consumer instance to request
        view = match.func
        consumer_class = self.get_view_consumer_class(view)
        if consumer_class:
            consumer = self.switch.get(consumer_class)
            request.consumer = consumer and consumer.instance
        super().prepare_request(request, view)

    #
    # Switch message handling
    #
    async def upstream_dispatch(self, message):
        handler = getattr(self, 'upstream_' + get_handler_name(message), None)
        if handler:
            await handler(message)

    async def upstream_websocket_send(self, message):
        await self.send(
            self.render_data(message['text']) if 'text' in message else None,
            self.render_data(message['bytes']) if 'bytes' in message else None
        )

