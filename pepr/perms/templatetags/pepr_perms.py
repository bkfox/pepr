"""
Template tags and filters related to permissions.
"""
from django import template

register = template.Library()


@register.filter(name='role')
def do_role(context, user):
    """ Get role for given `context` and `user`.  """
    return context.get_role(user)

