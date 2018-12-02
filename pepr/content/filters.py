import django_filters as filters

from .models import Content


class ContentFilter(filters.FilterSet):
    class Meta:
        model = Content
        fields = {
            'context': ['exact'],
            'created': ['lt', 'gt', 'exact'],
            'modified': ['lt', 'gt', 'exact'],
        }



