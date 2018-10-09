from django.urls import path, include

from rest_framework.routers import DefaultRouter

from pepr.content.models import Container, Content, Service
from pepr.content.views import BaseDetailView, ContainerDetailView, \
    ContentViewSet


router = DefaultRouter()
router.register('content', ContentViewSet, base_name='content')




urlpatterns = [
    path('<uuid:pk>', ContainerDetailView.as_view(model=Container),
         name='pepr.container'),
    path('c/<uuid:pk>', BaseDetailView.as_view(model=Content),
         name='pepr.content'),
    path('api', include(router.urls)),
]


