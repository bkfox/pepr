from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter
from channels.security.websocket import OriginValidator

from pepr.api.multiplex import MultiplexConsumer


class PeprMultiplex(MultiplexConsumer):
    """ Instance's multiplexer """
    ignore_prefix = '/api'


application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(PeprMultiplex),
})

