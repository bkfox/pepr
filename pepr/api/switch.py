import asyncio
from collections import namedtuple
from functools import partial
from itertools import chain

from channels.consumer import get_handler_name

from ..utils.register import Register


class ConsumerInfo:
    """
    Information about consumer alive on the dispatcher.
    """
    slot, instance, stream = None, None, None
    task, accept = None, False

    def __init__(self, slot, instance, stream, task=None, accept=False):
        self.slot, self.instance, self.stream = slot, instance, stream
        self.task, self.accept = task, accept


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
    consumer_timeout = 1.312
    """ Timeout when closing consumers. """
    consumer_queue_size = 8
    """ Maximum size for each consumer message queue """

    # used to know if websocket_connect has yet happened
    _connect_happened = False

    entry_key_attr = 'slot'

    @property
    def consumer_tasks(self):
        """ Consumer tasks """
        return (consumer.task for consumer in self.entries.values())

    @property
    def accept_frames(self):
        """ Return True if at least one consumer accepts framesV. """
        consumer = next((consumer for consumer in self.entries.values()
                        if consumer.accept), None)
        return consumer is not None

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
        if consumers is None:
            consumers = self.entries.values().copy()

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

    def create(self, slot, consumer_class, init_kwargs={}):
        r"""
        Create and spawn a new a consumer using given informations, and
        return the correspondig ConsumerInfo.
        :raises ValueError: consumer exists yet for this ``slot``.
        """
        if slot in self.entries and not self.entries[slot].task.done():
            raise ValueError('a consumer is active for slot "{}"'
                             .format(slot))

        stream = asyncio.Queue(maxsize=self.consumer_queue_size)
        consumer_info = ConsumerInfo(
            slot, consumer_class(self.scope, **init_kwargs), stream
        )

        loop = asyncio.get_event_loop()
        consumer_info.task = loop.create_task(consumer_info.instance(
            stream.get,
            partial(self._dispatch_downstream, consumer=consumer_info)
        ))
        consumer_info.task.consumer_info = consumer_info
        self.entries[slot] = consumer_info

        # FIXME: _connect_happened can be false if create is called while
        # websocket_connect task is still running
        if self._connect_happened:
            consumer_info.stream.put_nowait({'type': 'websocket.connect'})
        return consumer_info

    def create_multiple(self, consumer_classes, init_kwargs={}):
        """
        Create multiple consumers at once, where ``consumer_classes`` is
        a dict of ``{ slot: ConsumerClass }``.

        The created consumers are returned as a list.
        """
        return [self.create(consumer_class, slot, init_kwargs)
                for slot, consumer_class in consumer_classes.items()]

    def get_or_create(self, slot, consumer_class, **init_kwargs):
        if slot not in self:
            consumer_info = self.create(slot, consumer_class)
            return consumer_info, True
        return self.get(slot).instance, False

    async def wait(self, *extra_aws, **wait_kwargs):
        """
        Create an awaitable (not Task) waiting for the first consumer
        tasks to complete.
        """
        # FIXME: what if a consumer awaits for another consumer it has
        #        created and added to the switch
        aws = chain(self.consumer_tasks, extra_aws)
        wait_kwargs.setdefault('return_when', asyncio.FIRST_COMPLETED)
        done, pending = await asyncio.wait(aws, **wait_kwargs)

        for task in done:
            ci = getattr(task, 'consumer_info', None)
            if ci is None:
                continue
        self.stop((task.consumer_info for task in done
                    if hasattr(task, 'consumer_info')))

        done = (task for task in done
                if not hasattr(task, 'consumer_info'))
        pending = (task for task in pending
                   if not hasattr(task, 'consumer_info'))
        return done, pending

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

    async def send_downstream(self, message, consumer=None):
        """ Send message downstream """
        message['consumer'] = consumer and consumer.instance
        if asyncio.iscoroutinefunction(self.base_send):
            await self.base_send(message)
        else:
            self.base_send(message)

    async def accept_downstream(self, subprotocol=None):
        """ Send `websocket.accept` upstream.  """
        await self.send_downstream({
            'type': 'websocket.accept', 'subprotocol': subprotocol
        })

    async def close_downstream(self):
        """ Send `websocket.close` downstream.  """
        await self.send_downstream({'type': 'websocket.close'})

    async def websocket_accept(self, message, consumer):
        """ Upstream consumer accepts connection """
        # send downstream only when there is not consumer accepting
        # frames.
        send_downstream = not self.accept_frames
        consumer.accept = True
        if send_downstream:
            await self.accept_downstream(message.get('subprotocol'))

    async def websocket_close(self, message, consumer):
        """ Upstream consumer closes connection.  """
        consumer.accept = False
        # send downstream only when there is no more consumer accepting
        # frames
        if self._connect_happened and not self.accept_frames:
            await self.close_downstream()

    #
    # Downstream to upstream
    #
    async def _dispatch_upstream(self, message, consumer=None):
        """
        Send messsage to upstream consumer(s)
        """
        if consumer:
            await consumer.instance.dispatch(message)
        else:
            for consumer in self.entries.values():
                await consumer.instance.dispatch(message)

    async def receive(self, message, slot=None):
        """
        Dispatch received message to the upstream consumer on the given
        slot. Raises ``ValueError`` if the message can't be handled.
        """
        consumer = self.entries.get(slot)
        if not consumer or not consumer.accept:
            raise ValueError('not available')
        await self._dispatch_upstream(message, consumer)

    async def connect(self):
        """ Connection from downstream """
        await self._dispatch_upstream({'type': 'websocket.connect'})
        self._connect_happened = True

        if not self.accept_frames:
            await self.close_downstream()

    async def disconnect(self, code=None):
        """ Disconnection from downstream """
        await self._dispatch_upstream({'type': 'websocket.disconnect',
                                       'code': code})
        try:
            tasks = list(self.consumer_tasks)
            if tasks:
                await asyncio.wait(tasks, timeout=self.consumer_timeout)
        except asyncio.TimeoutError:
            pass
        finally:
            self.stop()

