from django.core.exceptions import PermissionDenied, ValidationError
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from . import models
from .models import Context, Subscription


class AccessibleSerializer(serializers.ModelSerializer):
    user = None
    role = None
    """
    Current user role for self.instance's context. Set when
    `self.instance` is set.
    """

    _instance = None

    @property
    def instance(self):
        return getattr(self, '_instance', None)

    @instance.setter
    def instance(self, value):
        if self._instance is value:
            return
        self._instance = value
        if not value:
            self.role = None
        elif self.role is None or \
                self.role.context.id != value[0].context_id:
            self.role = value[0].related_context.get_role(self.user)

    class Meta:
        fields = ('pk', 'context', 'access')
        read_only_fields = ('pk',)

    def __init__(self, *args, user=None, role=None, **kwargs):
        super().__init__(*args, **kwargs)

        # we allow setting user instead of role because we don't always
        # have an instance.
        if user is None and role is None:
            raise RuntimeError('at least `user` or `role` must be given')

        self.user = role.user if role else user
        self.fields['context'].read_only = self.instance is not None

    def before_create(self, role, validated_data):
        validated_data.setdefault('change_by', role)

    def before_update(self, role, instance, validated_data):
        validated_data.setdefault('change_by', role)

    def create(self, validated_data):
        role = validated_data['context'].get_role(self.user)
        self.before_create(role, validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        role = instance.related_context.get_role(self.user)
        self.before_update(role, instance, validated_data)
        return super().update(instance, validated_data)


class OwnedSerializer(AccessibleSerializer):
    class Meta:
        fields = AccessibleSerializer.Meta.fields + ('owner',)
        read_only_fields = AccessibleSerializer.Meta.read_only_fields + \
            ('owner',)


class SubscriptionSerializer(OwnedSerializer):
    class Meta:
        model = Subscription
        fields = OwnedSerializer.Meta.fields + ('status',)
        read_only_fields = OwnedSerializer.Meta.read_only_fields
        extra_kwargs = {'owner': {'required': False}}
        validators = []

    def __init__(self, instance=None, *args, **kwargs):
        # owner is writable only on create for subscribed. Unsubscribed
        # role will always be assigned
        self.fields['owner'].read_only = instance is not None
        super().__init__(instance, *args, **kwargs)

    def _init_request(self, role, validated_data):
        if not role.context.subscription_request_allowed:
            raise PermissionError(
                'request not authorized for this context.'
            )

        validated_data['status'] = role.context.subscription_policy
        validated_data['access'] = role.context.subscription_default_access
        validated_data['owner'] = role.user

    def before_create_subscribed(self, role, validated_data):
        status = validated_data.get('status')

        # Rule: subscribed can create only invitation
        if status != models.SUBSCRIPTION_INVITATION:
            raise ValidationError('only invitation is authorized.')
        validated_data['status'] = models.SUBSCRIPTION_INVITATION

    def before_create_unsubscribed(self, role, validated_data):
        status = validated_data.get('status')

        # Rule: unsubscribed can create only subscription request
        if status not in (models.SUBSCRIPTION_REQUEST, None):
            raise ValidationError('only request is authorized')
        self._init_request(role, validated_data)

    def before_create(self, role, validated_data):
        # TODO: admin
        if role.is_subscribed:
            self.before_create_subscribed(role, validated_data)
        else:
            self.before_create_unsubscribed(role, validated_data)
        super().before_create(role, validated_data)


    def before_update_subscribed(self, role, instance, validated_data):
        status = validated_data.get('status')

        # Rule: subscribed can accept request
        # Rule: subscribed can update accepted subscription as regular
        #       Owned object excluding its owner and status
        if instance.status in (models.SUBSCRIPTION_REQUEST,
                               models.SUBSCRIPTION_ACCEPTED) and \
                status == models.SUBSCRIPTION_ACCEPTED:
            pass
        else:
            raise ValidationError("invalid subscription's update data")

    def before_update_unsubscribed(self, role, instance, validated_data):
        if not instance.is_owner(role):
            raise PermissionDenied('must be owner of the object')

        status = validated_data.get('status')

        # Rule: unsubscribed can accept an invitation
        if instance.status == models.SUBSCRIPTION_INVITATION and \
                status in (models.SUBSCRIPTION_INVITATION,
                           models.SUBSCRIPTION_ACCEPTED):
            pass
        # Rule: unsubscribed can retry to request subscription using
        #       context policies.
        elif instance.status == models.SUBSCRIPTION_REQUEST and \
                status == models.SUBSCRIPTION_REQUEST:
            self._init_request(role, validated_data)
        else:
            raise ValidationError("invalid subscription's update data")

    def before_update(self, role, instance, validated_data):
        # TODO: admin
        if role.is_subscribed:
            self.before_update_subscribed(role, instance, validated_data)
        else:
            self.before_update_unsubscribed(role, instance, validated_data)
        super().before_update(role, instance, validated_data)



