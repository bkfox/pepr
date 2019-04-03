import asyncio
import json

from django.conf import settings

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework.exceptions import APIException, ParseError, ValidationError
from rest_framework.decorators import MethodMapper

from . import serializers
from ..utils.debug import report_error
from .message import ApiResponse


def is_action(func):
    """ Return True if given function is an action """
    return callable(func) and hasattr(func, 'action') and \
        hasattr(func, 'mapping')


def action(methods=None, name=None, **kwargs):
    """
    Decorate a method in order to make it an action. Similar to DRF's
    `@action` decorator (including for method mapping).
    """
    methods = ['get'] if methods is None else methods

    def decorator(func):
        func.action = func.__name__ if name is None else name
        func.mapping = MethodMapper(func, methods)
        func.action_data = kwargs
        return func
    return decorator


class ApiConsumerMeta(type):
    """
    Metaclass for ApiConsumer classes
    """
    def __new__(cls, name, bases, attrs):
        cl = super().__new__(cls, name, bases, attrs)
        actions = {func.action: func
                   for func in (getattr(cl, attr) for attr in dir(cl))
                   if is_action(func)}
        if cl.actions:
            cl.actions.update(actions)
        else:
            cl.actions = actions
        return cl


class ApiConsumerBase:
    """ Base class for ApiConsumer, handling data de-serialization. """
    message_serializer = serializers.ApiMessageSerializer
    request_serializer = serializers.ApiRequestSerializer
    response_serializer = serializers.ApiResponseSerializer

    def parse_data(self, value):
        """ Parse received value into data """
        return json.loads(value)

    def render_data(self, data):
        """ Serialize/render data to send """
        try:
            return json.dumps(data)
        except json.decoder.JSONDecodeError:
            return None

    def get_message_serializer(self, *args, **kwargs):
        kwargs.setdefault('consumer', self)
        return self.message_serializer(*args, **kwargs)

    def get_request_serializer(self, *args, **kwargs):
        kwargs.setdefault('consumer', self)
        return self.request_serializer(*args, **kwargs)

    def get_response_serializer(self, *args, **kwargs):
        kwargs.setdefault('consumer', self)
        return self.response_serializer(*args, **kwargs)


class ApiConsumer(ApiConsumerBase, AsyncWebsocketConsumer,
                  metaclass=ApiConsumerMeta):
    """
    Base consumer class that can handle multiple actions (similar to
    viewset).
    """
    actions = None

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

    async def send_message(self, obj, serializer=None):
        """ Send a given ApiMessage over websocket. """
        serializer = self.get_message_serializer(instance=obj) \
            if serializer is None else serializer
        return await self.send_data(serializer.data)

    async def send_request(self, obj):
        """ Send a given ApiRequest over websocket """
        return await self.send_message(
            obj, self.get_request_serializer(instance=obj)
        )

    async def send_response(self, obj):
        """ Send a given ApiResponse over websocket """
        return await self.send_message(
            obj, self.get_response_serializer(instance=obj)
        )

    async def send_api_exception(self, exception, request=None):
        """ Send a Response for this ApiException """
        request_id = request.request_id if request else None
        response = ApiResponse(self, request_id=request_id,
                               status=exception.status_code,
                               errors=exception.get_full_details())
        await self.send_response(response)

    async def receive(self, text_data=None, bytes_data=None):
        """ By default, parse the one that isn't None """
        data = self.parse_data(text_data if bytes_data is None else
                               bytes_data)
        if data is None:
            return await self.send_api_exception(ParseError())
        await self.receive_data(data)

    async def receive_data(self, data):
        """ Handle incoming websocket message """
        serializer = self.get_request_serializer(data=data)
        if not serializer.is_valid():
            return await self.send_api_exception(ValidationError())
        request = serializer.save()
        request.user = self.scope['user']

        try:
            try:
                response = await self.receive_request(request)
                await self.handle_action_result(request, response)
            except Exception as error:
                if isinstance(error, APIException):
                    raise error
                report_error()
                raise APIException()
        except APIException as error:
            response = request.response(
                status=error.status_code,
                errors=error.get_full_details()
            )
            self.send_response(response)

    async def receive_request(self, request):
        """ Handle incoming request and dispatch to adequate action. """
        action = self.actions.get(request.path.lstrip('/'))
        if action is None:
            return 404, None

        method = request.method.lower() if request.method else 'get'
        func = getattr(self, action.mapping[method])

        if not asyncio.iscoroutinefunction(func):
            func = database_sync_to_async(func)
        return await func(request)

    async def handle_action_result(self, request, response):
        """
        Handle return value from the call of an action. If any response
        has been returned, it will be sent back.

        Response can be any of:
        - `(status, data)`: a response owith those status and data;
        - `ApiResponse`: a response instance;
        - `dict`: a dict to directly serialize and send back.
        """
        if response is None:
            return
        if isinstance(response, dict):
            return await self.send_data(response)

        if isinstance(response, tuple):
            response = request.response(status=response[0],
                                        data=response[1])
        elif not isinstance(response, ApiResponse):
            raise ValueError(
                'invalid response "{}" for action "{}" (method: "{}")'
                .format(response, request.path, request.method)
            )
        await self.send_response(response)


