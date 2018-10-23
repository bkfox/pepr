from django import template
from django.utils.safestring import mark_safe

register = template.Library()


@register.simple_tag(name='component', takes_context=True)
def do_component(context, component, **kwargs):
    r"""
    Render the given component here. parent view will be set to the
    current view.

    :param ComponentMixin component: component to render
    :param \*args: args to pass to `component.render`
    :param \**kwargs: kwargs to pass to `component.render`
    """
    return component.render(context['user'], **kwargs)


@register.simple_tag(name='slot', takes_context=True)
def do_slot(context, slot_name, sender, **kwargs):
    r"""
    Render a Widgets by slot name (using context's "slots"
    attribute).

    :param str slot_name: name of the slot on the container.
    :param object sender: signal sender.
    :param \**kwargs: pass thoses values to ``render()``.
    """
    slot = context['slots'].get(slot_name)
    if not slot:
        return ''
    return do_component(context, slot, sender=sender, **kwargs)


@register.simple_tag(name='icon')
def do_icon(icon, classes='mr-2 icon'):
    """
    Render an icon, that can either be a FontAwesome icon or path
    to image file. Handles case where ``icon`` is None or empty.

    :param str icon: if it begins with "fa-", then FontAwesome icon,
        otherwise path to image file;
    :param classes: extra css class to add in icon;
    """
    if not icon:
        return ''

    if icon.startswith('fa-'):
        html = '<span class="{icon} {classes}"></span>'
    else:
        html = '<img src="{icon}" class="{classes}">'
    return mark_safe(html.format(
        icon=icon, classes=classes
    ))


