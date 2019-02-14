from django.urls import path

from rest_framework.routers import DefaultRouter

from .views import SubscriptionViewSet

router = DefaultRouter()
router.register(r'subscription', SubscriptionViewSet, basename='subscription')

api_urls = router.urls


