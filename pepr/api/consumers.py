import asyncio
from collections import deque
from inspect import isclass
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


class RouterBaseConsumer(AsyncWebsocketConsumer):
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

    resolver_pattern = '^/'
    """  """
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
        meta = dict(self.scope.get('headers'))
        host, *port = meta[b'host'].decode('utf-8').split(':')
        print(host, port)

        request = HttpRequest()
        request.consumer = self
        request.META = dict(meta)
        request.META.update({
            'HTTP_ACCEPT': self.media_type,
            'CONTENT_TYPE': self.media_type,
            'CONTENT_LENGTH': str(1),
            'SERVER_NAME': host,
            # FIXME
            'SERVER_PORT': port[0] if port else 80,
        })
        request.COOKIES = self.scope.get('cookies').copy()
        request.content_type = request.META['CONTENT_TYPE']
        request.session = self.scope.get('session')
        request.user = self.scope.get('user')
        return request

    def __init__(self, scope):
        super().__init__(scope)
        self.resolver = URLResolver(RegexPattern(self.resolver_pattern),
                                    self.urlpatterns)

    @classmethod
    def register(cls, patterns):
        """ Add patterns routed by this class' instances. """
        # ensure those class attributes are different from parent class'
        # ones in order to avoid side effects.
        if 'urlpatterns' not in cls.__dict__:
            cls.urlpatterns = list(cls.urlpatterns or [])
        cls.urlpatterns += patterns

    def resolve(self, path):
        """
        Resolve given path and return a ResolverMatch.
        """
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

        try:
            path = serializer.validated_data['path']
            match = self.resolve(path)
        except Resolver404:
            return await self.reply(data['request_id'], 404, {
                'data': {'detail': '"{}" not found'.format(path)}
            })

        request = None
        try:
            request = self.create_request(serializer, match)
            response = await self.process_request(request, match)
            await self.process_response(request, response)
        except:
            if settings.DEBUG:
                import traceback, sys
                traceback.print_exc(file=sys.stdout)

                exc_type, exc_value, exc_traceback = sys.exc_info()
                payload = {'data': {
                    'detail': 'an exception occured: {}'.format(
                        traceback.format_exception(
                            exc_type, exc_value, exc_traceback
                        )
                    )
                }}
            else:
                payload = {'data': {'detail': 'internal error'}}
            await self.reply(data.get('request_id'), 500, payload)

    def create_request(self, serializer, match):
        """
        Create the request send upstream with given serialized
        data and resolver match.
        """
        request = serializer.save()
        request.defaults = self.request_defaults
        request.router = self
        return request

    async def process_request(self, request, match):
        """ Process request using given ResolverMatch. """
        func, args, kwargs = match
        if not asyncio.iscoroutinefunction(func):
            # ensure that `func` is async.
            func = database_sync_to_async(func)
        return await func(request, *args, **kwargs)

    async def process_response(self, request, response):
        """ Handle response of a view call """
        if response is None:
            return

        if isinstance(response, RestResponse):
            status, data = response.status_code, {'data': response.data}
            if 'content' in response.__dict__:
                data['content'] = response.content
            elif response.template_name:
                response.render()
                data['content'] = response.content
        elif isinstance(response, HttpResponse):
            status, data = response.status_code, {'content': response.content}
        elif isinstance(response, tuple) and len(response) == 2:
            status, data = response
        else:
            raise ValueError('invalid response from view: {}'.format(response))

        # Ensure data.context is not `bytes`: must be a string for
        # serialization.
        if 'content' in data and isinstance(data['content'], bytes):
            data['content'] = data['content'].decode('utf-8')

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
# TODO: limit maximum number of running consumers
class RouterConsumer(RouterBaseConsumer):
    """
    Router that also handle routing to consumers. Their life-cycle is
    also handled from this consumer.

    When url patterns are added, consumers are detected by checking the
    attribute ``cls`` on the view function. They are instanciated
    at the same time than the root consumer.
    """
    consumers = set()
    """ [class] List of consumers classes to init and run along me """
    switch = None

    def __init__(self, scope):
        super().__init__(scope)
        self.switch = Switch(scope, self.upstream_dispatch)

    async def __call__(self, receive, send):
        loop = asyncio.get_event_loop()
        my_call = loop.create_task(super().__call__(receive, send))

        try:
            if self.consumers:
                # TODO: create on demand
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
            if view and isclass(view) and \
                    issubclass(view, AsyncConsumer):
                cls.consumers.add(view)

    def create_request(self, serializer, match):
        request = super().create_request(serializer, match)

        # add consumer instance to request
        if isclass(match.func) and issubclass(match.func, AsyncConsumer):
            request.consumer = self.switch.get(match.func)

        return request

    def prepare_upstream_message(self, request, match, **kwargs):
        """
        Prepare message sent to upstream consumer. Values set
        are:

        .. code-block:: python

            {'type': 'websocket.receive', 'request': request,
             'response': None, args: match.args, kwargs: match.kwargs}

        Where ``response`` is used to return a response to send back.
        """
        kwargs.setdefault('type', 'websocket.receive')
        kwargs.setdefault('request', request)
        # response is required because consumer's `dispatch()` does not
        # return results. We keep it right regarding to consumers
        # architecture.
        kwargs.setdefault('response', None)
        kwargs.setdefault('args', match.args)
        kwargs.setdefault('kwargs', match.kwargs)
        return kwargs

    async def process_request(self, request, match):
        # self.switch's slots keys are the consumer class. This
        # allows us to directly pass consumer classes as view function
        # to `register`.
        if not isclass(match.func) or \
                not issubclass(match.func, AsyncConsumer):
            return await super().process_request(request, match)

        message = self.prepare_upstream_message(request, match)
        await self.switch.receive(message, slot=match.func)
        return message.get('response')

    #
    # Websocket events handling
    #
    async def accept(self):
        await super().accept()
        await self.switch.connect()

    async def close(self):
        await self.switch.disconnect()
        await super().close()

    async def disconnect(self, code):
        await self.switch.disconnect()
        await super().disconnect(code)

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

