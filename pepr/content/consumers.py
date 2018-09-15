from enum import Enum
from collections import namedtuple

from djangochannelsrestframework.decorators import action
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.mixins import (
    RetrieveModelMixin,
    UpdateModelMixin
)

from pepr.content.models import Content, Container
from pepr.content.serializers import ContentSerializer
from pepr.perms.consumers import ContextConsumer
from pepr.utils.functional import class_property



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
        return self.model.objects.user(user)


class ContainerConsumer(ContextConsumer):
    model = Container

    # TODO: serializer


ContainerConsumer.connect_signals(Content)




