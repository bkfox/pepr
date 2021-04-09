import json

from django import views
from django.views.generic import DetailView
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder

from .mixins import ViewMixin


class ConstsView(views.View):
    """ Return consts as JSON serialized. """
    consts = {}

    def get(self, request, *args, **extra_consts):
        consts = dict(self.consts)
        consts.update(extra_consts)
        return HttpResponse(json.dumps(consts, cls=DjangoJSONEncoder))


class ContextSettingsView(ViewMixin, DetailView):
    template_name = 'pepr_core/context_settings.html'

    def get_object(self):
        return self.role.context

    def dispatch(self, request, *args, pk=None, **kwargs):
        kwargs.setdefault('context_pk', pk)
        return super().dispatch(request, *args, **kwargs)

