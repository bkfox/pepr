from django.urls import path
from rest_framework.routers import DefaultRouter

from . import viewsets, views

router = DefaultRouter()
router.register('context', viewsets.ContextViewSet, basename='context')
router.register('subscription', viewsets.SubscriptionViewSet, basename='subscription')
api_urls = router.urls

urls = []


