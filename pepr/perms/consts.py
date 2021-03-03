from django.utils.translation import ugettext_lazy as _

__all__ = ['STATUS_INVITE', 'STATUS_REQUEST', 'STATUS_ACCEPTED',
           'STATUS_NAMES', 'ROLES']

STATUS_INVITE = 1
STATUS_REQUEST = 2
STATUS_ACCEPTED = 3

STATUS_NAMES = {
    STATUS_INVITE: _('Invite'),
    STATUS_REQUEST: _('Request'),
    STATUS_ACCEPTED: _('Accepted'),
}


def ROLES():
    """ Return Roles as a serializable dictionary """
    from .settings import settings
    return {
        k: {'access': r.access, 'name': r.name, 'description': r.description}
        for k, r in settings.roles.items()
    }


