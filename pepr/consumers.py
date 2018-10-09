from pepr.api import consumers as api
from pepr.urls import router


class PeprRouter(api.RouterConsumer):
    pass


PeprRouter.register(router.urls)
