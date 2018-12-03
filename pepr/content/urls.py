from django.urls import path

from rest_framework.routers import DefaultRouter

from .consumers import ContainerObserver
from .views import \
    ContainerServiceView, ContainerUpdateView, \
    SubscriptionsUpdateView, \
    ContentViewSet


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


consumers_urls = \
    ContainerObserver.get_urls('container/<uuid:pk>/', 'api-container')


router = DefaultRouter()
router.register('content', ContentViewSet, base_name='content')

api_urls = router.urls


