from .multiplex import MultiplexConsumer


api_urlpatterns = []
urlpatterns = []


class ApiMultiplex(MultiplexConsumer):
    """
    This multiplex consumer automatically register consumers for `ApiAppConfig`
    applications that have a `routing.api_multiplex` dict
    """
    ignore_prefix = '/api'


def route_consumers(consumer_classes):
    """
    Add given consumers to the `MultiplexConsumer` class used as
    instance's multiplexer.
    :param {"consumer_path":Consumer} consumer_classes: consumer \
           classes to register.
    """
    ApiMultiplex.consumer_classes.update(consumer_classes)


