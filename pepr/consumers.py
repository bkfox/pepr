
from .api import consumers as api
from .urls import api_urls, consumers_urls


class PeprRouter(api.RouterConsumer):
    """
    This router class is used by instance's root consumer for WebSockets
    routing.
    """


# TODO: 'api/' url prefix
PeprRouter.register(api_urls)
PeprRouter.register(consumers_urls)

