from django.db import transaction

from rest_framework import viewsets
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend

from .mixins import AccessibleViewMixin
from .models import Subscription, \
    SUBSCRIPTION_INVITATION
from .permissions import *
from .serializers import SubscriptionSerializer


class AccessibleViewSet(AccessibleViewMixin, viewsets.ModelViewSet):
    """
    This mixin enforce permissions checks on the accessible elements.
    It uses a``.serializer.AccessibleSerializer`` (sub-)class.
    """
    action_permissions = {
        'retrieve': (CanAccess,),
        'create': (CanCreate,),
        'update': (CanUpdate,),
        'delete': (CanDelete,),
    }
    """
    Permission to apply for a specific action instead of
    `self.permissions`.
    """
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ('context', 'access')

    def get_serializer(self, *args, **kwargs):
        kwargs.setdefault('user', self.request.user)
        return super().get_serializer(*args, **kwargs)

    # FIXME: with correct serializer this should not be necessary
    @transaction.atomic
    def perform_create(self, serializer):
        super().perform_create(serializer)
        # double check that ensure that the object is valid
        role = self.get_role(obj=serializer.instance)
        self.can_obj(role, serializer.instance, throws=True)

    @transaction.atomic
    def perform_update(self, serializer):
        super().perform_update(serializer)
        # double check that ensures the updated object is still valid
        role = self.get_role(obj=serializer.instance)
        self.can_obj(role, serializer.instance, throws=True)


class OwnedViewSet(AccessibleViewSet):
    filterset_fields = AccessibleViewSet.filterset_fields + ('owner',)


class SubscriptionViewSet(OwnedViewSet):
    model = Subscription
    serializer_class = SubscriptionSerializer
    filterset_fields = OwnedViewSet.filterset_fields + ('role', 'status')
    action_permissions = {
        'retrieve': (CanAccess,),
        'invite': (CanInvite,),
        'create': (CanSubscribe,),
        'update': (CanUpdate,),
        'delete': (CanUnsubscribe),
    }


