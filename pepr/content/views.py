from django.http import Http404
from django.shortcuts import render
from django.views.generic import DetailView, ListView

from ..core.mixins import BaseViewMixin, PermissionViewMixin
from .components import ContentFormComp
from .forms import ContentForm
from .models import Container, Content, StreamService


class BaseServiceMixin(BaseViewMixin, PermissionViewMixin):
    service_class = None
    """ Service model class to be retrieved if not None. """
    service = None
    """ Service instance found. """
    context_class = Container

    def get_service_queryset(self):
        return self.service_class.objects.access(self.role.access) \
                                         .context(self.role.context) \
                                         .filter(enabled=True)

    def get_service(self):
        return self.get_service_queryset().first() if self.service_class else \
                None

    def get_context_data(self, **kwargs):
        self.service = kwargs.pop('service', None) or self.get_service()
        if self.service is None:
            raise Http404('Service not found')
        return super().get_context_data(service=self.service, **kwargs)


class StreamServiceView(BaseServiceMixin, ListView):
    model = Content
    template_name = 'pepr/content/stream_list.html'
    service_class = StreamService
    create_form = ContentForm

    class Assets:
        css = ['pepr/content.css']
        js = ['pepr/content.js']

    def get_context_data(self, create_form=None, **kwargs):
        if self.role.is_granted('create', self.model) and \
                'create_form' not in kwargs:
            kwargs['create_form'] = ContentFormComp(self.create_form)
        return super().get_context_data(**kwargs)

    def get_queryset(self):
        return super().get_queryset().select_subclasses()


class StreamServiceDetailView(BaseServiceMixin, DetailView):
    template_name = 'pepr/content/stream_detail.html'
    service_class = StreamService
    model = Content

    def get_queryset(self):
        return super().get_queryset().select_subclasses()


