from django.urls import path
from rest_framework.routers import DefaultRouter

from ..perms.viewsets import SubscriptionViewSet
from .consumers import ContentPubsub
from .views import \
    service_view, ContainerUpdateView, \
    ContainerCreateAnyView, \
    SubscriptionsUpdateView
from .viewsets import ContentViewSet, ContainerViewSet


router = DefaultRouter()
router.register('content', ContentViewSet, base_name='content')
router.register('container', ContainerViewSet, base_name='container')
router.register('subscription', SubscriptionViewSet, basename='subscription')
api_urlpatterns = router.urls


urlpatterns = [
    path('container/create-any', ContainerCreateAnyView.as_view(),
         name='pepr.container.create_any'),
    path('<uuid:pk>', service_view(),
         name='pepr.container'),
    path('<uuid:pk>/settings', ContainerUpdateView.as_view(),
         name='pepr.container.settings'),
    path('<uuid:pk>/subscriptions', service_view(SubscriptionsUpdateView),
         name='pepr.container.subscriptions'),
    path('<uuid:pk>/s/<slug:service_slug>', service_view(),
         name='pepr.service'),
]

api_multiplex = {
    '/content/pubsub': ContentPubsub,
}




