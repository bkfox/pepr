
from django.utils.translation import ugettext, ugettext_lazy as _

from ..perms.permissions import CanDestroy, CanUpdate
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
    tag_attrs = {
        'action': 'destroy',
        'api_action': 'destroy',
        'method': 'DELETE',
        ':item': 'item',
        'ask': _('Do you really want to delete this element?'),
    }
    tag_attrs.update(ActionWidget.tag_attrs)
    tag_attrs['class'] = tag_attrs['class'] + ' btn-danger'


class EditActionWidget(ActionWidget):
    text = _('Edit')
    icon = 'fa-edit fas'
    tag_attrs = {
        'action': 'form',
        'api_action': 'update',
        'method': 'GET',
        'handler': 'modal',
        ':item': 'item',
    }
    tag_attrs.update(ActionWidget.tag_attrs)

