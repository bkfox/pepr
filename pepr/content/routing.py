from django.urls import path
from rest_framework.routers import DefaultRouter

from ..perms.views import SubscriptionViewSet
from .consumers import ContentPubsub
from .views import ContentViewSet, ContainerViewSet
from .views import \
    ServiceDetailView, ContainerUpdateView, \
    SubscriptionsUpdateView


router = DefaultRouter()
router.register('content', ContentViewSet, base_name='content')
router.register('container', ContainerViewSet, base_name='container')
router.register('subscription', SubscriptionViewSet, basename='subscription')
api_urlpatterns = router.urls


urlpatterns = [
    path('<uuid:pk>', ServiceDetailView.as_view(),
         name='pepr.container'),
    path('<uuid:pk>/s/<slug:service_slug>', ServiceDetailView.as_view(),
         name='pepr.service'),
    path('<uuid:pk>/settings', ContainerUpdateView.as_view(),
         name='pepr.container.settings'),
    path('<uuid:pk>/subscriptions', SubscriptionsUpdateView.as_view(),
         name='pepr.container.subscriptions'),
]

api_multiplex = {
    '/content/pubsub': ContentPubsub,
}




