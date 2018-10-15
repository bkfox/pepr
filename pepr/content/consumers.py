
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Container, Content
from pepr.perms.consumers import ContextObserver


# TODO: has_perm / get_perm action (with/without model)
class ContainerConsumer(ContextObserver, AsyncWebsocketConsumer):
    context_class = Container
    model = Content

    def get_serializer(self, instance, **initkwargs):
        serializer_class = instance.get_serializer_class()
        return serializer_class(instance, current_user=self.scope['user'],
                                **initkwargs)


# ContentConsumer.connect_signals()
ContainerConsumer.connect_signals()




