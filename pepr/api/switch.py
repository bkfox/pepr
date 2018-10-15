import asyncio
from collections import namedtuple
from functools import partial

from channels.consumer import get_handler_name

from pepr.utils.register import Register


ConsumerInfo = namedtuple(
    'ConsumerInfo',
    ['slot', 'instance', 'stream', 'task', 'accept']
)
"""
Information about consumer alive on the dispatcher.
"""


# TODO: propose & implement interface similar to Register, but remove
#       Register parent class (in order to have a standalone app)
class Switch(Register):
    """
    Hold multiple consumers and route message downstream and upstream
    (it is not a consumer albeit it might acts a bit like it).

    Each consumer is adressed with a unique slot used. It is up to the
    user to schedule the corresponding tasks once their created and
    added.

    Messages emitted by upstream consumers are partially handled (such
    as for connection management). Messages passed downstream have an
    extra attribute "consumer" set to the source of the message.
    Messages are passed downstream by calling the provided async method

    Largely inspired and adapted from `hishnash/channelsmultiplexer`.
    """
    scope = None
    """ scope used to initialize consumers """
    consumer_close_timeout = 1.312
    """ Timeout when closing consumers. """

    # used to know if websocket_connect has yet happened
    _connect_happened = False

    entry_key_attr = 'slot'

    @property
    def consumer_tasks(self):
        """ Consumer tasks """
        return (consumer.task for consumer in self.entries)

    @property
    def consumer_accepting_frames(self):
        """ List of consumers accepting frames. """
        return (consumer
                for consumer in self.entries.values()
                if consumer.accept)

    def __init__(self, scope, base_send):
        self.scope = scope
        self.base_send = base_send
        super().__init__()

    #
    # Consumers management
    #
    async def stop(self, consumers=None):
        """
        Stop and remove given consumers (if None, do it for all
        handled consumers): related tasks will be cancelled *without*
        sending event upstream.

        :param list consumers: list of ConsumerInfo
        """
        if not consumers:
            consumers = self.entries.copy()

        for consumer in consumers:
            try:
                if not consumer.task.done():
                    consumer.task.cancel()
                await consumer.task
            except asyncio.CancelledError:
                pass
            finally:
                if consumer.slot in self.entries and \
                        self.entries[consumer.slot] == consumer:
                    del self.entries[consumer.slot]
        self._connect_happened = False

    def create(self, slot, consumer_class, init_kwargs):
        r"""
        Create and spawn a new a consumer using given informations, and
        return the correspondig ConsumerInfo.
        :raises ValueError: consumer exists yet for this ``slot``.
        """
        if slot in self.entries:
            raise ValueError('consumer for this slot exists yet')

        loop = asyncio.get_event_loop()
        consumer = consumer_class(self.scope, **init_kwargs)
        stream = asyncio.Queue()
        task = loop.create_task(consumer(
            stream.get, partial(self._dispatch_downstream, consumer=consumer)
        ))
        consumer = ConsumerInfo(slot, consumer, stream, task, False)
        self.entries[slot] = consumer

        if self._connect_happened:
            consumer.stream.put_nowait({'type': 'websocket.connect'})
        return consumer

    def create_multiple(self, consumer_classes, init_kwargs={}):
        """
        Create multiple consumers at once, where ``consumer_classes`` is
        a dict of ``{ slot: ConsumerClass }``.

        The created consumers are returned as a list.
        """
        return [self.create(consumer_class, slot, init_kwargs)
                for slot, consumer_class in consumer_classes.items()]

    async def wait(self, consumers=None, **wait_kwargs):
        """
        Create an awaitable (not Task) waiting for consumers to complete.
        If ``consumers`` is None, use registered consumers.
        """
        consumers = self.entries.values() if consumers is None else consumers
        if not consumers:
            return
        return await asyncio.wait([
            consumer.task for consumer in consumers
        ], **wait_kwargs)

    #
    # Upstream to downstream
    #
    async def _dispatch_downstream(self, message, consumer):
        """
        Dispatch a message from upstream consumers to downstream. This
        method is called from their event loop.
        """
        handler = getattr(self, get_handler_name(message), None)
        if handler:
            await handler(message, consumer=consumer)
        else:
            await self.send_downstream(message, consumer=consumer)

    async def send_downstream(self, message, consumer):
        """ Send message downstream """
        message['consumer'] = consumer
        if asyncio.iscoroutinefunction(self.base_send):
            await self.base_send(message)
        else:
            self.base_send(message)

    async def websocket_accept(self, message, consumer):
        """ Upstream consumer accepts connection """
        consumer.accept = True
        if self.consumer_accepting_frames == 1:
            await self.send_downstream(message, consumer)

    async def websocket_close(self, message, consumer):
        """ Upstream consumer closes connection.  """
        consumer.accept = False
        # emit 'close' event only when no more consumer
        if not self.consumer_accepting_frames:
            await self.send_downstream(message, consumer)

    #
    # Downstream to upstream
    #
    async def _dispatch_upstream(self, message, consumer=None):
        """
        Send messsage to upstream consumer(s)
        """
        if consumer:
            await consumer.stream.put(message)
            return
        for consumer in self.entries.values():
            await consumer.stream.put(message)

    async def websocket_receive(self, message, slot=None):
        """
        Dispatch received message to the upstream consumer on the given
        slot. Raises ``ValueError`` if the message can't be handled.
        """
        consumer = self.entries.get(slot)
        if not consumer or not consumer.accept:
            raise ValueError('not available')
        await self._dispatch_upstream(message, consumer)

    async def websocket_connect(self, message):
        """ Connection event from downstream """
        self._connect_happened = True
        await self._dispatch_upstream(message)

    async def websocket_disconnect(self, message):
        """ Disconnection from downstream """
        await self._dispatch_upstream(message)
        try:
            await asyncio.wait(
                list(self.consumer_tasks),
                timeout=self.consumer_close_timeout
            )
        except asyncio.TimeoutError:
            pass
        finally:
            self.stop()
