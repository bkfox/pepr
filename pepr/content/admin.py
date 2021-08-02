from django.contrib import admin

from . import models

admin.site.register(models.Container)
admin.site.register(models.Content)
admin.site.register(models.ContentService)
