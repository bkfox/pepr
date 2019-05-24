from asgiref.sync import async_to_sync
from channels.auth import AuthMiddlewareStack
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from channels.middleware import BaseMiddleware

from ..api.pubsub import PubsubConsumer
from .mixins import PermissionMixin
from .models import Context
from .permissions import CanAccess


__all__ = ['IdentityMiddleware', 'IdentityMiddleware', 'AccessiblePubsub']


# TODO: setter on scope.user in order to keep track of user change?
# TODO: keep track of user's identities & subscriptions changes?
# TODO: request.identity


class IdentityMiddleware(BaseMiddleware):
    """
    Fetch user's identity and set it into the scope's request.
    """
    def __init__(self, inner, context_class=Context):
        super().__init__(inner)
        self.context_class = context_class

    def populate_scope(self, scope):
        scope['identity'], scope['identities'] = None, None

    async def resolve_scope(self, scope):
        if 'user' not in scope:
            raise ValueError(
                'Scope misses "user", you must wrap this middleware into '
                '`channels.auth.AuthMiddlewareStack` or other middleware '
                'providing user authentication and cookies.'
            )
        pk = scope['cookies'] and scope['cookies'].get('pepr.perms.identity')
        identity, identities = self.context_class.objects.get_identities(
            scope['user'], pk
        )
        scope['identity'] = identity
        scope['identities'] = identities


def IdentityMiddlewareStack(inner, **kwargs):
    return AuthMiddlewareStack(IdentityMiddleware(inner, **kwargs))


class AccessiblePubsub(PermissionMixin, PubsubConsumer):
    permission_classes = (CanAccess,)
    context_class = Context
    matches = {
        'context': lambda cls, obj: obj.get_context().pk,
    }

    def get_context_queryset(self, request, match):
        return self.context_class.objects.select_subclasses()

    def get_context(self, request, match):
        qs = self.get_context_queryset(request, match)
        if match.filter == 'context':
            return qs.get(pk=match.lookup)

    async def get_subscription_data(self, request, match, **kwargs):
        context = self.get_context(request, match)
        if context is None:
            return None

        if 'role' not in kwargs:
            kwargs['role'] = context.get_role(self.scope['identity'])
        return await super().get_subscription_data(request, match, **kwargs)

    def get_serializer(self, event, subscription, instance, **initkwargs):
        initkwargs['role'] = subscription.data['role']
        return super().get_serializer(event, subscription, instance,
                                      **initkwargs)

    def can_notify(self, event, subscription, obj):
        # only notify if user can read object.
        return self.can_obj(subscription.data['role'], obj, 'GET')


