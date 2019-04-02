from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter
from channels.security.websocket import OriginValidator

from pepr.api.routing import ApiMultiplex


application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(ApiMultiplex),
})

