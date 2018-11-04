from rest_framework import serializers


class AccessibleSerializer(serializers.ModelSerializer):
    role = None

    def __init__(self, *args, role=None, **kwargs):
        self.role = role
        super().__init__(*args, **kwargs)

    def _save(self, instance, validated_data):
        instance.save(by=self.role)
        return instance

    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        self._save(instance, validated_data)
        return instance

    def update(self, instance, validated_data):
        for key, value in validated_data:
            setattr(instance, key, value)
        self._save(instance, validated_data)
        return instance

