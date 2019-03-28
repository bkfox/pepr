from django.db import transaction
from django.views.generic import DetailView, UpdateView

from rest_framework import viewsets

from .mixins import PermissionMixin, ContextViewMixin, AccessibleViewMixin
from .models import Context, Subscription
from .permissions import CanAccess, CanCreate, CanUpdate, CanDelete, IsOwner, \
                         CanRequestSubscription, CanDeleteSubscription
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

    def get_serializer(self, *args, **kwargs):
        kwargs.setdefault('user', self.request.user)
        return super().get_serializer(*args, **kwargs)

    @transaction.atomic
    def perform_create(self, serializer):
        super().perform_create(serializer)
        self.object = serializer.instance
        self.check_object_permissions(self.request, serializer.instance)

    @transaction.atomic
    def perform_update(self, serializer):
        super().perform_update(serializer)
        # double check that ensures the updated object is still valid
        self.check_object_permission(self.request, serializer.instance)


class OwnedViewSet(AccessibleViewSet):
    action_permissions = {
        'retrieve': (IsOwner | CanAccess,),
        'create': (CanCreate,),
        'update': (IsOwner | CanUpdate,),
        'delete': (IsOwner | CanDelete,),
    }


class SubscriptionViewSet(OwnedViewSet):
    model = Subscription
    serializer_class = SubscriptionSerializer
    action_permissions = {
        'retrieve': (IsOwner | CanAccess,),
        'create': (CanCreate, CanRequestSubscription),
        'update': (IsOwner | CanUpdate,),
        'delete': (IsOwner | CanDelete, CanDeleteSubscription),
    }

    # TODO: add actions: invite, request


