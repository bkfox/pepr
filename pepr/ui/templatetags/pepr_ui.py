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
    if 'super_view' not in kwargs:
        kwargs['super_view'] = context['view']
    return component.render(context['user'], **kwargs)


@register.simple_tag(name='slot', takes_context=True)
def do_slot(context, slot_name, **kwargs):
    r"""
    Render a WidgetsComp by slot name (using context's "slots"
    attribute).

    :param str slot_name: name of the slot on the container.
    :param \**kwargs: pass thoses values to ``render()``.
    """
    slot = context['slots'].get(slot_name)
    if not slot:
        return ''
    return do_component(context, slot, **kwargs)

@register.simple_tag(name='icon')
def do_icon(icon, classes=''):
    if icon.startswith('fa-'):
        html = '<span class="{icon} {classes}"></span>'
    else:
        html = '<img src="{icon}" class="{classes}">'

    return mark_safe(html.format(
        icon=icon, classes=classes
    ))


