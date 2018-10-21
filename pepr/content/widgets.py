
from pepr.ui.views import WidgetComp, Position

from .models import Service

class ContainerServicesWidget(WidgetComp):
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

