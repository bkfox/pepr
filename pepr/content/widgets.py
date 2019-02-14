
from django.utils.translation import ugettext, ugettext_lazy as _

from ..perms.permissions import CanDelete, CanUpdate
from ..ui.components import Widget, Position
from ..ui.widgets import ActionWidget


class ContainerServicesWidget(Widget):
    """
    This widget renders a list of link to the different services
    of a given container.
    """
    template_name = 'pepr/content/container_services_widget.html'

    def get_context_data(self, role, service=None, **kwargs):
        # TODO: filter services set
        kwargs.setdefault('service', service)
        kwargs.setdefault('services', role.context.service_set)
        return super().get_context_data(role=role, **kwargs)


class DeleteActionWidget(ActionWidget):
    text = _('Delete')
    icon = 'fa-trash-alt fas'
    permission_classes = (CanDelete,)

    url = '{object.api_detail_url}'
    method = 'DELETE'


class EditActionWidget(ActionWidget):
    text = _('Edit')
    icon = 'fa-edit fas'
    permission_classes = (CanUpdate,)

    action = 'submit'
    method = 'GET'
    target = 'modal'
    url = '{object.api_detail_url}edit_form/'


