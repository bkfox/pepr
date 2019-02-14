from django.core.exceptions import PermissionDenied
from django.utils.translation import ugettext_lazy as _
from rest_framework.permissions import BasePermission, BasePermissionMetaclass

from ..utils.register import Register
from ..utils.metaclass import RegisterMeta
from ..utils.string import camel_to_snake


class Permissions(RegisterMeta, BasePermissionMetaclass):
    """
    Register class for permissions
    """
    entry_key_attr = '__name__'

    @classmethod
    def get_base_class(cls):
        return PermissionBase


class PermissionBase(BasePermission, metaclass=Permissions):
    """
    This class is used to describe permissions and also to grant
    (or not) permission to roles.

    It assumes that conjoint views are subclassing ``PermissionMixin``
    (role is retrieved from ``view.role``).

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
        role = obj.related_context.get_role(request.user)
        return self.can_obj(role, obj)


class CanAccess(PermissionBase):
    @classmethod
    def can_obj(cls, role, obj):
        return role.is_admin or role.has_access(obj.access)


class CanAction(CanAccess):
    """
    Base class for permissions checking if role is granted to
    change an object.

    In order to ensure that object access is checked, this class inherits
    from CanAccess.
    """
    @classmethod
    def can_obj(cls, role, obj):
        return role.is_admin or \
            super(CanAction, cls).can_obj(role, obj) and \
            role.is_granted(cls, type(obj))


class CanCreate(CanAction):
    """ Permission to create an accessible object """
    name = _('Create a new {model_name}')


class CanUpdate(CanAction):
    """ Permission to update any accessible object """
    name = _('Update any {model_name}')


class CanDelete(CanAction):
    """ Permission to update any accessible object """
    name = _('Delete any {model_name}')


class IsOwner(PermissionBase):
    """ Allow owner to act on object """
    @classmethod
    def can_obj(cls, role, obj):
        # Rule: Owner of an object always control its object
        if obj.is_owner(role.user):
            return True

        # Rule: Role can only edit others' object with <= role access;
        #       EXCEPT that Admin can not change objects of other Admin
        if obj.is_saved and not role.is_anonymous and \
                obj.owner is not None and obj.owner != role.user:
            owner_role = obj.related_context.get_role(obj.owner)
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
            return obj.related_context.can_request_subscription
        return True

