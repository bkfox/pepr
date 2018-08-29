from rest_framework import serializers

from pepr.content.models import Container, Content, Service


class ContentSerializer(serializers.ModelSerializer):
    content = serializers.SerializerMethodField(method_name='get_content')
    form = serializers.SerializerMethodField(method_name='get_form')

    class Meta:
        model = Content
        fields = (
            'uuid',
            'created_date' 'created_by',
            'mod_date', 'mod_by',
            'text',
        )
        readonly_fields = ('uuid', 'created_date','created_by',
                           'mod_date','mod_by')

        def get_content(self, obj):
            request = self.context.get('request')
            if not request:
                return
            return obj.render_to_string(request)

        def get_form(self, obj):
            request = self.context.get('request')
            if not request:
                return
            return obj.render_to_string(request, edit = True, obj = obj)

