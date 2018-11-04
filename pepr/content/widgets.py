
from django.utils.translation import ugettext, ugettext_lazy as _

from pepr.ui.views import Widget, Position
from pepr.ui.widgets import ActionWidget


class ContainerServicesWidget(Widget):
    """
    This widget renders a list of link to the different services
    of a given container.
    """
    template_name = 'pepr/content/container_services_widget.html'

    def get_context_data(self, service=None, **kwargs):
        kwargs.setdefault('container', self.context)
        kwargs.setdefault('service', service)
        kwargs.setdefault('services', self.context.service_set)
        return super().get_context_data(**kwargs)


class DeleteActionWidget(ActionWidget):
    title = _('Delete')
    icon = 'fa-trash-alt fas'
    method = 'DELETE'

    required_perm = 'delete'

