from django.contrib.auth import models as auth

from rest_framework import serializers

from ..core.serializers import ContextSerializer, OwnedSerializer

from .models import Container, Content

__all__ = ('ContainerSerializer', 'ContentSerializer')


class ContainerSerializer(ContextSerializer):
    class Meta:
        model = Container
        fields = ContextSerializer.Meta.fields + ('description',)


class ContentSerializer(OwnedSerializer):
    html = serializers.SerializerMethodField(required=False)
    # owner = serializers.HyperlinkedIdentityField(view_name = 'user')
    # modifier = ContentAuthorSerializer(required=False)

    class Meta:
        model = Content
        fields = OwnedSerializer.Meta.fields + (
            'created', 'modified', 'modifier_id',
            'access', 'context', 'text', 'html', 'meta'
        )
        read_only_fields = OwnedSerializer.Meta.fields + (
            'api_url', 'created', 'modified', 'modifier_id')

    def __init__(self, *args, render=True, **kwargs):
        super().__init__(*args, **kwargs)
        self.render = render

    def get_html(self, obj):
        if not self.render:
            return
        role = obj.get_role(self.identity)
        return obj.as_component().render(role)

    # Rule: content access is limited to its role.
    #       TODO: enforce at a Permission level
    def before_change(self, role, instance, validated):
        validated['access'] = min(role.access, validated['access'])


