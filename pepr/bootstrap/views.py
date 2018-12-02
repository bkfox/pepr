
from ..content.forms import ContentForm
from ..content.components import ContentFormComp
from ..content.views import ContentListView
# from ..ui.components import Slots, Widgets


# FIXME: using ListView
class StreamView(ContentListView):
    content_form = ContentForm
    template_name = 'pepr/bootstrap/stream.html'

    def get_context_data(self, **kwargs):
        if 'create_form' not in kwargs:
            kwargs['create_form'] = ContentFormComp(self.content_form)
        return super().get_context_data(**kwargs)
