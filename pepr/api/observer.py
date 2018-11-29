from collections import namedtuple

from django.db.models.signals import post_save, post_delete

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer

from .mixins import ConsumerSetMixin, action


Observer = namedtuple('Observer', ['request_id', 'data'])


class ObserverConsumer(ConsumerSetMixin, AsyncWebsocketConsumer):
    """
    Base class to observe model instances changes (Create/Update/Delete).
    A single instance of this consumer can be used to observe multiple
    objects at the same time.

    ``ObserverConsumer`` takes advantages of Channels layers: each
    observer is attached to a group based on its filter. When an
    object changes, the corresponding groups are notified of the
    change.
    """
    model = None
    serializer_class = None

    observers = None
    filter_attr = 'pk'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.observers = {}

    #
    # Actions
    #
    @action(detail=True)
    async def observer(self, request, pk, **kwargs):
        """ Action: observe a Context """
        filter = str(pk)
        if filter not in self.observers:
            return 404, {}

        observer = self.observers.get(filter)
        return 200, {'data': {'observer': {
            'request_id': observer.request_id
        }}}

    @observer.mapping.post
    async def observer_post(self, request, pk, **kwargs):
        filter = str(pk)
        if filter in self.observers:
            return 403, {'content': 'yet observing'}

        data = await self.get_observer_data(request, filter)
        if data is None:
            return 405, {'content': 'can not observe'}

        self.observers[filter] = Observer(request.id, data)
        await self.channel_layer.group_add(
            self.get_observer_group(filter), self.channel_name,
        )
        return 200, {}

    @observer.mapping.delete
    async def observer_delete(self, request, pk, **kwargs):
        filter = str(pk)
        if filter not in self.observers:
            return 200, {'content': 'not observed'}

        del self.observers[filter]
        await self.channel_layer.group_discard(
            self.get_observer_group(filter), self.channel_name
        )
        return 200, {}

    @classmethod
    def get_observer_filter(self, instance):
        """ Return observer's filter value for given instance. """
        return str(getattr(instance, self.filter_attr, None))

    @classmethod
    def get_observer_group(cls, filter):
        """ Get channels layer group name based on filter. """
        name = '{}.{}.{}'.format(cls.model._meta.db_table,
                                 cls.filter_attr, filter)
        return name.replace('_', '-')

    async def get_observer_data(self, request, filter):
        """
        Return custom data to store on the observer. Returning None
        means observation is not possible (returns 405)
        """
        return {}

    #
    # Events
    #
    def get_serializer_class(self, instance):
        """ Get serializer class instanciated by ``get_serializer``. """
        return self.serializer_class

    # TODO: #genericapi
    def get_serializer(self, instance, **initkwargs):
        """
        Get serializer used to serialize instances that have been
        updated.
        """
        cls = self.get_serializer_class(instance)
        return cls(instance=instance, **initkwargs)

    async def propagate_observation(self, event, observer, instance):
        """ Send update event (= observation) to the client. """
        data = {'pk': str(instance.pk)} \
            if event['method'] is 'DELETE' else \
            self.get_serializer(instance).data

        await self.send({
            'request_id': observer.request_id,
            'status': 200,
            'method': event['method'],
            'data': data,
        })

    async def instance_changed(self, event):
        """ Handle `instance.changed` event """
        instance = event['instance']
        filter = self.get_observer_filter(instance)
        observer = self.observers.get(filter)
        if observer:
            await self.propagate_observation(event, observer, instance)

    async def websocket_disconnect(self, message):
        # clean-up
        for filter, observer in self.observers.items():
            await self.channel_layer.group_discard(
                self.get_observer_group(filter), self.channel_name
            )

    @classmethod
    def connect_signals(cls):
        """
        Connect Observer class to observed model's change signals in
        order to notify observers from changes.
        """
        def emit_event(method, instance):
            filter = cls.get_observer_filter(instance)
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


