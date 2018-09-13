from rest_framework import serializers

from pepr.content.models import Container, Content, Service


class ContentSerializer(serializers.ModelSerializer):
    content = serializers.SerializerMethodField()

    class Meta:
        model = Content
        fields = (
            'created_date', 'created_by',
            'mod_date', 'mod_by',
            'context', 'text',
            'content',
        )
        read_only_fields = ('context', 'created_date','created_by',
                            'mod_date','mod_by')

    def get_content(self, obj):
        request = self.context.get('request')
        if not request:
            return
        return obj.render(request)

