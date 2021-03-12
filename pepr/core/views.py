import json

from django import views
from django.http import HttpResponse
from django.core.serializers.json import DjangoJSONEncoder


class ConstsView(views.View):
    """ Return consts as JSON serialized. """
    consts = {}

    def get(self, request, *args, **extra_consts):
        consts = dict(self.consts)
        consts.update(extra_consts)
        return HttpResponse(json.dumps(consts, cls=DjangoJSONEncoder))


