from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views, viewsets

router = DefaultRouter()
router.register('content', viewsets.ContentViewSet, basename='content')

api_urls = router.urls

services_urls = [
    path('stream', views.StreamServiceView.as_view()),
]

urls = [
    path('<uuid:context_pk>/', include(services_urls)),
]



