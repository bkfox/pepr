from django.utils.translation import ugettext_lazy as _

from ..utils.functional import cached_result

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
    'ROLES': roles,
    'STATUS_INVITE': 1,
    'STATUS_REQUEST': 2,
    'STATUS_ACCEPTED': 3,
}
consts['STATUS_NAMES'] = {
        consts['STATUS_INVITE']: _('Invite'),
        consts['STATUS_REQUEST']: _('Request'),
        consts['STATUS_ACCEPTED']: _('Accepted'),
}


