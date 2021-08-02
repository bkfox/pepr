from django.views.generic import DetailView

from pepr.core.views.generic import AccessibleListView, ServiceMixin
from pepr.core.models import Subscription
from pepr.core.serializers import ContextSerializer, SubscriptionSerializer

from . import forms, models, serializers
from .components import ContentFormComp
from .forms import ContentForm


__all__ = ('ContentListView', 'ContentDetailView')


class ContentListView(ServiceMixin, AccessibleListView):
    """ Display a container's content list """
    model = models.Content
    context_model = models.Container
    service_class = models.ContentService
    create_form = forms.ContentForm

    def get_app_props(self, store=None, **kwargs):
        store = store or {}
        identity = self.role.identity
        if not 'context' in store:
            pks = {obj.context_id for obj in self.object_list}.union({
                   obj.owner_id for obj in self.object_list})
            pks.add(self.role.context.pk)
            if identity:
                pks.add(identity.pk)
            contexts = self.get_context_model().objects.identity(identity) \
                                               .filter(pk__in=pks)
            subscriptions = list(Subscription.objects.identity(identity) \
                                             .subscribed(self.role.context))
            store.update({
                'context': ContextSerializer(contexts, many=True,
                    identity=self.request.identity).data,
                'subscription': SubscriptionSerializer(subscriptions, many=True,
                    identity=self.request.identity).data,
            })
        return super().get_app_props(store=store, **kwargs)

    def get_context_data(self, create_form=None, **kwargs):
        if self.role.is_granted('create', self.model) and \
                'create_form' not in kwargs:
            kwargs['create_form'] = ContentFormComp(self.create_form)
        return super().get_context_data(**kwargs)

    def get_queryset(self):
        return super().get_queryset().select_subclasses()


class ContentDetailView(ServiceMixin, DetailView):
    """ Content detail view. """
    service_class = models.ContentService
    context_model = models.Container
    model = models.Content

    def get_queryset(self):
        return super().get_queryset().select_subclasses()


