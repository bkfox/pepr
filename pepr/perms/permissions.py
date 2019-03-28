from django.core.exceptions import PermissionDenied
from django.utils.translation import ugettext_lazy as _
from rest_framework.permissions import BasePermission, BasePermissionMetaclass
from rest_framework import permissions as drf_perms

from ..utils.register import Register
from ..utils.metaclass import RegisterMeta
from ..utils.string import camel_to_snake

from .models import Owned


class AND(drf_perms.AND):
    def can(self, *args, **kwargs):
        return (self.op1.can(*args, **kwargs) &
                self.op2.can(*args, **kwargs))

    def can_obj(self, *args, **kwargs):
        return (self.op1.can_obj(*args, **kwargs) &
                self.op2.can_obj(*args, **kwargs))


class OR(drf_perms.OR):
    def can(self, *args, **kwargs):
        return (self.op1.can(*args, **kwargs) |
                self.op2.can(*args, **kwargs))

    def can_obj(self, *args, **kwargs):
        return (self.op1.can_obj(*args, **kwargs) |
                self.op2.can_obj(*args, **kwargs))


class Permissions(RegisterMeta, drf_perms.BasePermissionMetaclass):
    """
    Register class for permissions
    """
    entry_key_attr = '__name__'

    @classmethod
    def get_base_class(cls):
        return PermissionBase

    def __and__(self, other):
        return drf_perms.OperandHolder(AND, self, other)

    def __or__(self, other):
        return drf_perms.OperandHolder(OR, self, other)

    def __rand__(self, other):
        return drf_perms.OperandHolder(AND, other, self)

    def __ror__(self, other):
        return drf_perms.OperandHolder(OR, other, self)



class PermissionBase(drf_perms.BasePermission, metaclass=Permissions):
    """
    This class is used to describe permissions and also to grant
    (or not) permission to roles.

    It assumes that conjoint views are subclassing ``PermissionMixin``:
    role is always retrieved from ``view.role`` (including for
    ``has_object_permissions``.

    PermissionBase permission logic is in ``can`` and ``can_obj``
    instead of ``has_permissions`` and ``has_object_permissions``.
    """
    name = ''
    """ [class] name displayed to user"""
    description = ''
    """ [class] description displayed to user"""

    @classmethod
    def _get_formated(cls, attr, model=None, **kwargs):
        attr = getattr(cls, attr)
        return attr.format(
            model=model,
            model_name=model._meta.verbose_name.title()
            if model else _('element'),
            **kwargs
        )

    @classmethod
    def get_name(cls, model=None):
        """ Return permission name formatted """
        return cls._get_formated('name', model)

    @classmethod
    def get_description(cls, model=None):
        return cls._get_formated('description', model=None)

    @classmethod
    def can(cls, role):
        """ Return True if ``role```has permission """
        return True

    @classmethod
    def can_obj(cls, role, obj):
        """ Return True if ``role`` has permission for given obj. """
        return True

    def has_permission(self, request, view):
        return self.can(view.role)

    def has_object_permission(self, request, view, obj):
        return self.can_obj(view.role, obj)


class Can(PermissionBase):
    """
    Base class for permission check based on role's granted privileges.
    """
    @classmethod
    def can(cls, role):
        return role.is_admin or (
            super(Can, cls).can(role) and
            role.is_granted(cls, None)
        )


class CanAccess(PermissionBase):
    """ Permission to access an accessible object """
    @classmethod
    def can_obj(cls, role, obj):
        # TODO: obj as Context
        return role.is_admin or role.has_access(obj.access)


class CanObject(CanAccess):
    """
    Base class for permission check based on role's granted privileges
    on an object.
    """
    @classmethod
    def can_obj(cls, role, obj):
        return role.is_admin or (
            super(CanObject, cls).can_obj(role, obj) and
            role.is_granted(cls, type(obj))
        )


class CanCreate(CanObject):
    """ Permission to create an accessible object """
    name = _('Create a new {model_name}')


class CanUpdate(CanObject):
    """ Permission to update any accessible object """
    name = _('Update any {model_name}')


class CanDelete(CanObject):
    """ Permission to update any accessible object """
    name = _('Delete any {model_name}')


class CanManage(CanObject):
    name = _('Manage context')


class IsOwner(PermissionBase):
    """
    Permission check for owned objects. If object is not an owned,
    returns False.
    """
    @classmethod
    def can_obj(cls, role, obj):
        if not isinstance(obj, Owned):
            return False

        # Rule: Owner of an object always control its object
        if obj.is_owner(role.user):
            return True

        # Rule: Role can only edit others' object with <= role access;
        #       EXCEPT that Admin can not change objects of other Admin
        if obj.is_saved and not role.is_anonymous and \
                obj.owner is not None and obj.owner != role.user:
            owner_role = obj.get_context().get_role(obj.owner)
            strict = role.is_admin and owner_role.is_admin
            return role.has_access(owner_role.access, strict)
        return True


class CanRequestSubscription(PermissionBase):
    """
    Allow unsubscribed to request a subscription.
    Note: does not check subscription value (done in serializer)
    """
    @classmethod
    def can_obj(cls, role, obj):
        # Rule: Unsubscribed user can subscribe based on context policy
        if not role.is_subscribed:
            return obj.get_context().can_request_subscription
        return True


# TODO: also for update
class CanDeleteSubscription(PermissionBase):
    """
    Allow unsubscribed to request a subscription.
    Note: does not check subscription value (done in serializer)
    """
    @classmethod
    def can_obj(cls, role, obj):
        from .models import Subscription
        from .roles import AdminRole
        if obj.access == AdminRole.access:
            qs = Subscription.objects.context(obj.context) \
                                     .access(obj.access)
            return qs.count() > 1
        return False


