from django.contrib.auth import models as auth

from rest_framework import serializers

from ..perms.serializers import AccessibleSerializer
from ..ui.widgets import ActionWidgets

from .models import Container, Content, Service


class ContentAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = auth.User
        fields = ('id', 'username')


class ContentSerializer(AccessibleSerializer): # , serializers.HyperlinkedModelSerializer):
    html = serializers.SerializerMethodField(required=False)
    # owner = serializers.HyperlinkedIdentityField(view_name = 'user')
    modifier = ContentAuthorSerializer(required=False)
    actions = serializers.SerializerMethodField(required=False)

    class Meta:
        model = Content
        fields = (
            'pk',
            'created', 'owner',
            'modified', 'modifier',
            'context', 'text',
            'access',
            'html', 'actions'
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

    def get_actions(self, obj):
        role = self.get_role(obj.get_context())
        return obj.as_component().render_slots(
            role=role, object=obj, slot_class=ActionWidgets, as_data=True
        )

    # Rule: content access is limited to its role.
    #       TODO: enforce at a Permission level
    def before_change(self, role, instance, validated):
        validated['access'] = min(role.access, validated['access'])

