from django.http import Http404
from django.views.generic import DetailView, ListView

from pepr.core.mixins import ServiceMixin
from pepr.core.models import Subscription
from pepr.core.serializers import ContextSerializer, SubscriptionSerializer

from .components import ContentFormComp
from .forms import ContentForm
from .models import Content, ContentService


__all__ = ('ServiceMixin', 'ContentListView')


class ContentListView(ServiceMixin, ListView):
    model = Content
    # TODO: pepr/content to pepr_content/
    service_class = ContentService
    create_form = ContentForm

    def get_app_data(self, store=None, **kwargs):
        store = store or {}
        identity = self.role.identity
        if not 'contexts' in store:
            pks = {obj.context_id for obj in self.object_list}.union({
                   obj.owner_id for obj in self.object_list})
            pks.add(self.role.context.pk)
            if identity:
                pks.add(identity.pk)
            contexts = self.get_context_model().objects.identity(identity) \
                                               .filter(pk__in=pks)
            subscriptions = Subscription.objects.identity(identity) \
                                        .subscribed(self.role.context)
            store.update({
                'contexts': ContextSerializer(contexts, many=True,
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


class ContentDetailView(ServiceMixin, DetailView):
    service_class = ContentService
    model = Content

    def get_queryset(self):
        return super().get_queryset().select_subclasses()

