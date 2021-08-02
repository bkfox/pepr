from django.contrib import admin, sites

from .models import *

admin.site.register(Context)
admin.site.register(Subscription)
admin.site.register(Authorization)

admin.site.unregister(sites.models.Site)

class SiteContextInline(admin.TabularInline):
    model = SiteContext

@admin.register(sites.models.Site)
class SiteContextAdmin(admin.ModelAdmin):
    inlines = [ SiteContextInline ]

