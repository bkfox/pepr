from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.mixins import (
    RetrieveModelMixin,
    UpdateModelMixin
)

from channelsmultiplexer import AsyncJsonWebsocketDemultiplexer

from pepr.content.models import Content
from pepr.content.serializers import ContentSerializer
from pepr.utils.functional import class_property
from pepr.utils.metaclass import RegisterMeta


class ContentConsumer( \
        RetrieveModelMixin, UpdateModelMixin, GenericAsyncAPIConsumer
        ):
    """
    Consumer base class for content objects.
    """
    model = Content
    serializer_class = ContentSerializer

    @class_property
    def stream_name(cl):
        return cl.model._meta.db_table

    def get_queryset(self, **kwargs):
        user = self.scope['user']
        return self.model.objects.for_user(user)


