"""pepr URL Configuration
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

import pepr.urls

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('api/', include(pepr.urls.router.urls), name='api')
] + pepr.urls.get_urlpatterns()


if settings.DEBUG:
    urlpatterns += \
        static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) +\
        static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

