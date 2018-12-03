from inspect import isclass

from django import template
from django.utils.html import escape
from django.utils.safestring import mark_safe

from ..components import Component

register = template.Library()


#
# Components & slots
#
@register.simple_tag(name='component', takes_context=True)
def do_component(context, component, role=None, *args, **kwargs):
    # TODO: more doc about different rendering depending on type of
    #       `component`.
    r"""
    Render the given component here. parent view will be set to the
    current view.

    :param (Component|str|callable) component: object or component to render.
    :param \*args: args to pass to `component.render`
    :param \**kwargs: kwargs to pass to `component.render`
    """
    role = role or context.get('role')

    if isinstance(component, Component):
        return component.render(role, *args, **kwargs)

    if isinstance(component, str):
        return component.format(role=role, **kwargs) if kwargs else \
               component
    if callable(component):
        return component(role, *args, **kwargs)
    return component


@register.simple_tag(name='slot', takes_context=True)
def do_slot(context, slot_name, sender, *args, slots=None, **kwargs):
    r"""
    Render a Widgets by slot name (using context's "slots"
    attribute).

    :param str slot_name: name of the slot on the container.
    :param object sender: signal sender.
    :param \**kwargs: pass thoses values to ``render()``.
    """
    slots = slots or context['slots']
    slot = slots.get(slot_name)
    if not slot:
        return ''
    return do_component(context, slot, sender=sender, *args, **kwargs)


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
        ' '.join('{}="{}"'.format(k, escape(v))
                     if v is not True else k
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
# Filters
#
@register.filter(name='meta')
def do_meta(obj, attr=None):
    """
    Return ``_meta`` for this object or class
    """
    if not isclass(obj):
        obj = type(obj)
    meta = getattr(obj, '_meta', None)
    return getattr(meta, attr) if attr is not None else meta


