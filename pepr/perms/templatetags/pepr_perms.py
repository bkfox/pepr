"""
Template tags and filters related to permissions.
"""
from django import template

register = template.Library()


@register.filter(name='role')
def do_role(context, user):
    """ Get role for given `context` and `user`.  """
    return context.get_role(user)

@register.filter(name="is_granted")
def do_is_granted(role, perm):
    return role.is_granted(perm)

