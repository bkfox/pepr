from django.db import models

from pepr.content.models import Service
from pepr.content.forms import ContentForm
from pepr.content.views import ContentFormComp
from pepr.ui.views import Slots, WidgetsComp

class Stream(Service):
    """
    Content stream service
    """
    template_name = 'pepr/bootstrap/stream.html'
    content_form = ContentForm
    slots = Slots({
        '': ''
    })

    def get_context_data(self):
        context = super().get_context_data()
        context['create_form'] = ContentFormComp(self.content_form,
            data = {'context': self.context_id }
        )
        return context

    def get_queryset(self):
        return super().get_queryset().filter(context_id = self.context_id)


