from channels.routing import ProtocolTypeRouter
from channels.security.websocket import OriginValidator

from pepr.api.multiplex import MultiplexConsumer
from pepr.perms.consumers import IdentityMiddlewareStack


class PeprMultiplex(MultiplexConsumer):
    """ Instance's multiplexer """
    ignore_prefix = '/api'


application = ProtocolTypeRouter({
    'websocket': IdentityMiddlewareStack(PeprMultiplex),
})

