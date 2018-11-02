from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .content.models import Container, Content, Service
from .content.views import \
        ServeServiceView, \
        ContainerSettingsView, \
        ContentViewSet


router = DefaultRouter()
router.register('content', ContentViewSet, base_name='content')


urlpatterns = [
    path('<uuid:pk>', ServeServiceView.as_view(),
         name='pepr.container'),
    path('<uuid:pk>/s/<slug:service_slug>', ServeServiceView.as_view(),
         name='pepr.service'),
    path('<uuid:pk>/settings', ContainerSettingsView.as_view(),
         name='pepr.container.settings'),
]


