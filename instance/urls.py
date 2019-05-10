"""pepr URL Configuration
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

from pepr.api.loader import Loader
from pepr.api.views import ApiConstsView

from .routing import PeprMultiplex

loader = Loader(True, multiplex_class=PeprMultiplex, api_url_prefix='/api')

urlpatterns = loader.urls + [
    path('admin/', admin.site.urls),
    path('api/consts', ApiConstsView.as_view(loader=loader), name='api-consts')
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


