import asyncio

from channels.consumer import get_handler_name
from rest_framework.exceptions import NotFound

from .consumers import ApiConsumer, ApiConsumerMeta
from .switch import Switch
from ..utils.register import Register
from ..utils.string import camel_to_snake


class MultiplexConsumerMeta(ApiConsumerMeta):
    def __new__(cls, name, bases, attrs):
        cl = super().__new__(cls, name, bases, attrs)
        if not attrs.get('consumer_classes'):
            cl.consumer_classes = Register(
                get_entry_key=cls.get_entry_key
            )
        return cl

    @staticmethod
    def get_entry_key(self, entry):
        return '/' + camel_to_snake(entry.__name__)


class MultiplexConsumer(ApiConsumer, metaclass=MultiplexConsumerMeta):
    """
    Redirect incoming message to consumer corresponding to the given action.
    Consumers are registered to specific slot which composes the action,
    such as `/long/slot/action'.

    Only subclasses of ApiConsumer will work here.
    """
    consumer_classes = Register()
    """
    [class] Register of consumers classes that can be invoked the multiplexer.
    """
    switch = None
    """ Consumer switch. """
    ignore_prefix = '/'
    """ Prefix in request's action that should be ignored if present """

    def __init__(self, scope, consumer_classes=None):
        super().__init__(scope)
        self.switch = Switch(scope, self.upstream_dispatch)
        if consumer_classes:
            self.consumer_classes = consumer_classes

    async def __call__(self, receive, send):
        loop = asyncio.get_event_loop()
        my_call = loop.create_task(super().__call__(receive, send))

        try:
            while not my_call.done():
                await self.switch.wait(my_call)
        finally:
            self.switch.stop()
            my_call.cancel()
            try:
                await my_call
            except asyncio.CancelledError:
                pass

    @classmethod
    def resolve(cls, path):
        """
        Return a slot name for the given path, or None if
        not found. Resolve is run over the class' registered consumers.

        :returns: `(slot, action)` where `action` is whats left of the path. \
                  Returns `None` if no slot has been found.
        """
        if path.startswith(cls.ignore_prefix):
            path = path[len(cls.ignore_prefix):]
        # request consumer without might leave an ending '/' in request path
        # we remove it to be sure.
        path = path.rstrip('/')

        opath = path
        i = len(path)
        while i > 0:
            # check for a slot starting with the one with the longest
            # name: this eases extensibility.
            path = path[:i]
            if path in cls.consumer_classes:
                return path, opath[len(path):]
            i = path.rfind('/')

    async def receive_request(self, request):
        match = self.resolve(request.path)
        if not match:
            raise NotFound()

        slot, request.path = match
        ci, created = self.switch.get_or_create(slot, self.consumer_classes)
        if not ci:
            return await self.send_api_exception(NotFound())
        if created:
            # force new consumer to be initialized (its "__call__" task
            # is scheduled in event loop)
            await asyncio.sleep(0)

        consumer = ci.instance
        request.multiplex = self
        request.consumer = consumer
        return await consumer.receive_request(request)

    #
    # Websocket events
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
        await self.send(message.get('text'), message.get('bytes'))


