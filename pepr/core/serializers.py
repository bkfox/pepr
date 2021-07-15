from django.core.exceptions import PermissionDenied, ValidationError
from django.urls import reverse

from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from rest_framework.reverse import reverse

from .views.generic import PermissionMixin
from .models import Context, Subscription
from .roles import ModeratorRole


__all__ = (
    'BaseSerializer', 'AccessibleSerializer', 'OwnedSerializer',
    'SubscriptionSerializer', 'ContextSerializer',
    'RoleSerializer',
)


class RoleSerializer(serializers.Serializer):
    """ Serializer for role. """
    access = serializers.IntegerField()
    is_anonymous = serializers.BooleanField()
    is_subscribed = serializers.BooleanField()
    is_moderator = serializers.BooleanField()
    is_admin = serializers.BooleanField()
    context_id = serializers.PrimaryKeyRelatedField(
        source='context',
        queryset=Context.objects.all(),
    )
    subscription_id = serializers.PrimaryKeyRelatedField(
        source='subscription',
        queryset=Subscription.objects.all(),
    )
    identity_id = serializers.PrimaryKeyRelatedField(
        source='identity',
        queryset=Context.objects.identities(),
    )
    permissions = serializers.DictField()


class BaseSerializer(serializers.ModelSerializer):
    api_url = serializers.SerializerMethodField(read_only=True)
    """ API url to object """
    meta = serializers.SerializerMethodField()

    identity = None
    """ Current identity of request user. """
    view_name = ''
    """
    Detail view name used for the id field.
    """
    # FIXME: not used in here but what about usage?
    api_actions = None
    """
    Viewset class or list of action names used to initialize the field
    "_actions". If None, get viewset from context.
    """

    class Meta:
        fields = ('pk', 'api_url')
        read_only_fields = ('pk', 'api_url')

    def __init__(self, *args, identity, viewset=None,
                 **kwargs):
        super().__init__(*args, **kwargs)
        self.identity = identity
        self.viewset = viewset

        self.view_name = self.view_name or \
            'api:' + self.Meta.model.__name__.lower() + '-detail'

    def get_api_url(self, obj):
        try:
            return reverse(self.view_name, kwargs={'pk': obj.pk})
        except:
            pass

    def get_api_actions(self, obj):
        """
        Return actions of the related api_action that are granted for the
        given role on obj as a list of string.
        """
        if self.viewset:
            if isinstance(self.viewset, (list, tuple)):
                return self.viewset
            viewset = self.viewset
        else:
            viewset = self._context.get('view')

        return {} if not isinstance(viewset, PermissionMixin) else \
            viewset.get_api_actions(obj.get_role(self.identity), obj)

    def get_meta(self, obj):
        return {
            'action': self.get_api_actions(obj),
            'type': obj._meta.verbose_name,
        }


class RoleDescriptionSerializer(serializers.Serializer):
    access = serializers.IntegerField()
    status = serializers.CharField()
    name = serializers.CharField()
    description = serializers.CharField


class ContextSerializer(BaseSerializer):
    """ Serializer for Context.  """
    role = serializers.SerializerMethodField()
    subscription = serializers.SerializerMethodField()
    n_subscriptions = serializers.SerializerMethodField()

    class Meta:
        model = Context
        fields = BaseSerializer.Meta.fields + (
            'default_access',
            'allow_subscription_request',
            'subscription_accept_role',
            'subscription_default_role',
            'subscription_default_access',
            'role', 'subscription', 'n_subscriptions',
        )

    view_name = 'api:context-detail'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # field = self.fields['subscription']
        # field.user, field.role = self.user, self.role

    def get_role(self, obj):
        if not self.identity:
            return
        role = obj.get_role(self.identity)
        return RoleSerializer(instance=role, context=obj).data

    def get_n_subscriptions(self, obj):
        return obj.subscription_set.identity(self.identity).subscribed().count()

    def get_subscription(self, obj):
        role = obj.get_role(self.identity)
        return role.subscription.pk if role and role.subscription else None


