from django.http import Http404
from django.shortcuts import render
from django.views.generic import DetailView, ListView

from ..core.mixins import BaseViewMixin, ViewMixin
from ..core.models import Subscription
from ..core.serializers import SubscriptionSerializer
from .components import ContentFormComp
from .forms import ContentForm
from .models import Container, Content, StreamService
from .serializers import ContainerSerializer


__all__ = ('BaseServiceMixin', 'ContentListView')


class BaseServiceMixin(ViewMixin):
    service_class = None
    """ Service model class to be retrieved if not None. """
    service = None
    """ Service instance found. """
    context_model = Container

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


class ContentListView(BaseServiceMixin, ListView):
    model = Content
    # TODO: pepr/content to pepr_content/
    template_name = 'pepr/content/content_list'
    service_class = StreamService
    create_form = ContentForm

    def get_app_data(self, store=None, **kwargs):
        store = store or {}
        identity = self.role.identity
        if not 'contexts' in store:
            pks = {obj.context_id for obj in self.object_list}.union({identity.pk})
            contexts = self.get_context_model().objects.identity(identity) \
                                               .filter(pk__in=pks)
            subscriptions = Subscription.objects.identity(identity) \
                                        .subscribed(self.role.context)
            store.update({
                'contexts': ContainerSerializer(contexts, many=True,
                    identity=self.request.identity).data,
                'subscriptions': SubscriptionSerializer(subscriptions, many=True,
                    identity=self.request.identity).data,
            })
        return super().get_app_data(store=store, **kwargs)

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


