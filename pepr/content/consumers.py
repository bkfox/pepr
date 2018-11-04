
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Container, Content
from pepr.perms.consumers import ContextObserver


class ContainerObserver(ContextObserver, AsyncWebsocketConsumer):
    """
    Consumer class for container. This can be used to observe content
    edition.
    """
    context_class = Container
    model = Content

ContainerObserver.connect_signals()
