from django import template

register = template.Library()


@register.simple_tag(name='component')
def do_component(component, role, *args, **kwargs):
    """ Render component with provided calling arguments. """
    return component.render(role)



