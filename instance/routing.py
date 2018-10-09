from django.conf import settings

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter
from channels.security.websocket import OriginValidator

from pepr.consumers import PeprRouter

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
            PeprRouter
    ),
})

