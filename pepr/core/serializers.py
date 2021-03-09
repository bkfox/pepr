from django.core.exceptions import PermissionDenied, ValidationError
from django.urls import reverse

from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator
from rest_framework.reverse import reverse

from .mixins import PermissionMixin
from .models import Context, Subscription
from .roles import ModeratorRole


__all__ = (
    'BaseSerializer', 'AccessibleSerializer', 'OwnedSerializer',
    'SubscriptionSerializer', 'ContextSerializer',
    'RoleSerializer',
)


class BaseSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField(read_only=True)
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
        fields = ('pk', 'id', 'meta')
        read_only_fields = ('pk', 'id')

    def __init__(self, *args, identity, viewset=None,
                 **kwargs):
        super().__init__(*args, **kwargs)
        self.identity = identity
        self.viewset = viewset

        self.view_name = self.view_name or \
            self.Meta.model.__name__.lower() + '-detail'

    def get_id(self, obj):
        return reverse(self.view_name, kwargs={'pk': obj.pk})

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


class ContextSerializer(BaseSerializer):
    """ Serializer for Context.  """
    role = serializers.SerializerMethodField(
        method_name='get_identity_role',
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
            'title'
        )

    view_name = 'context-detail'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # field = self.fields['subscription']
        # field.user, field.role = self.user, self.role

    def get_subscription(self, obj):
        role = obj.get_role(self.identity)
        if not role or not role.subscription:
            return

        viewset = self.context.get('view')
        viewset = viewset and viewset.subscription_viewset_class
        # actions = viewset and viewset.get_api_actions(role, role.subscription)
        return SubscriptionSerializer(
            identity=self.identity, instance=role.subscription, context=self.context,
            # api_actions=actions
        ).data

    def get_identity_role(self, obj):
        request = self.context.get('request')
        if not request:
            return None

        role = obj.get_role(request.identity)
        return RoleSerializer(instance=role, context=self.context).data


class RoleSerializer(serializers.Serializer):
    """ Serializer for role. """
    access = serializers.IntegerField()
    is_anonymous = serializers.BooleanField()
    is_subscribed = serializers.BooleanField()
    is_admin = serializers.BooleanField()
    identity = serializers.PrimaryKeyRelatedField(
        queryset=Context.objects.identities(),
    )


class AccessibleSerializer(BaseSerializer):
    class Meta:
        fields = BaseSerializer.Meta.fields + ('context', 'access')
        read_only_fields = BaseSerializer.Meta.read_only_fields

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Rule: context can not be changed once assigned
        if 'context' in self.fields:
            field = self.fields['context']
            field.read_only = self.instance is not None


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
        if self.identity is None and not self.is_owner_optional:
            raise PermissionDenied(
                'Anonymous not allowed to edit {}'
                .format(self.model._meta.verbose_name.lower())
            )
        return super().validate(data)

    def create(self, validated):
        owner = validated.get('owner')
        if self.identity is not None and owner is None:
            # child class can have overwrite validated['owner']
            # "owner" field can be read only in order to avoid
            validated['owner'] = self.identity
        return super().create(validated)

    def update(self, instance, validated):
        owner = validated.get('owner')
        if self.identity is not None and owner is None:
            validated['owner'] = self.identity
        return super().update(instance, validated)


class SubscriptionSerializer(OwnedSerializer):
    """ Serializer class for Subscription instances. """
    class Meta:
        model = Subscription
        fields = OwnedSerializer.Meta.fields + ('access', 'role')
        read_only_fields = OwnedSerializer.Meta.read_only_fields

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['status'].read_only = self.instance is None
        # self.fields['owner'].read_only = self.instance is not None

    def validate_request(self, role, data):
        if data.get('owner') and data['owner'] != self.identity:
            raise ValidationError({'owner': ['not allowed']})

        if data['role'] >= ModeratorRole.access:
            raise ValidationError({'role': ["must be < than Moderator role"]})

        context = role.context
        data.setdefault('access', context.subscription_default_access)
        data['access'] = min(data['access'], ModeratorRole.access)

        accept_role = context.subscription_accept_role
        data['status'] = Subscription.STATUS_ACCEPTED \
            if accept_role is not None and data['role'] <= accept_role else \
            Subscription.STATUS_REQUEST
        return data

    def validate_invite(self, role, data):
        owner = data.get('owner')
        if owner is None or owner == self.identity:
            raise ValidationError({'owner': [
                "This field is required and can't be current identity"
            ]})

        data['status'] = Subscription.STATUS_INVITE
        data['role'] = min(data['role'], role.access)
        return data

    def validate_update(self, role, data):
        instance = self.instance

        # status validation
        # Rule: a subscription status can update only to the same
        #       value or accepted.
        # Rule: Invite can't be accepted by others, while
        #       request can't be accepted by owner.
        status = data.get('status')
        if status is Subscription.STATUS_ACCEPTED:
            test = instance.status is Subscription.STATUS_ACCEPTED or (
                instance.status is Subscription.STATUS_INVITE
                if instance.is_owner(role) else
                instance.status is Subscription.STATUS_REQUEST
            )
        else:
            test = status in (instance.status, None)

        if not test:
            raise ValidationError("status {} can not become {}"
                                  .format(instance.status, status))

        # role validation
        # Rule: can't set role higher than the one attributed to identity.
        # If obj owner is identity, use `obj.role` because role can be
        # DefaultRole (e.g. when an Invite is accepted).
        role_max = instance.role if instance.is_owner(role) else role.access
        data['role'] = min(role_max, data.get('role', instance.role))
        return data

    def validate(self, data):
        if self.identity is None:
            raise PermissionDenied('user must be identitied')

        data = super().validate(data)
        role = data['context'].get_role(self.ideneity)
        if self.instance is not None:
            return self.validate_update(role, data)
        elif role.is_subscribed:
            return self.validate_invite(role, data)
        return self.validate_request(role, data)


