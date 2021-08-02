from django.urls import path, include
from rest_framework.routers import DefaultRouter

from pepr.core import views as core_views
from . import models, views, viewsets

router = DefaultRouter()
router.register('content', viewsets.ContentViewSet, basename='content')
router.register('container', viewsets.ContainerViewSet, basename='container')
api_urls = router.urls


api_urls = router.urls

services_urls = [
    path('content-list/<uuid:service_pk>',
         views.ContentListView.as_view(), name='content-list'),
]


contextHomeView = core_views.ContextHomeView.as_view(
    context_model=models.Container)

urls = [
    path('<uuid:context_pk>/', contextHomeView, name='container-service'),
    path('/s/', include(services_urls)),
]


