from django.contrib import admin

from .models import Context, Subscription, Authorization

admin.site.register(Context)
admin.site.register(Subscription)
admin.site.register(Authorization)
