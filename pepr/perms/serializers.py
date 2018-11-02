from rest_framework import serializers

class AccessibleSerializer(serializers.ModelSerializer):
    current_user = None

    def __init__(self, *args, current_user=None, **kwargs):
        self.current_user = current_user
        super().__init__(*args, **kwargs)

    def _save(self, instance, validated_data, created):
        if self.current_user:
            role = validated_data['context'].get_role(self.current_user)
            instance.save_by(role, True)
        else:
            instance.save()
        return instance

    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        self._save(instance, validated_data, True)
        return instance

    def update(self, instance, validated_data):
        for key, value in validated_data:
            setattr(instance, key, value)

        self._save(instance, validated_data, False)
        return instance

