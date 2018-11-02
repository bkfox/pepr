from django.contrib import admin

from .models import Container, Content, Service

admin.site.register(Container)
admin.site.register(Content)
admin.site.register(Service)
