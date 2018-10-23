from rest_framework.routers import DefaultRouter

from pepr.api import consumers as api
from pepr.urls import router
from pepr.content.consumers import ContainerObserver


ws_router = DefaultRouter()
ws_router.register('container', ContainerObserver, 'container')


class PeprRouter(api.RouterConsumer):
    """
    This router class is used by instance's root consumer for WebSockets
    routing.
    """
    pass

PeprRouter.register(ws_router.urls)
PeprRouter.register(router.urls)

