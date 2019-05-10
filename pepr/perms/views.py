from django.db import transaction
from django.http import Http404

from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .mixins import ContextViewMixin, AccessibleViewMixin
from .models import Subscription, STATUS_REQUEST, STATUS_INVITE, \
    STATUS_ACCEPTED
from .permissions import *
from .serializers import SubscriptionSerializer


__all__ = ['ContextViewSet', 'AccessibleViewSet', 'OwnedViewSet',
           'SubscriptionViewSet']


class ContextViewSet(ContextViewMixin, viewsets.ModelViewSet):
    action_permissions = {
        'retrieve': (CanAccess,),
        'create': (CanCreate,),
        'update': (CanUpdate,),
        'delete': (CanDelete,),
    }

    @classmethod
    def get_api_actions(cls, role, obj):
        actions = super(ContextViewSet, cls).get_api_actions(role, obj)

        # role permissions for subscriptions edition
        extra = SubscriptionViewSet().get_api_actions(role)
        actions += ['subscription.' + a for a in extra]

        return actions

    def get_serializer(self, *args, **kwargs):
        kwargs.setdefault('user', self.request.user)
        return super().get_serializer(*args, **kwargs)


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
        'create': (CanSubscribe|CanInvite,),
        'update': (CanUpdate,),
        'accept': (CanAcceptSubscription,),
        'delete': (CanUnsubscribe,),
    }


    @action(detail=True, methods=['PUT'])
    def accept(self, request, pk=None):
        self.object = obj = self.get_object()
        if not obj:
            raise Http404

        obj.status = STATUS_ACCEPTED
        obj.save()

        serializer = self.get_serializer(user=request.user, instance=obj)
        return Response(data=serializer.data)


