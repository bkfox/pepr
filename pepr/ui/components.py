import itertools

from django.core.exceptions import ImproperlyConfigured
from django.template import loader
from django.views.generic.base import ContextMixin, TemplateResponseMixin

from ..perms.mixins import PermissionMixin
from ..perms.permissions import CanAccess

# reimport for API purpose
from ..utils.slots import Position, SlotItem, Slot, Slots


__all__ = ['render_slots', 'Component', 'Widget', 'Widgets', 'FormComp']


def render_slots(role, slots, *names, _pred=None,
                 _strict=False, **kwargs):
    """
    Render slots filtered using given arguments and return it as a list.
    """
    slots = slots.filter(*names, pred=_pred, strict=_strict)
    return list(itertools.chain(*(
        slot.render(role, **kwargs) for name, slot in slots
        if slot
    )))


class Component(TemplateResponseMixin, ContextMixin, PermissionMixin):
    """
    A Component is an element rendered inside views as string.

    Component supports permissions in order to define wethers it should
    or not be rendered (returns empty string).
    """
    template_name = ''
    """
    Template name to load from `get_template` can be a list or a single
    string.
    """
    slots = None
    """ Component's slots """
    object = None
    """ Object """

    permission_classes = tuple()
    # disable action_permissions since it would never be used
    action_permissions = None

    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            if not hasattr(self, k):
                raise ValueError('"{}" is not an attribute on class {}'.format(
                                 k, type(self).__name__))
            setattr(self, k, v)

    def get_object(self, obj=None):
        """
        Return given object or self.object
        """
        return self.object if obj is None else obj

    def render(self, role=None, object=None, **kwargs):
        """ Render Component into a string and return it.  """
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
        kwargs.setdefault('context', role and role.context)
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


class FormComp(Component):
    """ Component rendering a form """
    form_class = None
    """ form class to use """
    form_kwargs = None
    """ form kwargs to use """

    template_name = 'pepr/ui/form.html'

    def get_form_class(self, **kwargs):
        """ Return form class """
        return self.form_class

    def get_form_kwargs(self, role, obj=None, **kwargs):
        """ Return form init kwargs. """
        kwargs = self.form_kwargs or {}
        kwargs.setdefault('role', role)

        if obj:
            kwargs.setdefault('instance', obj)
        else:
            initial = kwargs.setdefault('initial', {})
            initial.setdefault('context', role.context.uuid)
            initial.setdefault('access', role.context.access)
        return kwargs

    def get_form(self, **kwargs):
        """ Return form instance """
        form_class = self.get_form_class(**kwargs)
        form_kwargs = self.get_form_kwargs(**kwargs)
        form = form_class(**form_kwargs)
        return form

    def get_context_data(self, **kwargs):
        if 'form' not in kwargs:
            kwargs['form'] = self.get_form(**kwargs)
        kwargs.setdefault('model', kwargs['form']._meta.model)
        return super().get_context_data(**kwargs)

    def __init__(self, form_class=None, form_kwargs=None, **kwargs):
        if form_class is not None:
            self.form_class = form_class
        if form_kwargs is not None:
            self.form_kwargs = form_kwargs
        super().__init__(**kwargs)



