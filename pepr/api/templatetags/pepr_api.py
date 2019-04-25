from django import template
from django.utils.html import escape
from django.utils.safestring import mark_safe

register = template.Library()


@register.simple_tag(name='serialize', takes_context=True)
def do_serialize(context, instance, serializer_class=None, **init_kwargs):
    """
    Serializer ``instance`` using given ``serializer_class``(if None,
    assume and use ``instance.get_serializer_class``.
    Return the serialized data.

    Serializer is initialized using given ``**init_kwargs``.
    """
    if not 'context' in init_kwargs:
        init_kwargs['context'] = {'request': context['request']}
    else:
        init_kwargs['context'].setdefault('request', context['request'])

    serializer_class = instance.get_serializer_class() \
        if serializer_class is None else serializer_class
    return serializer_class(instance, **init_kwargs).data

