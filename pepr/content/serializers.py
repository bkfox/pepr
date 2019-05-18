from django.contrib.auth import models as auth

from rest_framework import serializers

from ..perms.serializers import AccessibleSerializer, ContextSerializer
from ..ui.widgets import ActionWidgets
from ..ui.components import render_slots

from .models import Container, Content, Service


class ContentAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = auth.User
        fields = ('id', 'username')


class ContentSerializer(AccessibleSerializer): # , serializers.HyperlinkedModelSerializer):
    html = serializers.SerializerMethodField(required=False)
    # owner = serializers.HyperlinkedIdentityField(view_name = 'user')
    modifier = ContentAuthorSerializer(required=False)

    class Meta:
        model = Content
        fields = (
            'pk', 'id',
            'created', 'owner',
            'modified', 'modifier',
            'context', 'text',
            'access',
            'html', '_actions', '_type'
        )
        read_only_fields = ('pk', 'created', 'owner',
                            'modified', 'modifier')

    def __init__(self, *args, render=True, **kwargs):
        super().__init__(*args, **kwargs)
        self.render = render

    def get_html(self, obj):
        if not self.render:
            return
        role = self.get_role(obj.get_context())
        return obj.as_component().render(role)

    # Rule: content access is limited to its role.
    #       TODO: enforce at a Permission level
    def before_change(self, role, instance, validated):
        validated['access'] = min(role.access, validated['access'])


class ContainerSerializer(ContextSerializer):
    class Meta:
        model = Container
        fields = ContextSerializer.Meta.fields + ('title', 'description')


