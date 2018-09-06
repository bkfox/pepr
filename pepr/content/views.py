from django.db.models import Prefetch
from django.views.generic.base import View
from django.views.generic.detail import DetailView
from django.http import HttpResponse

from pepr.content.models import Container, Content, Service
from pepr.perms.views import AccessibleMixin
from pepr.ui.views import Slots, WidgetsView


class SiteView(View):
    """ Base view for the website """
    slots = Slots({
        'top': WidgetsView('nav'),
        'footer': WidgetsView('footer'),
    })

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context['slots'] = self.slots
        return context


class ContainerDetailView(SiteView,AccessibleMixin,DetailView):
    template_name = 'pepr/content/container.html'

    def get_container(self):
        return Container.objects.select_subclasses() \
                        .get(id = self.object.context_id)

    def get_queryset(self):
        # FIXME: prefetch context select_subclasses()
        return super().get_queryset().select_subclasses()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if isinstance(self.object, Container):
            container = self.object

            # override default object in order to reuse the same template
            context['object'] = Service.objects.filter(
                context = container, is_enabled = True,
            ).order_by('-is_default')
        else:
            container = self.get_container()

        context['container'] = container
        return context

