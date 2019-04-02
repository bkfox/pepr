from django.urls import path, include

def get_urlpatterns():
    from pepr.api.routing import api_urlpatterns, urlpatterns
    return [
        path('api/', include(api_urlpatterns), name='api'),
    ] + urlpatterns

