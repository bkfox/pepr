from .multiplex import MultiplexConsumer


api_urlpatterns = []
urlpatterns = []


class ApiMultiplex(MultiplexConsumer):
    """
    This multiplex consumer automatically register consumers for `ApiAppConfig`
    applications that have a `routing.api_multiplex` dict
    """
    ignore_prefix = '/api'



