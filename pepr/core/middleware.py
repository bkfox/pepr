from .models import Context


__all__ = ('IdentityMiddleware',)


class IdentityMiddleware:
    """
    Provides identities for request's user.

    Current identity id can be specified with ``pepr.perms.identity``
    cookie.

    Request will have two extra attributes:
    - ``identity``: current identity
    - ``identities``: queryset of all available identities for user.
    """
    context_class = Context

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not hasattr(request, 'user'):
            raise RuntimeError(
                "This middleware requires Django's AuthenticationMiddleware "
                "to be called before this one.")

        identity, identities = self.context_class.objects.get_identities(
            request.user, request.COOKIES.get('pepr.perms.identity')
        )
        if identity:
            identity.identity_user = request.user

        request.identity, request.identities = identity, identities
        return self.get_response(request)

