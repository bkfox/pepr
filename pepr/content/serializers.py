from django.contrib.auth import models as auth

from rest_framework import serializers

from pepr.perms.serializers import AccessibleSerializer

from .models import Container, Content, Service

class ContentAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = auth.User
        fields = ('id', 'username')


class ContentSerializer(AccessibleSerializer):
    html = serializers.SerializerMethodField()
    created_by = ContentAuthorSerializer(required=False)
    mod_by = ContentAuthorSerializer(required=False)

    class Meta:
        model = Content
        fields = (
            'pk',
            'created_date', 'created_by',
            'mod_date', 'mod_by',
            'context', 'text',
            'html', 'access',
        )
        read_only_fields = ('pk', 'created_date', 'created_by',
                            'mod_date', 'mod_by')

    def get_html(self, obj):
        if self.current_user:
            return obj.render(self.current_user)

