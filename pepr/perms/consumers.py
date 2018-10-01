from enum import Enum
from collections import namedtuple

from django.db.models.signals import post_save, post_delete
from django.dispatch import Signal

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from djangochannelsrestframework.decorators import action
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer

from pepr.perms.models import Context


Subscription = namedtuple('Subscription', ['role','request_id'])



class AccessibleConsumer(GenericAsyncAPIConsumer):
    context_class = Context
    subscriptions = None
    """ Subscriptions as a dict of { UUID(context.pk): PubSubscription } """

    # TODO: has_perm / get_perm action (with/without model)


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.subscriptions = {}

    @classmethod
    def get_group_name(cl, context_id):
        """ Return channels layer group name """
        return 'pepr.{}.{}'.format(cl.context_class._meta.db_table,
                                   context_id)

    @classmethod
    def get_context(cl, pk, user):
        """ Get context for the given pk (used by actions) """
        return cl.context_class.objects.select_subclasses() \
                               .filter(pk=pk).user(user).first()

    @action()
    def subscribe(self, pk, request_id, **kwargs):
        """ Action: subscribe to a specific Context """
        if pk in self.subscriptions:
            return {}, 403

        user = self.scope['user']
        context = self.get_context(pk, user)
        if context is None:
            return {}, 404

        self.subscriptions[context.pk] = Subscription(
            role=context.get_role(user),
            request_id=request_id,
        )
        async_to_sync(self.channel_layer.group_add)(
            self.get_group_name(pk), self.channel_name
        )
        return {'subscription': pk}, 200

    @action()
    def unsubscribe(self, pk, **kwargs):
        """ Action: unsubscribe from specific Context """
        if pk not in self.subscriptions:
            return {'info': 'not subscribed'}, 200

        del self.subscriptions[pk]
        self.channel_layer.group_discard(self.get_group_name(pk),
                                         self.channel_name)
        return {}, 200

    #
    # Group & Pubsub events
    #
    def signal_receiver(func):
        """ Handle instance access at channels layer events. """
        async def wrapper(self, event):
            instance = event['instance']
            key = instance.related_context.pk

            subscription = self.subscriptions.get(key)
            if subscription is None or \
                    subscription.role.access < instance.access:
                return
            return await func(self, event, subscription)
        return wrapper

    @signal_receiver
    async def instance_saved(self, event, subscription):
        """
        Channels layer: called when an instance of self's model is saved.
        """
        # FIXME/TODO if instance's context has changed, the old context
        #            should get a 'move' (in/out) or 'delete' notification
        action = 'create' if event['created'] else 'update'
        serializer = self.get_serializer(instance=event['instance'],
                                         action_kwargs={},
                                         current_user=self.scope['user'])

        await self.reply(
            action, serializer.data,
            request_id=subscription.request_id,
        )

    @signal_receiver
    async def instance_deleted(self, event, subscription):
        """
        Channels layer: called when an instance of self's model is deleted.
        """
        await self.reply(
            'delete', {'pk': event['instance'].pk},
            request_id=subscription.request_id,
        )

    @classmethod
    def connect_signals(cl, sender=None):
        """
        Setup different receiver on model signals in order to correctly
        handle pubsub and subscription management. This method should be
        call once per subclass.
        """
        if sender is None:
            sender = cl.model

        def content_post_save(sender, instance, created, **kwargs):
            context = instance.related_context
            channel_layer = get_channel_layer()
            group_name = cl.get_group_name(context.pk)
            async_to_sync(channel_layer.group_send)(group_name, {
                'type': 'instance.saved',
                'instance': instance,
                'created': created,
            })

        post_save.connect(content_post_save, sender, False)

        def content_post_delete(sender, instance, **kwargs):
            context = instance.related_context
            channel_layer = get_channel_layer()
            group_name = cl.get_group_name(context.id)
            async_to_sync(channel_layer.group_send)(group_name, {
                'type': 'instance.deleted',
                'instance': instance,
            })

        post_delete.connect(content_post_delete, sender, False)

        # TODO: role saving => update related subscriptions
        # TODO: - Subscription & Authorization saved => update related
        #         subscription



