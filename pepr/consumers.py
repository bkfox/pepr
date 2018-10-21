from rest_framework.routers import DefaultRouter

from pepr.api import consumers as api
from pepr.urls import router
from pepr.content.consumers import ContentObserver


ws_router = DefaultRouter()
ws_router.register('content', ContentObserver, 'content')


class PeprRouter(api.RouterConsumer):
    pass

PeprRouter.register(ws_router.urls)
PeprRouter.register(router.urls)

