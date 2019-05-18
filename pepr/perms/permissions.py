from django.core.exceptions import PermissionDenied
from django.utils.translation import ugettext_lazy as _
from rest_framework.permissions import BasePermission, BasePermissionMetaclass
from rest_framework import permissions as drf_perms
from rest_framework.exceptions import PermissionDenied

from ..utils.register import Register
from ..utils.metaclass import RegisterMeta
from ..utils.string import camel_to_snake

__all__ = ['AND', 'OR', 'Permissions',
           'CanAccess', 'CanCreate', 'CanUpdate', 'CanDestroy',
           'CanSubscribe', 'CanInvite', 'CanAcceptSubscription',
           'CanUnsubscribe']

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
        return CanObject

    def __and__(self, other):
        return drf_perms.OperandHolder(AND, self, other)

    def __or__(self, other):
        return drf_perms.OperandHolder(OR, self, other)

    def __rand__(self, other):
        return drf_perms.OperandHolder(AND, other, self)

    def __ror__(self, other):
        return drf_perms.OperandHolder(OR, other, self)


class CanObject(drf_perms.BasePermission, metaclass=Permissions):
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
    def get_context(cls, role, obj):
        from .models import Context, Accessible
        return obj if isinstance(obj, Context) else \
            obj.context if isinstance(obj, Accessible) else None

    @classmethod
    def test_accessible(cls, role, obj):
        from .models import Accessible
        if not isinstance(obj, Accessible) or role.has_access(obj.access):
            return None
        return False

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
    def can(cls, role, model=None):
        """
        Return True if ``role`` is granted for :py:attr:`.model` (or
        for the provided ``model``).
        """
        model = model or cls.model
        return role.is_admin or role.is_granted(cls, model)

    @classmethod
    def can_obj(cls, role, obj):
        """
        Return True if ``role`` has permission for given obj.

        Default behaviour tests if role is an admin or owner of the
        object. For Accessible instances, test role access. For all
        objects, tests role ``is_granted`` for ``obj``.
        """
        from .models import Accessible, Context, Owned
        context = cls.get_context(role, obj)
        if context is not None and context.pk != role.context.pk:
            raise ValueError('Role and obj context are different')

        test_owned = cls.test_owned(role, obj)
        if test_owned is not None:
            return test_owned

        test_accessible = cls.test_accessible(role, obj)
        if test_accessible is not None:
            return test_accessible

        return role.is_admin or role.is_granted(cls, obj)

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


class CanAccess(CanObject):
    @classmethod
    def can_obj(cls, role, obj):
        from .models import Accessible
        if isinstance(obj, Accessible) and role.has_access(obj.access):
            return True


class CanCreate(CanObject):
    """ Permission to create an accessible object """
    name = _('Create a new {model_name}')


class CanUpdate(CanObject):
    """ Permission to update any accessible object """
    name = _('Update any {model_name}')


class CanDestroy(CanObject):
    """ Permission to update any accessible object """
    name = _('Delete any {model_name}')


class CanManage(CanObject):
    name = _('Manage context')


class CanSubscribe(CanObject):
    """
    User can create a request or Invite for the ``obj``/``role``
    context.
    """
    name = _('Subscribe')

    @classmethod
    def can_obj(cls, role, obj):
        from .models import Subscription
        # yet saved: just say yes
        if role.subscription and obj.pk == role.subscription.pk:
            return True
        return obj.owner is None and cls.can(role, Subscription)

    @classmethod
    def can(cls, role, model=None):
        # Rule: Subscription request can only be created by unsubscribed
        #       based on context's policies.
        return not role.is_anonymous and not role.is_subscribed and \
            role.context.allow_subscription_request


class CanInvite(CanObject):
    name = _('Invite')

    @classmethod
    def can_obj(cls, role, obj):
        from .models import Subscription
        if isinstance(obj, Subscription) and obj.is_owner(role) or \
                obj.owner is None:
            return False

        # Rule: Only subscribed user can create Invites.
        return cls.can(role, Subscription) and obj is not None and \
            not obj.is_owner(role)

    @classmethod
    def can(cls, role, model=None):
        return role.is_subscribed and super(CanInvite, cls).can(role, model)


class CanAcceptSubscription(CanObject):
    """
    Permission to accept an existing subscription (request and
    Invite).
    """
    name = _('Accept requests')

    @classmethod
    def can_obj(cls, role, obj):
        from .models import STATUS_INVITE, STATUS_REQUEST
        if obj.status == STATUS_INVITE:
            return obj.is_owner(role)
        if obj.status == STATUS_REQUEST and role.is_subscribed:
            return super(CanAcceptSubscription, cls).can_obj(role, obj)
        return False

# TODO: subscription update

class CanUnsubscribe(CanDestroy):
    """
    Checks that deletion does not leave the context without admin.
    """
    name = _('Unsubscribe')

    @classmethod
    def can_unsubscribe(cls, role):
        """ Return True if a role can unsubscribe from its context. """
        from .models import Subscription
        from .roles import AdminRole

        if not isinstance(role, AdminRole):
            return role.is_subscribed

        # An admin can not act on other admin's objects. We only test for
        # the presence of minimum one admin here.
        qs = Subscription.objects.context(role.context) \
                                 .access(AdminRole.access)

        return role.is_subscribed and qs.count() > 1

    @classmethod
    def can_obj(cls, role, obj):
        if obj.is_owner(role):
            return cls.can_unsubscribe(role)
        return super(CanUnsubscribe, cls).can_obj(role, obj)


