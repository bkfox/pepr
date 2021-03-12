from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views, viewsets

router = DefaultRouter()
router.register('content', viewsets.ContentViewSet, basename='content')

api_urls = router.urls

services_urls = [
    path('', views.ContentListView.as_view(), name='content-list'),
]

urls = [
    path('<uuid:context_pk>/', include(services_urls)),
]



