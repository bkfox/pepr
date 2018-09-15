from enum import Enum
from collections import namedtuple

from django.db.models.signals import post_save, post_delete
from django.dispatch import Signal

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from djangochannelsrestframework.decorators import action
from djangochannelsrestframework.consumers import AsyncAPIConsumer

from pepr.perms.models import Context


Subscription = namedtuple('Subscription', ['role','request_id'])


class ContextConsumer(AsyncAPIConsumer):
    """
    Consumer for publish-subscribe around a perms Context.
    """
    model = Context
    """ Context model """
    subscriptions = None
    """ Subscriptions as a dict of { UUID(context.pk): Subscription }. """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.subscriptions = {}

    @classmethod
    def get_group_name(cl, context_id):
        return 'pepr.context.{}'.format(context_id)

    @classmethod
    def get_context(cl, pk, user):
        """ Get context for the given pk (used by actions) """
        return cl.model.objects.select_subclasses() \
                       .filter(pk = pk).user(user).first()

    @action()
    def subscribe(self, pk, request_id, **kwargs):
        if pk in self.subscriptions:
            return {}, 403

        user = self.scope['user']
        context = self.get_context(pk, user)
        if context is None:
            return {}, 404

        self.subscriptions[context.pk] = Subscription(
            role = context.get_role(user),
            request_id = request_id,
        )
        async_to_sync(self.channel_layer.group_add)(
            self.get_group_name(pk), self.channel_name
        )
        return {}, 200

    @action()
    def unsubscribe(self, pk, **kwargs):
        if pk not in self.subscriptions:
            return { 'info': 'not subscribed' }, 200

        del self.subscription[pk]
        self.channel_layer.group_add(self.get_group_name(pk),
                                     self.channel_name)
        return {}, 200

    #
    # Group & Pubsub events
    #
    def serialize(self, subscription, instance):
        return {}

    def _check_access(func):
        async def wrapper(self, event):
            instance = event['instance']
            context = event['context']
            subscription = self.subscriptions.get(context.pk)
            if subscription is None or \
                    subscription.role.access < instance.access:
                return
            return await func(self, event, context, subscription)
        return wrapper

    @_check_access
    async def content_saved(self, event, context, subscription):
        action = 'create' if event['created'] else 'update'
        await self.reply(action,
            self.serialize(subscription, event['instance']),
            request_id = subscription.request_id,
        )

    @_check_access
    async def content_deleted(self, event, context, subscription):
        await self.reply('delete',
            { 'id': event['instance'].id },
            request_id = subscription.request_id,
        )

    @classmethod
    def connect_signals(cl, sender):
        def post_save_receiver(sender, instance, created, **kwargs):
            context = instance.related_context
            channel_layer = get_channel_layer()
            group_name = cl.get_group_name(context.pk)
            async_to_sync(channel_layer.group_send)(group_name, {
                'type': 'content.saved',
                'instance': instance,
                'context': context,
                'created': created,
            })

        post_save.connect(post_save_receiver, sender, False)

        def post_delete_receiver(sender, instance, created, **kwargs):
            context = instance.related_context
            channel_layer = get_channel_layer()
            group_name = cl.get_group_name(context.id)
            async_to_sync(channel_layer.group_send)(group_name, {
                'type': 'content.deleted',
                'instance': instance,
                'context': context,
            })

        post_delete.connect(post_delete_receiver, sender, False)



