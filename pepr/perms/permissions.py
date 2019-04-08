from django.core.exceptions import PermissionDenied
from django.utils.translation import ugettext_lazy as _
from rest_framework.permissions import BasePermission, BasePermissionMetaclass
from rest_framework import permissions as drf_perms

from ..utils.register import Register
from ..utils.metaclass import RegisterMeta
from ..utils.string import camel_to_snake

from .models import Accessible, Owned


__all__ = ['AND', 'OR', 'Permissions', 'PermissionBase',
           'CanAccess', 'CanObject', 'CanCreate', 'CanUpdate',
           'CanDelete', 'CanSubscribe', 'CanInvite', 'CanUnsubscribe']


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
        return role.is_admin or role.is_grantd(cls, None)

    @classmethod
    def can_obj(cls, role, obj):
        """ Return True if ``role`` has permission for given obj. """
        # TODO: obj as Context
        if isinstance(obj, Owned) and obj.is_owner(role):
            return True
        if isinstance(obj, Accessible):
            return role.is_admin or role.has_access(obj.access)
        return False

    def has_permission(self, request, view):
        role = view.get_role(request)
        # We return True because if role is not defined, it means that
        # action occured before we can get the object. Hacky fix.
        return self.can(role) if role else True

    def has_object_permission(self, request, view, obj):
        role = view.get_role(request, obj)
        return self.can_obj(role, obj) if role else False


# Only declared for module API purposes.
CanAccess = PermissionBase


class CanObject(PermissionBase):
    """
    Base class for permission check based on role's granted privileges
    on an object.
    """
    @classmethod
    def test_owned(cls, role, obj):
        """
        Test wether role can or not act on object. A boolean value is
        returned when role is granted or not to act on the object.
        None is returned when further tests are required.

        Do not use this function unless you've understood how it works.
        """
        # Rule: Owner always has control over its content
        if obj.is_owner(role):
            return True

        # Rule: Role can only act upon others' object when they have a
        #       lower privilege level; EXCEPT when both are admin.
        if obj.is_saved and not role.is_anonymous and \
                obj.owner is not None and obj.owner != role.user:
            owner_role = obj.get_context().get_role(obj.owner)
            strict = role.is_admin and owner_role.is_admin
            test = role.has_access(owner_role.access, strict)
            # if role has access, further permissions tests must be
            # done (role has Permission, etc.).
            return None if test else False

    @classmethod
    def can_obj(cls, role, obj):
        test = cls.test_owned(role, obj) if isinstance(obj, Owned) else\
               None
        return False if test is False else \
            super(CanObject, cls).can_obj(role, obj)


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


class CanSubscribe(PermissionBase):
    """
    User can request subscription on the context assuming ``obj`` is
    valid.
    """
    name = _('Subscribe')

    @classmethod
    def can_obj(cls, role, obj):
        # Rule: Unsubscribed user can subscribe based on context policy
        #       only, while subscribed can't subscribe.
        if not role.is_subscribed and not role.is_anonymous:
            return obj.get_context().can_request_subscription
        return False


class CanInvite(CanCreate):
    """
    User can invite others to context assuming ``obj`` is valid.
    """
    name = _('Subscribe other users')

    @classmethod
    def can_obj(cls, role, obj):
        if role.is_subscribed and not role.is_anonymous:
            return super().can_obj(role, obj)
        return False


class CanUnsubscribe(CanDelete):
    """
    Checks that deletion does not leave the context without admin.
    """
    name = _('Unsubscribe')

    @classmethod
    def can_obj(cls, role, obj):
        from .models import Subscription
        from .roles import AdminRole
        if role.is_anonymous or \
                not super(CanUnsubscribe, cls).can_obj(role, obj):
            return False

        # according to owned's action rules, admin can not delete other
        # admin's subscription. we put this test here to avoid db call
        # whenever possible.
        if obj.role == AdminRole.access:
            qs = Subscription.objects.context(obj.context) \
                                     .access(obj.access)
            return qs.count() > 1
        return False

