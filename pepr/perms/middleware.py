from django.db.models import Q
from django.core.exceptions import PermissionDenied

from .models import Context


__all__ = ['IdentityMiddleware']


class IdentityMiddleware:
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

