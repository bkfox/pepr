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
]


if settings.DEBUG:
    urlpatterns += \
        static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) +\
        static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

    try:
        from rest_framework_swagger.views import get_swagger_view
        schema_view = get_swagger_view(title='Pastebin API')
        urlpatterns += [
            path(r'api/schema', schema_view)
        ]
    except ImportError:
        pass

urlpatterns +=  pepr.urls.get_urlpatterns()

