from django.urls import path, include
from .views import StreamServiceView, StreamServiceDetailView


services_urls = [
    path('stream', StreamServiceView.as_view()),
]

urls = [
    path('<uuid:context_pk>/', include(services_urls)),
]



