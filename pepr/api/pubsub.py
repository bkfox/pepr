from collections import namedtuple

from django.db.models.signals import post_save, post_delete

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from rest_framework import serializers
from rest_framework.exceptions import NotFound

from ..utils.register import Register
from .consumers import ApiConsumer, action


Match = namedtuple('Match', ['filter', 'lookup'])
Subscription = namedtuple('Subscription', ['request_id', 'data'])


# TODO: - limit maximum number of subscriptions
#       - request data sanitization / access
#       - extra action to retrieve/clear all observations
#       - DOC + rewrite for PubsubConsumer from subscription() method.
#       - model save/delete signal handling in separate class
#       - TODO: CRUD like interface and serializer for incoming Subscription filters
class PubsubConsumer(ApiConsumer):
    """
    Base class to observe model instances changes (Create/Update/Delete).
    A single instance of this consumer can be used to observe multiple
    objects at the same time.

    ``PubsubConsumer`` takes advantages of Channels layers: each
    subscription is attached to a group based on its match. When an
    object changes, the corresponding groups are notified of the
    change.
    """
    model = None
    """ Observed model """
    serializer_class = None
    """ Class used to serialize instances sent to user. """
    subscriptions = None
    """ Register `{key: Subscription}` of running subscription """
    subscriptions_class = Register
    """ Register class to use for ``subscriptions`` """

    matches = {}
    """
    matches available to create subscription as a dict of
    `{match_filter: lookup}`, where `lookup` is used to retrieve a
    lookup for a given instance.

    - An attribute on model instance to use as match.lookup;
    - A callable `func(cls, instance)` returning match.lookup;
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.subscriptions = self.subscriptions_class()

    async def add(self, entry, key, *args, **kwargs):
        """ Remove an subscription by key and add channels' group """
        entry = self.subscriptions.add(entry, key, *args, **kwargs)
        await self.channel_layer.group_add(
            key, self.channel_name
        )
        return entry

    async def remove(self, key):
        """ Remove an subscription by key and discard channels' group """
        await self.channel_layer.group_discard(key, self.channel_name)
        return self.subscriptions.remove(key)

    async def clear(self):
        """ Clear all subscriptions and discard channels' groups """
        for key in self.consumers.keys():
            await self.channel_layer.group_discard(key, self.channel_name)
        self.subscriptions.clear()

    #
    # Keys tools
    #
    @classmethod
    def get_key(cls, match):
        """
        Return a key used as group name and as `subscriptions` key, or None.
        """
        if match.lookup is None:
            return None
        return '{}.{}.{}'.format(cls.model._meta.db_table,
                                 match.filter, match.lookup)

    @classmethod
    def get_request_match(cls, request, data=None):
        """
        Return ``Match`` for the given request, or None
        """
        data = request.data if data is None else data
        return Match(data.get('filter'), data.get('lookup'))

    @classmethod
    def get_request_key(cls, request, data=None):
        """ Return a key for the given request, or None. """
        match = cls.get_request_match(request, data)
        return cls.get_key(match) if match else None

    @classmethod
    def get_instance_match(cls, instance, match_filter):
        """
        Return ``Match`` for this instance and given ``matches``'s_key.
        """
        value = cls.matches.get(match_filter)
        if callable(value):
            value = value(cls, instance)
        else:
            value = getattr(instance, value, None)
        return Match(match_filter, value) \
            if value is not None else None

    @classmethod
    def get_instance_keys(cls, instance):
        """ Return a list of keys for this instance. """
        matches = (cls.get_instance_match(instance, match_filter)
                   for match_filter in cls.matches)
        return (cls.get_key(match)
                for match in matches if match.lookup is not None)

    #
    # Actions
    #
    @action(detail=True)
    async def subscription(self, request):
        """
        Manage an Subscription used to observe items changes. Each subscription
        has a key based on value passed by client, which is used to
        match items user is notified about.

        GET: get observation informations the given match.
        POST: start to observe items matching the given match.
        DELETE: stop observation for items matching the given match.
        """
        key = self.get_request_key(request)
        if key is None or key not in self.subscriptions:
            return 404, {}

        subscription = self.subscriptions.get(key)
        return 200, {'data': {'subscription': {
            'request_id': subscription.request_id,
        }}}

    @subscription.mapping.post
    async def subscription_post(self, request):
        match = self.get_request_match(request)
        key = self.get_key(match) if match.lookup is not None else None
        if key in self.subscriptions:
            return 200, {}

        data = await self.get_subscription_data(request, match) \
            if key is not None else None
        if data is None:
            return 404, {}

        # TODO: catch exception & clean-up
        await self.add(Subscription(request.request_id, data), key)
        return 200, {}

    @subscription.mapping.delete
    async def subscription_delete(self, request):
        key = self.get_request_key(request)
        if key not in self.subscriptions:
            return 404, {}

        await self.remove(key)
        return 200, {}

    async def get_subscription_data(self, request, match, **kwargs):
        """
        Return custom data to store on the subscription. Returning None
        means observation is not possible (returns 405).

        :param Request request: incoming request
        :param Match match: match for this subscription
        :param \**kwargs: extra subscription data
        """
        return kwargs

    #
    # Events
    #
    def get_serializer_class(self, instance):
        """ Get serializer class instanciated by ``get_serializer``. """
        return self.serializer_class

    # TODO: #genericapi
    def get_serializer(self, event, subscription, instance, **initkwargs):
        """
        Get serializer used to serialize instances that have been
        updated.
        """
        cls = self.get_serializer_class(instance)
        return cls(instance=instance, **initkwargs) if cls else None

    async def notify(self, event, subscription, instance):
        """ Send update event (= observation) to the client. """
        if not self.can_notify(event, subscription, instance):
            return

        method = event['method']
        if method == 'DELETE':
            data = {'pk': str(instance.pk)}
        else:
            serializer = self.get_serializer(event, subscription, instance)
            data = None if serializer is None else serializer.data

        if data:
            await self.send({
                'request_id': subscription.request_id,
                'status': 200,
                'method': event['method'],
                'data': data,
            })


    def can_notify(self, event, subscription, obj):
        """ Return True if instance update is notified to client. """
        return True

    async def instance_changed(self, event):
        """ Handle `instance.changed` event """
        try:
            instance = event['instance']
            subscription = self.subscriptions.get(event['key'])
            if subscription:
                await self.notify(event, subscription, instance)
        except Exception as e:
            from .debug import report_error
            report_error()

    async def websocket_disconnect(self, message):
        self.subscriptions.clear()

    @classmethod
    def connect_signals(cls):
        """
        Connect Pubsub class to observed model's change signals in
        order to notify subscriptions from changes.
        """
        # FIXME: put it into external class/whatever and use @partial shit
        #        to bind to correct subscription class?
        #        also, when can we connect signals? is there a django signal
        #        when app/models are ready?
        def emit_event(method, instance):
            keys = cls.get_instance_keys(instance)
            channel_layer = get_channel_layer()

            for key in keys:
                async_to_sync(channel_layer.group_send)(key, {
                    'type': 'instance.changed',
                    'instance': instance,
                    'method': method,
                    'key': key,
                })

        def instance_post_save(sender, instance, created, **kwargs):
            return emit_event('POST' if created else 'PUT', instance)

        def instance_post_delete(sender, instance, **kwargs):
            return emit_event('DELETE', instance)

        post_save.connect(instance_post_save, cls.model, False)
        post_delete.connect(instance_post_delete, cls.model, False)


