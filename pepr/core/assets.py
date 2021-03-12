from django.utils.translation import ugettext_lazy as _

from ..utils.functional import cached_result
from .models import Subscription

__all__ = ('consts', 'roles')


@cached_result
def roles():
    """ Return Roles as a serializable dictionary """
    from .settings import settings
    return {
        k: {'access': r.access, 'name': r.name, 'description': r.description}
        for k, r in settings.roles.items()
    }

consts = {
    'roles': roles(),
    'subscription': {
        'status': {
            'invite': Subscription.STATUS_INVITE, Subscription.STATUS_INVITE: _('Invite'),
            'request': Subscription.STATUS_REQUEST, Subscription.STATUS_REQUEST: _('Request'),
            'accepted': Subscription.STATUS_ACCEPTED, Subscription.STATUS_ACCEPTED: _('Accepted'),
        }
    }
}


