from rest_framework.routers import DefaultRouter

from . import viewsets

router = DefaultRouter()
router.register('context', viewsets.ContextViewSet, basename='context')
router.register('subscription', viewsets.SubscriptionViewSet, basename='subscription')
api_urls = router.urls


