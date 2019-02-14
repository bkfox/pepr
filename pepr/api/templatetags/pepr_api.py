from django import template
from django.utils.html import escape
from django.utils.safestring import mark_safe

register = template.Library()


@register.simple_tag(name='serialize', takes_context=True)
def do_serialize(context, instance, **init_kwargs):
    """
    Serialize the given object, assuming that ``get_serializer_class()``
    is present on object class and is used to serialize object.

    Serializer is initialized using given ``**init_kwargs``.
    """
    serializer = instance.get_serializer_class()(instance,
                                                 **init_kwargs)
    return serializer.data


