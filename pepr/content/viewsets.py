""" Provide viewsets for the ``pepr_content`` application. """
from django.http import HttpResponse

from django_filters import rest_framework as filters_drf
from rest_framework import viewsets
from rest_framework.decorators import action

from pepr.core.viewsets import AccessibleViewSet

from .components import ContentFormComp
from .models import Content
from .serializers import ContentSerializer


__all__ = ('ContentViewSet', )


class ContentViewSet(AccessibleViewSet):
    """
    Model ViewSet for Content elements.
    """
    model = Content
    serializer_class = ContentSerializer
    form_comp = ContentFormComp()
    filter_backends = (filters_drf.DjangoFilterBackend,)
    filterset_fields = (
        'modified', 'created', 'context', 'modifier', 'owner', 'text'
    )
    queryset = Content.objects.select_subclasses()

    # FIXME
    @action(detail=True)
    def form(self, request, pk=None):
        """ Render an edit form for the given object """
        instance = self.get_object()
        role = instance.get_role(request.identity)
        content = self.form_comp.render(role, instance)
        return HttpResponse(content=content)

