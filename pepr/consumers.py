
from .api import consumers as api
from .content.consumers import ContainerObserver
from .urls import api_urls, consumers_urls


class PeprRouter(api.RouterConsumer):
    """
    This router class is used by instance's root consumer for WebSockets
    routing.
    """


PeprRouter.register(api_urls)
PeprRouter.register(consumers_urls)

