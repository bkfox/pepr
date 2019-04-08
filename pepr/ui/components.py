import itertools

from django.core.exceptions import ImproperlyConfigured
from django.template import loader
from django.views.generic.base import ContextMixin, TemplateResponseMixin

from ..perms.mixins import PermissionMixin
from ..perms.permissions import CanAccess

# reimport for API purpose
from ..utils.slots import Position, SlotItem, Slot, Slots


class Component(TemplateResponseMixin, ContextMixin, PermissionMixin):
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
    slots = None
    """ Component's slots """
    object = None
    """ Object """

    permission_classes = (CanAccess,)
    action_permissions = None

    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            if hasattr(self, k):
                setattr(self, k, v)
            else:
                raise ValueError(
                    '"{}" is not an attribute on class {}'
                    .format(k, type(self).__name__)
                )

    def get_object(self, obj=None):
        """
        Return given object or self.object
        """
        return self.object if obj is None else obj

    def render(self, role, object=None, **kwargs):
        """
        Render Component into a string and return it.
        """
        object = self.get_object(object)
        if not (self.can(role) if object is None else
                self.can_obj(role, object)):
            return ''

        context = self.get_context_data(role=role, object=object, **kwargs)
        if context is None:
            return ''
        return self.get_template().render(context)

    def fetch_slots(self, *names, filter_pred=None, filter_strict=False,
                    **kwargs):
        """
        Fetch slots and return them as a dict of `{ name: widgets }`.
        """
        slots = self.slots.filter(*names, pred=filter_pred,
                                  strict=filter_strict)
        return {name: slot.fetch(**kwargs) for name, slot in slots}

    def render_slots(self, role, *names, filter_pred=None,
                     filter_strict=False, **kwargs):
        """
        Render slots of the given names or all them and return

        :param Role role: user role
        :param \*names: filter slots by name
        :param Class filter_pred: filter slots by predicate
        :param bool filter_strict: use strict filtering (see \
            :meth:`pepr.utils.register.Register.filter`)
        :param \**kwargs: render kwargs to pass to render
        """
        slots = self.slots.filter(*names, pred=filter_pred,
                                  strict=filter_strict)
        # return flatten results
        return list(itertools.chain(*(
            slot.render(role, **kwargs) for name, slot in slots
        )))

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


class Widget(SlotItem, Component):
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


class Widgets(Slot, Widget):
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

    def render_items(self, role, sender, items, **kwargs):
        """
        Render the given items and return them as a list of strings.
        """
        return list(
            rendered for rendered in (
                item.render(
                    role,
                    sender=sender, slot=kwargs['slot'],
                    object=kwargs.get('object')
                )
                for item in items if hasattr(item, 'render')
            ) if rendered
        )

    def get_context_data(self, role, **kwargs):
        """
        :param [Widget] items: if given, use this list instead of \
            thoses from `fetch`
        """
        kwargs.setdefault('slot', self)
        kwargs.setdefault('sender', self)

        # check items is empty wether it is in `kwargs` or not. Since
        # items is first get from kwargs, use `__setitem__` instead of
        # `setdefault`
        items = kwargs.get('items') or self.fetch(role=role, **kwargs)
        if items is None:
            return

        kwargs['items'] = items
        kwargs['items'] = self.render_items(role, **kwargs)
        return super().get_context_data(role=role, **kwargs) \
            if items else None


