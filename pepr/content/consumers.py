
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Container, Content
from pepr.perms.consumers import AccessibleObserver


class ContentObserver(AccessibleObserver, AsyncWebsocketConsumer):
    """
    Consumer class for container. This can be used to observe content
    edition.
    """
    context_class = Container
    model = Content

    def get_serializer(self, instance, **initkwargs):
        serializer_class = instance.get_serializer_class()
        return serializer_class(instance, current_user=self.scope['user'],
                                **initkwargs)


ContentObserver.connect_signals()
