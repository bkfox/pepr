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

    def get_role(self, context):
        """ Get role for the given context """
        if self.role and self.role.context.pk == context.pk:
            return self.role
        return context.get_role(self.user)

    def before_change(self, role, instance, validated):
        validated['access'] = min(role.access, validated['access'])

    def before_create(self, role, validated):
        self.before_change(role, None, validated)

    def before_update(self, role, instance, validated):
        self.before_change(role, instance, validated)

    def create(self, validated):
        # FIXME: get_context()
        self.role = self.get_role(validated['context'])
        self.before_create(self.role, validated)
        return super().create(validated)

    def update(self, instance, validated):
        self.role = self.get_role(instance.get_context())
        self.before_update(self.role, instance, validated)
        return super().update(instance, validated)


class OwnedSerializer(AccessibleSerializer):
    class Meta:
        fields = AccessibleSerializer.Meta.fields + ('owner',)
        read_only_fields = AccessibleSerializer.Meta.read_only_fields + \
            ('owner',)

    def is_owner_optional(self):
        """ Return True if model field "owner" can be null """
        return self.model._meta.get_field('owner').null

    def before_change(self, role, instance, validated):
        # this should not happen with correct flow. For sugar, we
        # raise a PermissionDenied instead of RuntimeError.
        if role.is_anonymous and not self.is_owner_optional:
            raise PermissionDenied(
                'Anonymous user can not edit {}'
                .format(self.model._meta.verbose_name.lower())
            )
        super().before_change(role, instance, validated)

    def before_create(self, role, validated):
        super().before_create(role, validated)
        if not role.is_anonymous:
            validated['owner'] = role.user

    def before_update(self, role, instance, validated):
        super().before_update(role, instance, validated)
        if not role.is_anonymous and instance.owner is None:
            validated['owner'] = role.user


# We check object's state transitions inside serializer because it is
# responsible for data validation. This means that rules that impplies
# the Subscription object are implemented here.
class SubscriptionSerializer(OwnedSerializer):
    class Meta:
        model = Subscription
        fields = OwnedSerializer.Meta.fields + ('status',)
        read_only_fields = OwnedSerializer.Meta.read_only_fields
        extra_kwargs = {'owner': {'required': False}}
        # TODO/FIXME: add unique validation check; cf. drf doc
        validators = []

    def __init__(self, instance=None, *args, **kwargs):
        # owner is writable only on create for subscribed. Unsubscribed
        # role will always be assigned
        self.fields['owner'].read_only = instance is not None
        super().__init__(instance, *args, **kwargs)

    def request_init_kwargs(self, role, init_kwargs):
        if not role.context.can_request_subscription:
            raise PermissionDenied(
                'request not authorized for this context.'
            )

        init_kwargs.update({
            'status': role.context.subscription_policy,
            'access': role.context.subscription_default_access,
            'owner': role.user,
        })

    def before_create_subscribed(self, role, validated):
        status = validated.get('status')

        # Rule: subscribed can create only invitation
        if status != models.SUBSCRIPTION_INVITATION:
            raise ValidationError('only invitation is authorized.')
        validated['status'] = models.SUBSCRIPTION_INVITATION

    def before_create_unsubscribed(self, role, validated):
        status = validated.get('status')

        # Rule: unsubscribed can create only subscription request
        if status not in (models.SUBSCRIPTION_REQUEST, None):
            raise ValidationError('only request is authorized')
        self.request_init_kwargs(role, validated)

    def before_create(self, role, validated):
        if role.is_subscribed:
            self.before_create_subscribed(role, validated)
        else:
            self.before_create_unsubscribed(role, validated)
        super().before_create(role, validated)


    def before_update_subscribed(self, role, instance, validated):
        status = validated.get('status')

        # Rule: subscribed can accept request
        # Rule: subscribed can update accepted subscription as regular
        #       Owned object excluding its owner and status
        if instance.status in (models.SUBSCRIPTION_REQUEST,
                               models.SUBSCRIPTION_ACCEPTED) and \
                status == models.SUBSCRIPTION_ACCEPTED:
            pass
        else:
            raise ValidationError("invalid subscription's update data")

    def before_update_unsubscribed(self, role, instance, validated):
        if not instance.is_owner(role):
            raise PermissionDenied('must be owner of the object')

        status = validated.get('status')

        # Rule: unsubscribed can accept an invitation
        if instance.status == models.SUBSCRIPTION_INVITATION and \
                status in (models.SUBSCRIPTION_INVITATION,
                           models.SUBSCRIPTION_ACCEPTED):
            pass
        # Rule: unsubscribed can retry to request subscription using
        #       context policies.
        elif instance.status == models.SUBSCRIPTION_REQUEST and \
                status == models.SUBSCRIPTION_REQUEST:
            self.request_init_kwargs(role, validated)
        else:
            raise ValidationError("invalid subscription's update data")

    def before_update(self, role, instance, validated):
        # TODO: admin -> can it do both? maybe it is a good idea to not care
        #       about superuser status in order to reduce ambient privilege
        if role.is_subscribed:
            self.before_update_subscribed(role, instance, validated)
        else:
            self.before_update_unsubscribed(role, instance, validated)
        super().before_update(role, instance, validated)


