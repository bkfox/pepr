
from .api import consumers as api
from .content.consumers import ContainerObserver
from .urls import http_api_router


class PeprRouter(api.RouterConsumer):
    """
    This router class is used by instance's root consumer for WebSockets
    routing.
    """


PeprRouter.register(
    ContainerObserver.get_urls('container/<uuid:pk>/', 'api-container'),
)

PeprRouter.register(http_api_router.urls)

