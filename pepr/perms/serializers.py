
from django.db import transaction

from rest_framework import serializers


class AccessibleSerializer(serializers.ModelSerializer):
    role = None
    user = None

    def __init__(self, *args, role=None, user=None, **kwargs):
        # we allow setting user instead of role because we don't always
        # have an instance.
        self.role = role
        self.user = user
        super().__init__(*args, **kwargs)

    def get_role(self, instance):
        if self.role:
            return self.role

        if self.user is None:
            raise ValueError('At least `role` or `user` must be given')
        return instance.related_context.get_role(self.user)

    def create(self, validated_data):
        with transaction.atomic():
            instance = super().create(validated_data)
            instance.save_by(self.get_role(instance))
            return instance

    def update(self, instance, validated_data):
        with transaction.atomic():
            instance = super().update(instance, validated_data)
            instance.save_by(self.get_role(instance))
            return instance

