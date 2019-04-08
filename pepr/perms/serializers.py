from django.core.exceptions import PermissionDenied, ValidationError
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from . import models
from .models import Context, Subscription, \
        SUBSCRIPTION_INVITATION, SUBSCRIPTION_REQUEST, \
        SUBSCRIPTION_ACCEPTED


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

        self.role = role
        self.user = role.user if role else user

        # Rule: context can not be changed once assigned
        self.fields['context'].read_only = self.instance is not None

    def get_role(self, context):
        """ Get role for the given context """
        if self.role and self.role.context.pk == context.pk:
            return self.role
        return context.get_role(self.user)

    def to_internal_value(self, data):
        value = super().to_internal_value(data)
        if self.role is None:
            context = value['context'] if self.instance is None else \
                      self.instance.get_context()
            self.role = self.get_role(context)
        return value


class OwnedSerializer(AccessibleSerializer):
    class Meta:
        fields = AccessibleSerializer.Meta.fields + ('owner',)
        read_only_fields = AccessibleSerializer.Meta.read_only_fields + \
            ('owner',)

    def is_owner_optional(self):
        """ Return True if model field "owner" can be null """
        return self.model._meta.get_field('owner').null

    def validate(self, data):
        # this should not happen with correct flow. For sugar, we
        # raise a PermissionDenied instead of RuntimeError.
        if self.role.is_anonymous and not self.is_owner_optional:
            raise PermissionDenied(
                'Anonymous not allowed to edit {}'
                .format(self.model._meta.verbose_name.lower())
            )
        return super().validate(data)

    def create(self, validated):
        owner = validated.get('owner')
        if not self.role.is_anonymous and owner is None:
            # child class can have overwrite validated['owner']
            validated['owner'] = self.role.user
        return super().create(validated)

    def update(self, instance, validated):
        owner = validated.get('owner')
        if not self.role.is_anonymous and owner is None:
            validated['owner'] = self.role.user
        return super().update(instance, validated)


# We check object's state transitions inside serializer because it is
# responsible for data validation. This means that rules that impplies
# the Subscription object are implemented here.
class SubscriptionSerializer(OwnedSerializer):
    """ Serializer class for Subscription instances. """
    class Meta:
        model = Subscription
        fields = OwnedSerializer.Meta.fields + ('status', 'access', 'role')
        read_only_fields = OwnedSerializer.Meta.read_only_fields
        extra_kwargs = {
            'owner': {'required': False, 'allow_null': True}
        }

    def __init__(self, *args, **kwargs):
        """
        :param SUBSCRIPTION_CHOICES status: set status at creation
        """
        super().__init__(*args, **kwargs)

        # Rule: invitations require owner to be set
        self.fields['owner'].read_only = self.instance is not None

    def validate_create(self, data):
        role, is_subscribed = self.role, self.role.is_subscribed

        # status validation
        status = data.setdefault('status', SUBSCRIPTION_REQUEST)
        is_invite = status is SUBSCRIPTION_INVITATION
        if status is SUBSCRIPTION_ACCEPTED or \
                (not is_subscribed and is_invite) or \
                (is_subscribed and not is_invite):
            raise ValidationError('invalid status')

        owner = data.get('owner')

        # Rule: Owner are set only for invitations and must be for other
        #       users.
        if (is_invite and owner in (None, role.user)) or \
                not is_invite and owner is not None:
            raise ValidationError("'owner' is required for invitations "
                                  "only and must not be request user")

        # role validation
        # Rule: maximum role access for a subscription depends of the
        #       context policies for request, otherwise of the current
        #       user's role.
        role_max = role.access if is_invite else \
            role.context.subscription_default_role
        data['role'] = min(role_max, data.get('role'))

    def validate_update(self, data):
        role, instance = self.role, self.instance

        # status validation
        # Rule: a subscription status can update only to the same
        #       value or accepted.
        # Rule: invitation can't be accepted by others, while
        #       request can't be accepted by owner.
        status = data.get('status')
        if status is SUBSCRIPTION_ACCEPTED:
            test = instance.status is SUBSCRIPTION_INVITATION \
                if instance.is_owner(role) else \
                instance.status is SUBSCRIPTION_REQUEST
        else:
            test = status in (instance.status, None)

        if not test:
            raise ValidationError("status {} can not become {}"
                                  .format(instance.status, status))

        # role validation
        # Rule: can't set role higher than the one attributed to user.
        #
        # If obj owner is user, use `obj.role` because role can be
        # DefaultRole (e.g. when an invitation is accepted).
        role_max = instance.role if instance.is_owner(role) else \
            role.access
        data['role'] = min(role_max, data.get('role', instance.role))

    def validate(self, data):
        if self.role.is_anonymous:
            raise ValidationError('role must not be anonymous')

        if self.instance is None:
            self.validate_create(data)
        else:
            self.validate_update(data)
        return super().validate(data)


