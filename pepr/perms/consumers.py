from collections import namedtuple

from django.db.models.signals import post_save, post_delete

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer

from pepr.api.mixins import ConsumerSetMixin, action
from pepr.api.observer import ObserverConsumer
from pepr.perms.models import Context


# TODO: has_perm / get_perm action (with/without model)
# TODO: update role (on Subscription/Authorization change)
# TODO: get_serializer => get role from subscription if any
class ContextObserver(ObserverConsumer):
    """
    Observer on accessibles (filtered by their context's id)
    """
    context_class = Context

    def get_serializer(self, instance, **initkwargs):
        if 'role' not in initkwargs:
            initkwargs['role'] = instance.related_context \
                                         .get_role(self.scope['user'])
        return super().get_serializer(instance, **initkwargs)

    async def get_observer_data(self, request, filter):
        context = self.context_class.objects.select_subclasses() \
                      .filter(pk=filter).first()
        if context is None:
            return None
        return {'role': context.get_role(request.user)}

    @classmethod
    def get_observer_filter(cls, instance):
        return str(instance.related_context.pk)

    async def propagate_observation(self, event, observer, instance):
        role = observer.data.get('role')
        if not role or role.access < instance.access:
            return
        await super().propagate_observation(event, observer, instance)
