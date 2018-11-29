
from django.views.generic.list import ListView

from pepr.content.forms import ContentForm
from pepr.content.models import Content
from pepr.content.components import ContentFormComp
from pepr.content.views import ServiceView
# from pepr.ui.components import Slots, Widgets


# FIXME: using ListView
class StreamView(ServiceView, ListView):
    model = Content
    content_form = ContentForm
    template_name = 'pepr/bootstrap/stream.html'

    def get_queryset(self):
        return super().get_queryset().select_subclasses() \
                      .context(self.context) \
                      .user(self.request.user)

    def get_context_data(self, **kwargs):
        if 'create_form' not in kwargs:
            kwargs['create_form'] = ContentFormComp(self.content_form)
        return super().get_context_data(**kwargs)

