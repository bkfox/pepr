from django.core.exceptions import ImproperlyConfigured
from django.template import loader
from django.views.generic.base import ContextMixin, TemplateResponseMixin

from ..perms.mixins import PermissionMixin
from ..perms.permissions import CanAccess

from ..utils import slots
# reimport for API
from ..utils.slots import Position, Slots


# FIXME: merge in Component?
class ComponentBase:
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            if hasattr(self, k):
                setattr(self, k, v)
            else:
                raise ValueError(
                    '"{}" is not an attribute on class {}'
                    .format(k, type(self).__name__)
                )


class Component(TemplateResponseMixin, ContextMixin, ComponentBase):
    """
    A Component is an element that aims to be rendered in other views.
    It allows rendering item into a string for this purpose.

    A Component should never handle POST actions, but only be used to
    render data. This must be done at the view level, in order to ensure
    separate concerns.

    Component supports permissions in order to define wethers it should
    or not render. It renders an empty string if permission check failed.
    """
    template_name = ''
    """
    Name of the template to load from `get_template` can be a list of/a
    single string.
    """
    permission_classes = (CanAccess,)
    """ Required object permission to display component """
    slots = None
    """ Component's slots """
    object = None
    """ Object """

    def check_permissions(self, role, obj=None):
        """ Return True if role has component permission for this object """
        perms = self.permission_classes
        ite = (p for p in perms if not p.can(role)) if obj is None else \
              (p for p in perms if not p.can_obj(role, obj))
        return next(ite, True)

    def render(self, role, object=None, **kwargs):
        """
        Render Component into a string and return it.
        """
        object = object if object is not None else \
            getattr(self, 'object', None)
        if not self.check_permissions(role, object):
            return ''

        context = self.get_context_data(role=role, object=object, **kwargs)
        if context is None:
            return ''
        return self.get_template().render(context)

    def get_template(self, template_name=None):
        """
        Return Template instance to be used to render the component.

        :py:param str|None template_name: use this `template_name` \
                instead of `self.template_name`.
        """
        name = template_name or self.template_name
        if name is None:
            raise ImproperlyConfigured(
                "no `self.template_name` and no `template_name` given"
            )
        return loader.get_template(name) if isinstance(name, str) else \
            loader.select_template(name)

    def get_context_data(self, role, **kwargs):
        kwargs.setdefault('slots', self.slots)
        kwargs.setdefault('context', role.context)
        return super().get_context_data(role=role, **kwargs)


class Widget(slots.SlotItem, Component):
    """ Base class for Widgets """
    tag_name = ''
    tag_attrs = None
    icon = ''
    text = ''

    template_name = 'pepr/ui/widget.html'

    def __init__(self, tag_name='', tag_attrs=None, text='',
                 icon='', **kwargs):
        self.tag_name = tag_name or self.tag_name
        self.text = text or self.text
        self.icon = icon or self.icon

        if self.tag_attrs is None:
            self.tag_attrs = tag_attrs or {}
        elif tag_attrs:
            self.tag_attrs = self.tag_attrs.copy()
            self.tag_attrs.update(tag_attrs)
        super().__init__(**kwargs)

    def get_formatted(self, value, **kwargs):
        """
        Format and return ``value`` with ``self`` and given ``**kwargs``
        """
        return value.format(this=self, **kwargs)

    def get_tag_attrs(self, tag_attrs, **kwargs):
        """
        Return attribute of widget's tag.
        :param dict tag_attrs: add those values to tag_attrs
        """
        if self.tag_attrs:
            tag_attrs.update({k: v for k, v in self.tag_attrs.items()
                              if k not in tag_attrs})
        return tag_attrs

    def get_text(self, **kwargs):
        """ Return formated ``self.text``. """
        return self.text and self.get_formatted(self.text, **kwargs)

    def get_context_data(self, **kwargs):
        """
        Provides context values for: *tag_name, tag_attrs, icon, text.*
        They can be overriden using ``**kwargs``.
        """
        kwargs.setdefault('tag_name', self.tag_name)
        kwargs.setdefault('icon', self.icon)

        if 'tag_attrs' not in kwargs:
            kwargs['tag_attrs'] = self.get_tag_attrs(tag_attrs={}, **kwargs)

        if 'text' not in kwargs:
            kwargs['text'] = self.get_text(**kwargs)
        return super().get_context_data(**kwargs)


class Widgets(slots.Slot, Widget):
    """
    Widget used to render multiple widgets using the slot system.
    It fetches items in order to pre-render them in ``get_context_data``
    (if there is none rendered, hides himself).
    """
    tag_name = ''
    """
    Tag name for the HTML container; if empty, renders items only.
    """
    tag_attrs = {}
    """
    Extra attributes to add to the container tag.
    """

    template_name = 'pepr/ui/widgets.html'

    def __init__(self, name, tag_name=None, tag_attrs=None, **kwargs):
        # we provide this function as an helper. Ensure that given
        # parameters are all passed as named-parameters.
        super().__init__(name=name, tag_name=tag_name,
                         tag_attrs=tag_attrs, **kwargs)

    def get_context_data(self, role, sender, **kwargs):
        """
        :param [WidgetMixin] items: if given, use this list instead of \
            thoses from find_items
        """
        kwargs.setdefault('sender', sender)
        kwargs.setdefault('slot', self)

        # check items is empty wether it is in `kwargs` or not. Since
        # items is first get from kwargs, use `__setitem__` instead of
        # `setdefault`
        items = kwargs.get('items')
        if items is None:
            items = self.fetch(role=role, **{
                k: v for k, v in kwargs.items()
                if not hasattr
            })
            items = list(
                rendered for rendered in (
                    item.render(
                        role,
                        sender=kwargs['sender'], slot=kwargs['slot'],
                        object=kwargs.get('object')
                    )
                    for item in items if hasattr(item, 'render')
                ) if rendered
            )

        if not items:
            return

        kwargs['items'] = items
        return super().get_context_data(role=role, **kwargs)


