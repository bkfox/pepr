from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .content.models import Container, Content, Service
from .content.views import ContainerView, ContentViewSet

router = DefaultRouter()
router.register('content', ContentViewSet, base_name='content')


urlpatterns = [
    path('<uuid:pk>', ContainerView.as_view(),
         name='pepr.container'),
    path('<uuid:pk>/<slug:service_slug>', ContainerView.as_view(),
         name='pepr.service'),
]


