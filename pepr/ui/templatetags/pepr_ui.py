from django import template

register = template.Library()


@register.simple_tag(name='component', takes_context=True)
def do_component(context, component, **kwargs):
    """
    Render the given component here. parent view will be set to the
    current view.

    :param ComponentMixin component: component to render
    :param \*args: args to pass to `component.render`
    :param \**kwargs: kwargs to pass to `component.render`
    """
    if not 'super_view' in kwargs:
        kwargs['super_view'] = context['view']
    return component.render(context['request'], **kwargs)

@register.simple_tag(name="slot", takes_context=True)
def do_slot(context, slot_name, **kwargs):
    """
    Render a WidgetsComp by slot name (using context's "slots"
    attribute).

    :param str slot_name: name of the slot on the container.
    :param \**kwargs: pass thoses values to ``render()``.
    """
    slot = context['slots'][slot_name]
    if not 'super_view' in kwargs:
        kwargs['super_view'] = context['view']
    return slot.render(context['request'], **kwargs)




