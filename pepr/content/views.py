from django.db.models import Prefetch
from django.forms import HiddenInput, models as model_forms
from django.views.generic.base import View
from django.views.generic.detail import DetailView
from django.http import HttpResponse

from pepr.content.models import Container, Content, Service
from pepr.perms.views import AccessibleMixin
from pepr.ui.views import ComponentMixin, Slots, WidgetsComp


class SiteView(View):
    """
    Base view for rendering the website. This can be inherited by other
    views in order to have common widget slots among other things.
    """
    slots = Slots({
        'top': WidgetsComp('nav'),
        'footer': WidgetsComp('footer'),
    })
    can_standalone = True

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context['slots'] = self.slots

        if self.can_standalone and 'standalone' in self.request.GET:
            context['standalone'] = True
        return context


class BaseDetailView(SiteView,AccessibleMixin,DetailView):
    """
    Base class for ContainerItem elements.
    """
    template_name = 'pepr/content/container.html'

    def get_container(self):
        return Container.objects.select_subclasses() \
                        .get(id = self.object.context_id)

    def get_queryset(self):
        # FIXME: prefetch context select_subclasses()
        return super().get_queryset().select_subclasses()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['container'] = self.get_container()
        return context


class ContainerDetailView(BaseDetailView):
    """
    Detail view for container
    """
    template_name = 'pepr/content/container.html'

    def get_container(self):
        return self.object

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['object'] = Service.objects.filter(
            context = self.object, is_enabled = True,
        ).select_subclasses().order_by('-is_default').first()
        return context


class ServiceDetailView(BaseDetailView):
    def get_queryset(self):
        return super().get_queryset().filter(is_enabled=True)



class ContentFormComp(ComponentMixin):
    """
    Simple wrapper component over a form
    Provide a view that can be used to render form of Content.
    It uses its Serializer in order to retrieve the fields list
    to display.
    """
    slots = Slots({
    })

    form_class = None
    """ used form class """
    context_id = None
    """ context to post content on """
    form_kwargs = None
    """ form init kwargs """
    template_name = 'pepr/content/content_form.html'

    def get_form_class(self):
        return self.form_class

    def get_form_kwargs(self):
        kwargs = self.form_kwargs
        return kwargs

    def get_form(self):
        form_class = self.get_form_class()
        form = form_class(**self.get_form_kwargs())
        self.prepare_form(form)
        return form

    def prepare_form(self, form):
        pass

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = self.get_form()
        return context

    def __init__(self, form_class, template_name = template_name, **form_kwargs
        ):
        self.form_class = form_class
        self.template_name = template_name
        self.form_kwargs = form_kwargs


