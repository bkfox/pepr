from channelsmultiplexer import AsyncJsonWebsocketDemultiplexer

from pepr.content.consumers import ContentConsumer, ContainerConsumer

class MultiplexedConsumers(AsyncJsonWebsocketDemultiplexer):
    applications = {
        'pepr_content': ContentConsumer,
        'pepr_container': ContainerConsumer,
    }

