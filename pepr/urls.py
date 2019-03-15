from django.urls import path, include

from .perms import urls as perms_urls
from .content import urls as content_urls

api_urls = perms_urls.api_urls + \
           content_urls.api_urls
""" Urls patterns for API endpoints """

consumers_urls = []
"""
Urls patterns for API endpoints available only as consumers over
WebSockets
"""

urlpatterns = []
""" Url patterns for regular views """


def get_urlpatterns():
    return [
        path('api/', include(api_urls), name='api'),
    ] + urlpatterns

