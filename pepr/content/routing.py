from django.urls import path
from rest_framework.routers import DefaultRouter

from ..perms.views import SubscriptionViewSet
from .consumers import ContentPubsub
from .views import ContentViewSet
from .views import \
    ContainerServiceView, ContainerUpdateView, \
    SubscriptionsUpdateView


router = DefaultRouter()
router.register('content', ContentViewSet, base_name='content')
router.register('subscription', SubscriptionViewSet, basename='subscription')
api_urlpatterns = router.urls

urlpatterns = [
    path('<uuid:pk>', ContainerServiceView.as_view(),
         name='pepr.container'),
    path('<uuid:pk>/s/<slug:service_slug>', ContainerServiceView.as_view(),
         name='pepr.service'),
    path('<uuid:pk>/settings', ContainerUpdateView.as_view(),
         name='pepr.container.settings'),
    path('<uuid:pk>/subscriptions', SubscriptionsUpdateView.as_view(),
         name='pepr.container.subscriptions'),
]

api_multiplex = {
    '/content/pubsub': ContentPubsub,
}




