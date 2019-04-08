from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
# from restframework.consumers import Consumer

from ..api.pubsub import PubsubConsumer
from ..perms.models import Context
from .mixins import PermissionMixin
from .permissions import CanAccess


class AccessiblePubsub(PermissionMixin, PubsubConsumer):
    permission_classes = (CanAccess,)
    context_class = Context
    matches = {
        'context': lambda cls, obj: obj.get_context().pk,
    }

    def get_context_queryset(self, request, match):
        return self.context_class.objects.select_subclasses()

    def get_context(self, request, match):
        qs = self.get_context_queryset(request, match)
        if match.filter == 'context':
            return qs.get(pk=match.lookup)

    async def get_subscription_data(self, request, match, **kwargs):
        context = self.get_context(request, match)
        if context is None:
            return None

        if 'role' not in kwargs:
            kwargs['role'] = context.get_role(request.user)
        return await super().get_subscription_data(request, match, **kwargs)

    def get_serializer(self, event, subscription, instance, **initkwargs):
        initkwargs['role'] = subscription.data['role']
        return super().get_serializer(event, subscription, instance,
                                      **initkwargs)

    def can_notify(self, event, subscription, obj):
        # only notify if user can read object.
        return self.can_obj(subscription.data['role'], obj, 'GET')


