import itertools
from inspect import isclass

from django import template
from django.utils.html import escape
from django.utils.safestring import mark_safe

from pepr.utils.slots import Slots
from ..components import Component, render_slots
from ..widgets import ActionWidgets

register = template.Library()


def as_slots(obj):
    return obj if isinstance(obj, Slots) else getattr(obj, 'slots', None)


#
# Components & slots
#
@register.simple_tag(name='component', takes_context=True)
def do_component(context, component, **kwargs):
    r"""
    Render the given component here. parent view will be set to the
    current view. Component will be called or rendered using given
    `**kwargs`.

    :param (Component|str|callable) component: object or component to render.
    :param \*args: args to pass to `component.render`
    :param \**kwargs: kwargs to pass to component
    """
    kwargs.setdefault('role', context.get('role'))
    if isinstance(component, Component):
        return component.render(**kwargs)
    if isinstance(component, str):
        return component.format(**kwargs) if kwargs else component
    if callable(component):
        return component(**kwargs)
    return component


@register.simple_tag(name='slot', takes_context=True)
def do_slot(context, component, name, slots=None, **kwargs):
    r"""
    Render a Widgets by slot name (using context's "slots"
    attribute).

    :param str name: name of the slot on the container.
    :param object sender: signal sender.
    :param bool fetch: if true return fetched items instead of rendering
    :param \**kwargs: pass thoses values to ``render()``.
    """
    kwargs.setdefault('sender', context['view'])
    slot = as_slots(component).get(name)
    return do_component(context, slot, **kwargs) \
        if slot else ''


@register.simple_tag(name='fetch_slot', takes_context=True)
def do_fetch_slot(context, component, name, slots=None, **kwargs):
    r"""
    Render a Widgets by slot name (using context's "slots"
    attribute).

    :param str name: name of the slot on the container.
    :param object sender: signal sender.
    :param bool fetch: if true return fetched items instead of rendering
    :param \**kwargs: pass thoses values to ``render()``.
    """
    kwargs.setdefault('sender', context['view'])
    slot = as_slots(component).get(name)
    return slot and slot.fetch(**kwargs)


@register.simple_tag(name='slots', takes_context=True)
def do_slots(context, component, *names, **kwargs):
    """
    Render slots of the given component.
    Flowchart: component.render
    """
    kwargs.setdefault('sender', context['view'])
    role = kwargs.pop('role', context['role'])
    slots = as_slots(component)
    return render_slots(role, slots, *names, **kwargs)


@register.simple_tag(name='fetch_slots', takes_context=True)
def do_fetch_slots(context, component, *names, **kwargs):
    """
    Fetch slots of the given component.
    Flowchart: component.fetch
    """
    kwargs.setdefault('senter', context['view'])
    return component.fetch_slots(*names, **kwargs)


@register.simple_tag(name='actions', takes_context=True)
def do_actions(context, component, *names, **kwargs):
    """
    Render ActionWidgets slots of the given component.
    """
    kwargs['filter_pred'] = lambda k, e: isinstance(e, ActionWidgets)
    return do_fetch_slots(context, component, *names, **kwargs)


@register.simple_tag(name='actions', takes_context=True)
def do_fetch_actions(context, component, *names, **kwargs):
    """
    Fetch ActionWidgets slots of the given component.
    """
    kwargs.setdefault('filter_class', ActionWidgets)
    return do_slots(context, component, *names, **kwargs)


#
# Tag builders
#
@register.simple_tag(name='tag_attrs')
def do_tag_attrs(attrs=None, **extra_attrs):
    r"""
    Render given key-values as HTML tag attributes; to be used inside
    tags. Tags with a value that is ``None`` will be skipped.

    :param dict attrs: dict of ``{ 'attribute': 'value' }``.
    :parma \**extra_attrs: extra HTML attributes
    """
    if attrs:
        attrs.update(extra_attrs)
    else:
        attrs = extra_attrs

    if not attrs:
        return ''

    return mark_safe(
        ' '.join('{}="{}"'.format(k, escape(v)) if v is not True else k
                 for k, v in attrs.items()
                 if v is not None)
    )


@register.simple_tag(name='icon')
def do_icon(icon, class_='mr-2', **tag_attrs):
    r"""
    Render an icon, that can either be a FontAwesome icon or path
    to image file. Handles case where ``icon`` is None or empty.

    :param str icon: if it begins with "fa-", then FontAwesome icon,
        otherwise path to image file;
    :param class_: extra css class to add in icon;
    :param \**tag_attrs: extra attributes for the icon tag
    """
    if not icon:
        return ''

    if icon.startswith('fa-'):
        html = '<span class="{icon} icon {class_}" {attrs}></span>'
    else:
        html = '<img src="{icon}" class="icon {class_}" {attrs}>'
    return mark_safe(html.format(
        icon=icon, class_=class_,
        attrs=do_tag_attrs(tag_attrs) if tag_attrs else ''
    ))


#
# Data & model manipulation
#
@register.filter(name='meta')
def do_meta(obj, attr=None):
    """
    Return ``_meta`` for this object or class
    """
    if not isclass(obj):
        obj = type(obj)
    meta = getattr(obj, '_meta', None)
    return getattr(meta, attr, None) if attr is not None else meta


@register.filter(name="model_field")
def do_model_field(obj, name):
    """ Return model field for the given object and field name.  """
    return obj._meta.get_field(name)


@register.simple_tag(name='merge')
def do_merge(_dest=None, *args, **kwargs):
    r"""
    Update `_dest` using given arguments and return it.

    :param dict|list|set _dest: dict or list to update
    :param \*args: list or dict objects used to extend/update `_dest`
    :param \**kwargs: attribute of `_dest` to update (when `_dest` is \
        a dict.
    :return: the updated element
    """
    if isinstance(_dest, set):
        _dest.update(*args)
    elif isinstance(_dest, list):
        _dest += list(itertools.chain(_dest, *args))
    else:
        if args:
            for obj in args:
                _dest.update(obj)
        if kwargs:
            _dest.update(kwargs)
    return _dest


@register.simple_tag(name='dict')
def dict(**kwargs):
    return kwargs


