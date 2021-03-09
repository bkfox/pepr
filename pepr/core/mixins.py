from django.core.exceptions import PermissionDenied
from django.http import Http404

from rest_framework import exceptions
from rest_framework.views import APIView

from .assets import roles
from .settings import settings
from .permissions import CanAccess, CanCreate, CanUpdate, CanDestroy
from .models import Context


__all__ = ('BaseViewMixin', 'PermissionMixin', 'PermissionViewMixin',
           'AccessibleViewMixin', 'ContextViewMixin')


class BaseViewMixin:
    """
    Base mixin for views.

    View can have a Media subclass
    """
    template_base = 'pepr/base.html'
    template_embed = 'pepr/base_embed.html'

    class Assets:
        """ Assets to include in rendered view """
        css = []
        js = []

    def get_media(self):
        return self.Media()

    def get_context_data(self, **kwargs):
        if not kwargs.get('template_base'):
            if kwargs.pop('embed', None) or self.request.GET.get('embed'):
                kwargs['template_base'] = self.template_embed
            else:
                kwargs['template_base'] = self.template_base
        if not kwargs.get('assets'):
            kwargs['assets'] = self.get_assets()
        return super().get_context_data(**kwargs)


class PermissionMixin:
    """
    Add support for permission check on the child class. Works in a
    similar way DRF ``APIView``, except it has an ``action_permissions``
    attribute specifying permissions per action or request's method basis.

    Context can be assigned for this instance's view, updating current
    role. Usage of this feature is up to class user, although a good
    practice is to always define a current permission context.
    """
    permission_classes = (CanAccess,)
    """ Permissions to check as request is being proceeded """
    action_permissions = {
        'GET': permission_classes,
        'POST': (CanCreate,),
        'PUT': (CanUpdate,),
        'DELETE': (CanDestroy,),
    }
    """
    Overrides permissions for the given actions (as
    ``{'action-name': (permissions,) }``). Can be ``None``.

    FIXME: It can either be a request method or an action (as given by
    ``viewset.action``).
    """

    @classmethod
    def get_action_permissions(cls, action=None):
        """ Return permissions for action. """
        permission_classes = cls.permission_classes
        if action is not None and cls.action_permissions:
            permission_classes = cls.action_permissions.get(
                action, permission_classes
            )
        return [perm() for perm in permission_classes]

    @classmethod
    def get_api_actions(cls, role, obj=None):
        """ Return a list of api actions key allowed for this role. """
        actions = getattr(cls, 'action_permissions', {}).keys()
        return [a for a in actions if cls.can(role, a)] if obj is None else \
            [a for a in actions if cls.can_obj(role, obj, a)]

    # TODO: action mandatory, but can be None (as first argument?)
    #       => ensure identity does not have it to 'None' by mistake
    #       (which test on cls.permission_classes)
    @classmethod
    def can(cls, role, action=None, throws=False):
        """
        Return True when identity has permissions for the given action.
        """
        failed = next(
            (permission for permission in cls.get_action_permissions(action)
             if not permission.can(role)), None
        )
        if throws and failed is not None:
            raise exceptions.PermissionDenied('permission denied')
        return failed is None

    @classmethod
    def can_obj(cls, role, obj, action=None, throws=False):
        """
        Return True when identity has permissions for the given action and
        object.
        """
        success = next(
            (False for permission in cls.get_action_permissions(action)
             if not permission.can_obj(role, obj)), True
        )
        if throws and not success:
            raise exceptions.PermissionDenied('permission denied')
        return success


class PermissionViewMixin(PermissionMixin):
    """
    Base mixin for views handling permissions access.

    Provide template context variables:
    - ``role``: current user's role;
    - ``roles``: all available roles
    """
    context_class = Context
    role = None

    def get_permissions(self):
        return self.get_action_permissions(self.action)

    def get_context_queryset(self):
        """ Return context queryset """
        return self.context_class.objects.identity(self.request.identity)

    def get_context(self, context_pk=None, context_slug=None, **kwargs):
        """ Return context from pk or slug in dispatch kwargs. """
        if context_pk:
            return self.get_context_queryset().get(pk=context_pk)
        if context_slug:
            return self.get_context_queryset().get(slug=context_slug)
        return None

    def get_context_data(self, **kwargs):
        """ Ensure 'role' and 'roles' are in resulting context """
        kwargs.setdefault('role', self.role)
        kwargs.setdefault('roles', roles() )
        return super().get_context_data(**kwargs)

    def dispatch(self, request, *args, **kwargs):
        context = self.get_context(**kwargs)
        if context:
            self.role = context.get_role(request.identity)
        # FIXME self.can(self.role, request.method)
        return super().dispatch(request, *args, **kwargs)


class ContextViewMixin(PermissionMixin):
    """
    Mixin handling Accessible objects permission check. Can work with
    PermissionViewMixin
    """
    def get_queryset(self):
        qs = super().get_queryset().identity(self.request.identity)
        role = getattr(self, 'role', None)
        if role and role.context:
            qs = qs.filter(context=role.context)
        return qs


class AccessibleViewMixin(PermissionMixin):
    """
    Mixin handling Accessible objects permission check. Can work with
    PermissionViewMixin
    """
    def get_queryset(self):
        qs = super().get_queryset().identity(self.request.identity)
        role = getattr(self, 'role', None)
        if role and role.context:
            qs = qs.filter(context=role.context)
        return qs


