from django.core.exceptions import PermissionDenied

from .models import Accessible


class PermissionMixin:
    required_perm = None
    """
    Permission codename to always test when calling has_perms.
    """

    def has_perm(self, role, codename, obj=None, model=None):
        """
        Return True if role has the given permission. If ``obj`` is
        an accessible, call ``obj.has_perm``. When model is None but
        object given, set model to ``obj``
        """
        if isinstance(obj, Accessible):
            return obj.has_perm(role, codename)
        model = model if model is not None else \
            type(obj) if obj is not None else None
        return role.has_perm(codename, model)

    def has_perms(self, role, obj=None, model=None):
        """
        Test that role has permissions specific to the view with the
        given parameters.
        """
        if self.required_perm:
            return self.has_perm(role, self.required_perm, obj)
        return obj.has_access(role) if obj else True

    def assert_perms(self, role, obj=None, model=None):
        """
        Raise a PermissionDenied if ``has_perm`` returns False.
        """
        if not self.has_perms(role, obj, model):
            raise PermissionDenied('Permission denied')


class ContextMixin(PermissionMixin):
    """ Provides access control to a context.  """
    role = None
    """ User's role """

    @property
    def context(self):
        return self.role.context if self.role else None

    @context.setter
    def context(self, value):
        if value:
            role = value.get_role(self.request.user)
            self.assert_perms(role)
            self.role = role
        else:
            self.role = None

    def get_context_data(self, **kwargs):
        """ Ensure 'role' and 'context' are in resulting context """
        kwargs.setdefault('role', self.role)
        kwargs.setdefault('context', self.context)
        return super().get_context_data(**kwargs)


class ContextDetailMixin(ContextMixin):
    """ Provides access control to a Context that is self.object """
    @property
    def object(self):
        return self.context

    @object.setter
    def object(self, value):
        self.context = value


