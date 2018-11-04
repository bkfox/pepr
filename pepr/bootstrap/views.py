
from django.views.generic.list import ListView

from pepr.content.forms import ContentForm
from pepr.content.models import Content
from pepr.content.components import ContentFormComp
from pepr.content.views import ServiceView
# from pepr.ui.views import Slots, Widgets


# FIXME: using ListView
class StreamView(ServiceView, ListView):
    model = Content
    content_form = ContentForm
    template_name = 'pepr/bootstrap/stream.html'

    def get_queryset(self):
        return super().get_queryset().select_subclasses() \
                      .context(self.role.context) \
                      .user(self.request.user)

    def get_context_data(self):
        context = super().get_context_data()
        context['create_form'] = ContentFormComp(self.content_form, self.role.context)
        return context

