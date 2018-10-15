from rest_framework import serializers

from pepr.content.models import Container, Content, Service


class ContentSerializer(serializers.ModelSerializer):
    html = serializers.SerializerMethodField()

    current_user = None

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

    def __init__(self, *args, current_user=None, **kwargs):
        self.current_user = current_user
        super().__init__(*args, **kwargs)

    def create(self, validated_data):
        if self.current_user:
            validated_data['mod_by'] = self.current_user
            validated_data['created_by'] = self.current_user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if self.current_user:
            instance.update_by(self.current_user)
        return super().update(validated_data)

    def get_html(self, obj):
        if self.current_user:
            return obj.render(self.current_user)

