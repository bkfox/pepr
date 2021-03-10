""" Provide viewsets for the ``pepr_content`` application. """
from django.http import HttpResponse

from django_filters import rest_framework as filters_drf
from rest_framework import viewsets
from rest_framework.decorators import action

from ..core.viewsets import AccessibleViewSet, ContextViewSet

from .components import ContentFormComp
from .models import Container, Content
from .serializers import ContentSerializer, ContainerSerializer


__all__ = ('ContentViewSet', )


class ContainerViewSet(ContextViewSet):
    model = Container
    serializer_class = ContainerSerializer


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

    @classmethod
    def register_to(cls, router):
        """
        Register this viewset to the given router; it should be used in
        order to provide consistent interfaces and urls using model's
        informations (``Content.url_basename`` and ``Content.url_prefix```)
        """
        return router.register(cls.model.url_prefix, cls,
                               cls.model.url_basename)

    @action(detail=True)
    def form(self, request, pk=None):
        """ Render an edit form for the given object """
        instance = self.get_object()
        role = instance.get_role(request.identity)
        content = self.form_comp.render(role, instance)
        return HttpResponse(content=content)


# class ContainerViewSet(ContextViewSet):
#    model = Container
#    serializer_class = ContainerSerializer


