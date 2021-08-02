""" Provide viewsets for the ``pepr_content`` application. """
from django.http import HttpResponse

from django_filters import rest_framework as filters_drf
from rest_framework import viewsets
from rest_framework.decorators import action

from pepr.core import viewsets as core

from . import models, serializers
from .components import ContentFormComp


__all__ = ('ContentViewSet', )


class ContainerViewSet(core.ContextViewSet):
    """ Viewset for Container """
    model = models.Container
    serializer_class = serializers.ContainerSerializer


class ContentViewSet(core.AccessibleViewSet):
    """ ViewSet for Content. """
    model = models.Content
    serializer_class = serializers.ContentSerializer
    form_comp = ContentFormComp()
    filter_backends = (filters_drf.DjangoFilterBackend,)
    filterset_fields = (
        'modified', 'created', 'context', 'modifier', 'owner', 'text'
    )
    queryset = models.Content.objects.select_subclasses()

    # FIXME
    @action(detail=True)
    def form(self, request, pk=None):
        """ Render an edit form for the given object """
        instance = self.get_object()
        role = instance.get_role(request.identity)
        content = self.form_comp.render(role, instance)
        return HttpResponse(content=content)