class AccessibleSerializer(BaseSerializer):
    context_id = serializers.PrimaryKeyRelatedField(source='context',
        queryset=Context.objects.all(),
    )

    class Meta:
        fields = BaseSerializer.Meta.fields + ('context_id', 'access')
        read_only_fields = BaseSerializer.Meta.read_only_fields

    def validate(self, data):
        # Rule: context can not be changed once assigned
        if self.instance and self.instance.context_id != data['context'].pk:
            raise ValidationError("Can't change item's context")
        return super().validate(data)


class OwnedSerializer(AccessibleSerializer):
    owner_id = serializers.PrimaryKeyRelatedField(source='owner',read_only=True)

    class Meta:
        fields = AccessibleSerializer.Meta.fields + ('owner_id',)
        read_only_fields = AccessibleSerializer.Meta.read_only_fields + \
            ('owner_id',)

    def validate(self, data):
        if self.identity is None:
            raise PermissionDenied(
                'Anonymous not allowed to edit {}'
                .format(self.model._meta.verbose_name.lower())
            )
        return super().validate(data)

    def create(self, validated):
        owner = validated.get('owner_id')
        if not 'owner_id' in validated and self.identity is not None:
            validated['owner_id'] = self.identity.pk
        return super().create(validated)

    def update(self, instance, validated):
        owner = validated.get('owner_id')
        if not 'owner_id' in validated and self.identity is not None:
            validated['owner_id'] = self.identity.pk
        return super().update(instance, validated)


class SubscriptionSerializer(OwnedSerializer):
    """ Serializer class for Subscription instances. """

    class Meta:
        model = Subscription
        fields = OwnedSerializer.Meta.fields + ('role', 'status')
        read_only_fields = OwnedSerializer.Meta.read_only_fields

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['status'].read_only = self.instance is None

    def validate_request(self, role, data):
        if data.get('owner_id') and data['owner_id'] != self.identity.pk:
            raise ValidationError({'owner_id': ['not allowed']})

        if data['role'] >= ModeratorRole.access:
            raise ValidationError({'role': ["must be less than Moderator"]})

        # access: context.subscription_default_access
        data.setdefault('access', role.context.subscription_default_access)
        data['access'] = min(data['access'], ModeratorRole.access)

        # status: context.subscription_accept_role
        accept_role = role.context.subscription_accept_role
        data['status'] = Subscription.STATUS_SUBSCRIBED \
            if accept_role is not None and data['role'] <= accept_role else \
            Subscription.STATUS_REQUEST
        return data

    def validate_invite(self, role, data):
        owner = data.get('owner_id')
        if owner is None or owner == self.identity.pk:
            raise ValidationError({'owner_id': [
                "This field is required and can't be current identity"
            ]})

        data['status'] = Subscription.STATUS_INVITE
        data['role'] = min(data['role'], role.access)
        return data

    def validate_update(self, role, data):
        instance = self.instance

        # status validation
        # Rule: a subscription status can update only to the same
        #       value or subscribed.
        # Rule: Invite can't be subscribed by others, while
        #       request can't be subscribed by owner.
        status = data.get('status')
        if status is Subscription.STATUS_SUBSCRIBED:
            test = instance.status is Subscription.STATUS_SUBSCRIBED or (
                # owner accepts invite
                instance.status is Subscription.STATUS_INVITE
                if instance.is_owner(role) else
                # moderator accepts request
                instance.status is Subscription.STATUS_REQUEST
            )
        else:
            test = status in (instance.status, None)

        if not test:
            raise ValidationError("status {} can not become {}"
                                  .format(instance.status, status))

        # owner updates request
        if instance.status is Subscription.STATUS_REQUEST and instance.is_owner(role):
            self.validate_request(role, data)

        # role validation
        # Rule: can't set role higher than the one attributed to identity.
        # If obj owner is identity, use `obj.role` because role can be
        # DefaultRole (e.g. when an Invite is subscribed).
        role_max = instance.role if instance.is_owner(role) else role.access
        data['role'] = min(role_max, data.get('role', instance.role))
        return data

    def validate(self, data):
        if self.identity is None:
            raise PermissionDenied('user must be identitied')

        data = super().validate(data)
        role = data['context'].get_role(self.identity)
        if self.instance is not None:
            return self.validate_update(role, data)
        elif role.is_subscribed:
            return self.validate_invite(role, data)
        return self.validate_request(role, data)


