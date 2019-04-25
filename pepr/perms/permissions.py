from django.core.exceptions import PermissionDenied
from django.utils.translation import ugettext_lazy as _
from rest_framework.permissions import BasePermission, BasePermissionMetaclass
from rest_framework import permissions as drf_perms

from ..utils.register import Register
from ..utils.metaclass import RegisterMeta
from ..utils.string import camel_to_snake

__all__ = ['AND', 'OR', 'Permissions', 'PermissionBase',
           'CanAccess', 'CanObject', 'CanCreate', 'CanUpdate',
           'CanDelete',
           'CanSubscribe', 'CanAcceptSubscription', 'CanUnsubscribe']

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
    Base Permission class handling Accessible and Owned object
    permissions. Class methods ``can`` and  ``can_obj`` are where the
    real business is done.

    It can also handle regular permission check using user's role --
    check :py:meth:`.PermissionBase.has_permission` for more
    information.
    """
    name = ''
    """ [class] name displayed to user"""
    description = ''
    """ [class] description displayed to user"""
    model = None

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
    def can(cls, role, model=None):
        """
        Return True if ``role`` is granted for :py:attr:`.model` (or
        for the provided ``model``).
        """
        model = model or cls.model
        return model is None or role.is_admin \
            or role.is_granted(cls, model)

    @classmethod
    def can_obj(cls, role, obj):
        """ Return True if ``role`` has permission for given obj. """
        # TODO: obj as Context
        from .models import Accessible, Owned
        if not isinstance(obj, Accessible):
            return False
        if isinstance(obj, Owned) and obj.is_owner(role):
            return True
        return role.is_admin or role.has_access(obj.access)

    @classmethod
    def for_model(cls, model):
        """
        Subclass this class with ``model`` as :py:attr:`.model`.

        This method can be used to enforce (non-object) permission
        check on a view:

        .. code-block:: python

            class MyViewSet(ViewSet):
                permission_classes = (CanAccess.for_model(Subscription),)


        It will check that role ``is_granted(CanAccess, Subscription)``.
        """
        mother = cls

        class ChildPermission(cls):
            model = model

            @classmethod
            def can(cls, role, model=None):
                return mother.can(role, model or cls.model)

            @classmethod
            def can_obj(cls, role, obj):
                return mother.can_obj(role, obj)
        return ChildPermission

    def has_permission(self, request, view):
        """
        Return True when no :py:attr:`.model` is provided, otherwise
        fetch request's user role from view and return result of
        :py:meth:`.can`.

        The later case implies that view provide the method
        ``get_role(request)``.
        """
        if not self.model:
            return True
        role = hasattr(view, 'get_role') and view.get_role(request)
        return role and self.can(role, self.model)

    def has_object_permission(self, request, view, obj):
        role = view.get_role(request, obj)
        return role and self.can_obj(role, obj)


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
        from .models import Owned
        if not isinstance(obj, Owned):
            return None

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
        test = cls.test_owned(role, obj)
        return super(CanObject, cls).can_obj(role, obj) \
            and role.is_granted(cls, type(obj)) \
            if test is None else test


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
    User can create a request or invitation for the ``obj``/``role``
    context.
    """
    name = _('Subscribe')

    @classmethod
    def can_obj(cls, role, obj):
        if obj.context_id != role.context.id:
            raise ValueError("context is not the same for role and obj")

        # Rule: Subscribed can only create invitation for other users.
        # Rule: Unsubscribed can only create request for themselves.
        is_owner = obj.owner is None or obj.is_owner(role)
        if role.is_anonymous or role.is_subscribed == is_owner:
            return False

        return super(CanSubscribe, cls).can_obj(role, obj) \
            if role.is_subscribed else \
            role.context.can_request_subscription

    @classmethod
    def can(cls, role, model=None):
        return not role.is_anonymous and (
            super(CanSubscribe, cls).can(role, model)
            if role.is_subscribed else
            role.context.can_request_subscription
        )


class CanAcceptSubscription(CanObject):
    """
    Permission to accept an existing subscription (request and
    invitation).
    """
    name = _('Accept requests')

    @classmethod
    def can_obj(cls, role, obj):
        from .models import STATUS_INVITATION, STATUS_REQUEST
        if obj.status == STATUS_INVITATION:
            return obj.is_owner(role)
        if obj.status == STATUS_REQUEST and role.is_subscribed:
            return super(CanAcceptSubscription, cls).can_obj(role, obj)
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
            if qs.count() < 1:
                return False
        return super(CanUnsubscribe, cls).can_obj(role, obj)

    @classmethod
    def can(cls, role, model=None):
        return role.subscription is not None

