from django.contrib.auth import models as auth

from rest_framework import serializers

from ..perms.serializers import AccessibleSerializer

from .models import Container, Content, Service


class ContentAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = auth.User
        fields = ('id', 'username')


class ContentSerializer(AccessibleSerializer):
    html = serializers.SerializerMethodField(required=False)
    owner = ContentAuthorSerializer(required=False)
    modifier = ContentAuthorSerializer(required=False)

    class Meta:
        model = Content
        fields = (
            'pk',
            'created', 'owner',
            'modified', 'modifier',
            'context', 'text',
            'access',
            'html'
        )
        read_only_fields = ('pk', 'created', 'owner',
                            'modified', 'modifier')

    def get_html(self, obj):
        self.role = self.get_role(obj.related_context)
        return obj.as_component().render(self.role)

