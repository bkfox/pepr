from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .content.models import Container, Content, Service
from .content.views import \
        ContainerServiceView, \
        ContainerUpdateView, \
        ContentViewSet


http_api_router = DefaultRouter()
http_api_router.register('content', ContentViewSet, base_name='content')

urlpatterns = [
    path('api/', include(http_api_router.urls), name='api'),
    path('<uuid:pk>', ContainerServiceView.as_view(),
         name='pepr.container'),
    path('<uuid:pk>/s/<slug:service_slug>', ContainerServiceView.as_view(),
         name='pepr.service'),
    path('<uuid:pk>/settings', ContainerUpdateView.as_view(),
         name='pepr.container.settings'),
]

