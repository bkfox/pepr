from channels.routing import ProtocolTypeRouter
from channels.auth import AuthMiddlewareStack

from pepr.consumers import MultiplexedConsumers

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(MultiplexedConsumers),
})

