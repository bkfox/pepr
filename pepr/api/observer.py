from collections import namedtuple

from django.db.models.signals import post_save, post_delete

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer

from .mixins import ConsumerSetMixin, action


Observer = namedtuple('Observer', ['request_id', 'data'])


class ObserverConsumer(ConsumerSetMixin, AsyncWebsocketConsumer):
    model = None
    serializer_class = None

    observers = None
    filter_attr = 'pk'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.observers = {}

    # TODO: #genericapi
    def get_serializer(self, instance, **initkwargs):
        """ Return serializer instance """
        return self.serializer_class(instance, **initkwargs)

    @classmethod
    def get_observer_key(cls, filter=None):
        """ Return observer key for the given filter value. """
        return '{}'.format(filter)

    @classmethod
    def get_observer_group(cls, filter):
        """ Get channels layer group name based on filter. """
        name = 'pepr.{}.{}.{}'.format(cls.model._meta.db_table,
                                      cls.filter_attr, filter)
        return name.replace('_', '-')

    async def get_observer_data(self, request, filter):
        """
        Return custom data to store on the observer. Returning None
        means observation is not possible (returns 405)
        """
        return {}

    @action(('get', 'post', 'delete'), detail=True)
    async def observer(self, request, pk):
        """ Action: observe a Context """
        # awaiting that PR#5605 on DRF is in release
        if request.method.lower() == 'get':
            func = self.observer_get
        elif request.method.lower() == 'post':
            func = self.observer_post
        elif request.method.lower() == 'delete':
            func = self.observer_delete
        return await func(request, pk)

    async def observer_get(self, request, filter):
        key = self.get_observer_key(filter)
        if key not in self.observers:
            return 404, {}

        observer = self.observers.get(key)
        return 200, {'data': {'observer': {
            'request_id': observer.request_id
        }}}

    async def observer_post(self, request, filter):
        key = self.get_observer_key(filter)
        if key in self.observers:
            return 403, {'content': 'yet observing'}

        data = await self.get_observer_data(request, filter)
        if data is None:
            return 405, {'content': 'can not observe'}

        self.observers[key] = Observer(request.id, data)
        await self.channel_layer.group_add(
            self.get_observer_group(filter), self.channel_name,
        )
        return 200, {}

    async def observer_delete(self, request, filter):
        key = self.get_observer_key(filter)
        if key not in self.observers:
            return 200, {'content': 'not observed'}

        del self.observers[key]
        await self.channel_layer.group_discard(
            self.get_observer_group(filter), self.channel_name
        )
        return 200, {}

    @classmethod
    def get_filter_value(self, instance):
        """ Return value for filter on instance. """
        return getattr(instance, self.filter_attr, None)

    async def propagate_observation(self, event, observer, instance):
        """ Send update event ( = observation) to the client. """
        serializer = self.get_serializer(instance)
        await self.send({
            'request_id': observer.request_id,
            'status': 200,
            'method': event['method'],
            'data': serializer.data,
        })

    async def instance_changed(self, event):
        instance = event['instance']
        key = self.get_observer_key(self.get_filter_value(instance))
        observer = self.observers.get(key)
        if observer:
            await self.propagate_observation(event, observer, instance)

    @classmethod
    def connect_signals(cls):
        def emit_event(method, instance):
            filter = cls.get_filter_value(instance)
            group_name = cls.get_observer_group(filter)
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(group_name, {
                'type': 'instance.changed',
                'instance': instance,
                'method': method,
            })

        def instance_post_save(sender, instance, created, **kwargs):
            return emit_event('POST' if created else 'PUT', instance)

        def instance_post_delete(sender, instance, **kwargs):
            return emit_event('DELETE', instance)

        post_save.connect(instance_post_save, cls.model, False)
        post_delete.connect(instance_post_delete, cls.model, False)



