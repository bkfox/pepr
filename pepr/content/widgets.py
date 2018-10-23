
from django.utils.translation import ugettext, ugettext_lazy as _

from pepr.ui.views import Widget, Position
from pepr.ui.widgets import ActionWidget


class ContainerServicesWidget(Widget):
    """
    This widget renders a list of link to the different services
    of a given container.
    """
    template_name = 'pepr/content/container_services_widget.html'

    def get_context_data(self, container, service=None, **kwargs):
        context = super().get_context_data()
        context['container'] = container
        context['service'] = service
        context['services'] = container.service_set
        return context


class DeleteActionWidget(ActionWidget):
    title = _('Delete')
    icon = 'fa-trash-alt fas'
    method = 'DELETE'

    required_perm = 'delete'

