from django.urls import path
from django.contrib.auth import views as auth_views
from rest_framework.routers import DefaultRouter

from . import viewsets, views

router = DefaultRouter()
router.register('context', viewsets.ContextViewSet, basename='context')
router.register('subscription', viewsets.SubscriptionViewSet, basename='subscription')
api_urls = router.urls

urls = [
    path('user/login', auth_views.LoginView.as_view(template_name='pepr_core/auth/login.html'),
         name='login'),
    path('user/logout', auth_views.LogoutView.as_view(), name='logout'),
    path('user/password-reset', auth_views.PasswordResetView.as_view(
         template_name='pepr_core/auth/password_reset_done.html'),
         name='password_reset'),
    path('user/password-reset-done', auth_views.PasswordResetDoneView.as_view(
         template_name='pepr_core/auth/password_reset_done.html'),
         name='password_reset_done'),
]


