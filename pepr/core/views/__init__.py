import json

from django import views
from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse, Http404
from django.urls import resolve, reverse

from .. import models
from ..settings import settings
from . import generics

__all__ = ('ConstsView', 'ContextServiceView',)


# TODO/FIXME: remove
class ConstsView(views.View):
    """ Return consts as JSON serialized. """
    consts = {}

    def get(self, request, *args, **extra_consts):
        consts = dict(self.consts)
        consts.update(extra_consts)
        return HttpResponse(json.dumps(consts, cls=DjangoJSONEncoder))


class BaseContextHomeView(views.View):
    """ Render view for a Context's service. """
    model = models.Service

    def dispatch(self, request, service, *args, **kwargs):
        url = reverse(service.url_name, kwargs={'service_pk': service.pk})
        match = resolve(url)
        kwargs = dict(match.kwargs)
        # service is fetched again in order to ensure having its real
        # subtype.
        # We can't directly pass context and service, because their
        # subclasses might be used.
        kwargs['context'] = None
        kwargs.update({ 'service_pk': service.pk })
        return match.func(request, *args, **kwargs)


class ContextHomeView(generics.ServiceMixin, generics.ApplicationMixin, BaseContextHomeView):
    """
    Display a context's service based on its pk or slug, handles calling
    the correct view.
    """

