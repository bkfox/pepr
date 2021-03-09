from rest_framework.routers import DefaultRouter

from .viewsets import SubscriptionViewSet

router = DefaultRouter()
router.register('subscription', SubscriptionViewSet, basename='subscription')
api_urls = router.urls


