from django.urls import path, include

api_urls = []
""" Urls patterns for API endpoints """
consumers_urls = []
"""
Urls patterns for API endpoints available only as consumers over
WebSockets
"""
urlpatterns = []


def get_urlpatterns():
    return [
        path('api/', include(api_urls), name='api'),
    ] + urlpatterns

