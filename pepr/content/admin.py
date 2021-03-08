from django.contrib import admin

from .models import Container, Content, StreamService

admin.site.register(Container)
admin.site.register(Content)
admin.site.register(StreamService)
