from django.contrib import admin

import pepr.content.models as models


admin.site.register(models.Container)
admin.site.register(models.Content)
admin.site.register(models.Service)

