from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .content.models import Container, Content, Service
from .content.views import BaseDetailView, ContainerDetailView, \
    ServiceDetailView, \
    ContentViewSet


router = DefaultRouter()
router.register('content', ContentViewSet, base_name='content')


urlpatterns = [
    path('<uuid:pk>', ContainerDetailView.as_view(),
         name='pepr.container'),
    path('s/<uuid:pk>', ServiceDetailView.as_view()),
    path('c/<uuid:pk>', BaseDetailView.as_view(model=Content),
         name='pepr.content'),
]


