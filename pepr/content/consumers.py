from enum import Enum
from collections import namedtuple

from djangochannelsrestframework.decorators import action
from djangochannelsrestframework.generics import GenericAsyncAPIConsumer
from djangochannelsrestframework.mixins import (
    CreateModelMixin,
    ListModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin
)

from pepr.content.models import Content, Container
from pepr.content.serializers import ContentSerializer
from pepr.perms.models import Context
from pepr.perms.consumers import AccessibleConsumer
from pepr.utils.functional import class_property



class ContentConsumer( \
        RetrieveModelMixin, ListModelMixin,
        CreateModelMixin, UpdateModelMixin,
        AccessibleConsumer,
        GenericAsyncAPIConsumer
        ):
    """
    Consumer base class for content objects.
    """
    permission_classes = []
    context_class = Container
    model = Content
    serializer_class = ContentSerializer

    def get_serializer(self, *args, current_user=None, **kwargs):
        user = current_user or self.scope.get('user')
        return super().get_serializer(*args, current_user=user, **kwargs)

    @class_property
    def stream_name(cl):
        return cl.model._meta.db_table

    def get_queryset(self, **kwargs):
        user = self.scope['user']
        return self.model.objects.user(user)


ContentConsumer.connect_signals()

# ContainerConsumer.connect_signals(Content)




