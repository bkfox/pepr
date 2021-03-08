from rest_framework.routers import DefaultRouter

from .viewsets import ContextViewSet, SubscriptionViewSet

router = DefaultRouter()
router.register('context', ContextViewSet, basename='context')
router.register('subscription', SubscriptionViewSet, basename='subscription')
api_urls = router.urls


