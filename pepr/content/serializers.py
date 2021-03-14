from rest_framework import serializers

from pepr.core.serializers import OwnedSerializer

from .models import Content

__all__ = ('ContentSerializer',)


class ContentSerializer(OwnedSerializer):
    html = serializers.SerializerMethodField(required=False)
    # owner = serializers.HyperlinkedIdentityField(view_name = 'user')
    # modifier = ContentAuthorSerializer(required=False)

    class Meta:
        model = Content
        fields = OwnedSerializer.Meta.fields + (
            'created', 'modified', 'modifier_id',
            'access', 'text', 'html', 'meta'
        )
        read_only_fields = OwnedSerializer.Meta.read_only_fields + (
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


