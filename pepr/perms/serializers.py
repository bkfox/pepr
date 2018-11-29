
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

    def save_(self, instance, validated_data):
        if instance:
            for k, v in validated_data.items():
                setattr(instance, k, v)
        else:
            instance = self.Meta.model(**validated_data)
        instance.save(by=self.get_role(instance))
        return instance

    def create(self, validated_data):
        return self.save_(None, validated_data)

    def update(self, instance, validated_data):
        return self.save_(instance, validated_data)

