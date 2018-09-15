from django.http import HttpResponse
from django.urls import register_converter, path

from pepr.content.models import Container, Content, Service
from pepr.content.views import *

urlpatterns = [
    path('<uuid:pk>', ContainerDetailView.as_view(model = Container),
         name='pepr.container'),
    path('c/<uuid:pk>', BaseDetailView.as_view(model = Content),
         name='pepr.content'),
]


