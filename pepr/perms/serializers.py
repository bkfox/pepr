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
    def instance(self, obj):
        if self._instance is obj:
            return
        self._instance = obj
        if not obj:
            self.role = None
        elif self.role is None or \
                self.role.context.id != obj.context_id:
            self.role = obj.related_context.get_role(self.user)

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

    def before_change(self, role, instance, validated_data):
        validated_data['access'] = min(role.access, validated_data['access'])

    def before_create(self, role, validated_data):
        self.before_change(role, None, validated_data)

    def before_update(self, role, instance, validated_data):
        self.before_change(role, instance, validated_data)

    def create(self, validated_data):
        # FIXME: related_context
        if self.role is None:
            self.role = validated_data['context'].get_role(self.user)
        self.before_create(self.role, validated_data)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if self.role is None:
            self.role = instance.related_context.get_role(self.user)
        self.before_update(self.role, instance, validated_data)
        return super().update(instance, validated_data)


class OwnedSerializer(AccessibleSerializer):
    class Meta:
        fields = AccessibleSerializer.Meta.fields + ('owner',)
        read_only_fields = AccessibleSerializer.Meta.read_only_fields + \
            ('owner',)

    def is_owner_optional(self):
        """ Return True if model field "owner" can be null """
        return self.model._meta.get_field('owner').null

    def before_change(self, role, instance, validated_data):
        # this should not happen with correct flow. For sugar, we
        # raise a PermissionDenied instead of RuntimeError.
        if role.is_anonymous and not self.is_owner_optional:
            raise PermissionDenied(
                'Anonymous user can not edit {}'
                .format(self.model._meta.verbose_name.lower())
            )
        super().before_change(role, instance, validated_data)

    def before_create(self, role, validated_data):
        super().before_create(role, validated_data)
        if not role.is_anonymous:
            validated_data['owner'] = role.user

    def before_update(self, role, instance, validated_data):
        super().before_update(role, instance, validated_data)
        if not role.is_anonymous and instance.owner is None:
            validated_data['owner'] = role.user


# We check object's state transitions inside serializer because it is
# responsible for data validation. This means that rules that impplies
# the Subscription object are implemented here.
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
        if not role.context.can_request_subscription:
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



