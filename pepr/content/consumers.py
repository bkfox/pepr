from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Container, Content
from ..perms.consumers import AccessiblePubsub


class ContentPubsub(AccessiblePubsub, AsyncWebsocketConsumer):
    """
    Consumer class for container. This can be used to observe content
    edition.
    """
    context_class = Container
    model = Content

    def get_serializer_class(self, instance):
        return instance.get_serializer_class()


ContentPubsub.connect_signals()
