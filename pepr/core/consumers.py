from channels.auth import AuthMiddlewareStack
from channels.middleware import BaseMiddleware

from .models import Context

__all__ = ('IdentityMiddleware', 'IdentityMiddleware')


# TODO: setter on scope.user in order to keep track of user change?
# TODO: keep track of user's identities & subscriptions changes?
# TODO: request.identity

class IdentityMiddleware(BaseMiddleware):
    """ Fetch user's identity and set it into consumer scope. """
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

