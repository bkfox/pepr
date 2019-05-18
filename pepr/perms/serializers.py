from itertools import groupby

from django.core.exceptions import PermissionDenied, ValidationError
from django.contrib.auth import models as auth
from django.urls import reverse

from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from rest_framework.reverse import reverse

from .mixins import PermissionMixin
from .models import Context, Subscription, \
        STATUS_INVITE, STATUS_REQUEST, STATUS_ACCEPTED
from .roles import ModeratorRole


__all__ = [
    'BaseSerializer', 'AccessibleSerializer', 'OwnedSerializer',
    'SubscriptionSerializer', 'ContextSerializer',
    'OwnerSerializer', 'RoleSerializer',
    'ContextUserSubscriptionField',
]


class BaseSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField(read_only=True)
    _type = serializers.SerializerMethodField(method_name='get_object_type')
    _actions = serializers.SerializerMethodField(method_name='get_api_actions')

    user = None
    """ Current request user.  """
    role = None
    """
    Current user role for self.instance's context. Set when
    `self.instance` is set.
    """
    view_name = ''

    class Meta:
        fields = ('pk', 'id', '_actions', '_type')
        read_only_fields = ('pk', 'id')

    def __init__(self, *args, user=None, role=None, viewset=None,
                 **kwargs):
        super().__init__(*args, **kwargs)

        self.role = role
        self.user = user
        self.viewset = viewset

        self.view_name = self.view_name or \
            self.Meta.model.__name__.lower() + '-detail'

    def get_role(self, context):
        """ Get role for the given context """
        if self.user == self.role == self._context.get('request') is None:
            raise RuntimeError(
                'no way to determine user: you must provide at least '
                'one of the followings: role, user, request '
                '(as context)'
            )

        if self.role and self.role.context.pk == context.pk:
            return self.role
        request = self._context.get('request')
        user = self.user or request and request.user
        return user and context.get_role(self.user)

    def get_id(self, obj):
        return reverse(self.view_name, kwargs={'pk': obj.pk})

    def _get_api_actions(self, role, obj):
        """
        Return actions of the related api_action that are granted for the
        given role on obj as a list of string.
        """
        viewset = self.viewset or self._context.get('view')
        if not isinstance(viewset, PermissionMixin):
            return {}
        return viewset.get_api_actions(role, obj)

    def get_api_actions(self, obj):
        raise NotImplementedError('this method must be implemented')

    def get_object_type(self, obj):
        return obj._meta.verbose_name


class AccessibleSerializer(BaseSerializer):
    context_id = serializers.HyperlinkedRelatedField(
        view_name='context-detail', read_only=True
    )

    class Meta:
        fields = BaseSerializer.Meta.fields + ('context', 'access')
        read_only_fields = BaseSerializer.Meta.read_only_fields

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Rule: context can not be changed once assigned
        if 'context' in self.fields:
            field = self.fields['context']
            field.read_only = self.instance is not None

    def get_api_actions(self, obj):
        role = self.get_role(obj.context)
        return self._get_api_actions(role, obj)

    def to_internal_value(self, data):
        value = super().to_internal_value(data)
        # ensure we've got a role
        if self.role is None:
            context = value['context'] if self.instance is None else \
                      self.instance.get_context()
            self.role = self.get_role(context)
        return value


# TODO: move to 'content' application
class OwnerSerializer(serializers.ModelSerializer):
    """
    Serializer class for the owner of an Owned object.
    """
    class Meta:
        model = auth.User
        fields = ('id', 'username')


class OwnedSerializer(AccessibleSerializer):
    # owner = serializers.HyperlinkedRelatedField(view_name='')
    # owner = serializers.PrimaryKeyRelatedField(read_only=True)
    owner = OwnerSerializer()

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


class SubscriptionSerializer(OwnedSerializer):
    """ Serializer class for Subscription instances. """
    class Meta:
        model = Subscription
        fields = OwnedSerializer.Meta.fields + ('status', 'access', 'role')
        read_only_fields = OwnedSerializer.Meta.read_only_fields

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['status'].read_only = self.instance is None
        # self.fields['owner'].read_only = self.instance is not None

    def validate_request(self, data):
        if data.get('owner') and data['owner'] != self.role.user:
            raise ValidationError({'owner': ['not allowed']})

        if data['role'] >= ModeratorRole.access:
            raise ValidationError({'role': ["must be < than Moderator role"]})

        context = self.role.context
        data.setdefault('access', context.subscription_default_access)

        accept_role = context.subscription_accept_role
        data['status'] = STATUS_ACCEPTED \
            if accept_role is not None and data['role'] <= accept_role else \
            STATUS_REQUEST
        return data

    def validate_invite(self, data):
        owner = data.get('owner')
        if owner is None or owner == self.role.user:
            raise ValidationError({'owner': [
                "This field is required and can't be current user"
            ]})

        data['status'] = STATUS_INVITE
        data['role'] = min(data['role'], self.role.access)
        return data

    def validate_update(self, data):
        role, instance = self.role, self.instance

        # status validation
        # Rule: a subscription status can update only to the same
        #       value or accepted.
        # Rule: Invite can't be accepted by others, while
        #       request can't be accepted by owner.
        status = data.get('status')
        if status is STATUS_ACCEPTED:
            test = instance.status is STATUS_ACCEPTED or (
                instance.status is STATUS_INVITE
                if instance.is_owner(role) else
                instance.status is STATUS_REQUEST
            )
        else:
            test = status in (instance.status, None)

        if not test:
            raise ValidationError("status {} can not become {}"
                                  .format(instance.status, status))

        # role validation
        # Rule: can't set role higher than the one attributed to user.
        #
        # If obj owner is user, use `obj.role` because role can be
        # DefaultRole (e.g. when an Invite is accepted).
        role_max = instance.role if instance.is_owner(role) else \
            role.access
        data['role'] = min(role_max, data.get('role', instance.role))
        return data

    def validate(self, data):
        role = self.role
        if role.is_anonymous:
            raise ValidationError('role must not be anonymous')

        data = super().validate(data)
        return self.validate_update(data) if self.instance is not None else \
            self.validate_invite(data) if role.is_subscribed else \
            self.validate_request(data)


class RoleSerializer(serializers.Serializer):
    """ Serializer for role. """
    access = serializers.IntegerField()
    is_anonymous = serializers.BooleanField()
    is_subscribed = serializers.BooleanField()
    is_admin = serializers.BooleanField()


class ContextSerializer(BaseSerializer):
    """ Serializer for Context.  """
    role = serializers.SerializerMethodField(
        method_name='get_user_role'
    )
    subscription = serializers.SerializerMethodField()

    class Meta:
        model = Context
        fields = BaseSerializer.Meta.fields + (
            'allow_subscription_request',
            'subscription_default_role',
            'subscription_accept_role',
            'subscription_default_access',
            'role', 'subscription'
        )

    subscription_view_name = 'subscription-detail'


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # field = self.fields['subscription']
        # field.user, field.role = self.user, self.role

    def get_subscription(self, obj):
        role = self.get_role(obj)
        if not role or not role.subscription:
            return

        serializer = SubscriptionSerializer(
            role=role, instance=role.subscription, context=self.context)
        return serializer.data

    def get_user_role(self, obj):
        request = self.context.get('request')
        role = request and obj.get_role(request.user)
        return role and \
            RoleSerializer(instance=role, context=self.context).data

    def get_api_actions(self, obj):
        role = self.get_role(obj)
        return self._get_api_actions(role, obj)

