from channelsmultiplexer import AsyncJsonWebsocketDemultiplexer

from pepr.content.consumers import ContentConsumer

class MultiplexedConsumers(AsyncJsonWebsocketDemultiplexer):
    applications = {
        'content': ContentConsumer,
    }

