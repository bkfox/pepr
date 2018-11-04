"""
This module provides basic views and mixin for Pepr user interfaces.
It provides the ``Component`` interface (as ``ComponentMixin``), that
can be used to render templates into string; which is usefull to embed
rendered content into webpages.

Based on this component model, and using ``pepr.utils.slots``, this
module also provides an extensible and dynamic widget system that can
be used to offer configurable interfaces (by both developers and end-
users).

It also provides basic website page view with common elements to all
pages rendered on the website.
"""
from django.http import HttpResponse
from django.core.exceptions import ImproperlyConfigured
from django.template import loader
from django.views.generic.base import ContextMixin, TemplateResponseMixin, View
from django.views.generic.detail import SingleObjectMixin

from pepr.perms.models import Accessible, Context
from pepr.perms.views import AccessibleViewMixin
from pepr.utils import slots
# reimport for API
from pepr.utils.slots import Position, Slots


class ComponentMixin(AccessibleViewMixin, TemplateResponseMixin, ContextMixin):
    """
    A Component is an element that aims to be rendered in other views.
    It allows rendering item into a string for this purpose.

    A Component should never handle POST actions, but only be used to
    render data. This must be done at the view level, in order to ensure
    separate concerns.
    """
    template_name = ''
    """
    Name of the template to load from `get_template` can be a list of/a
    single string.
    """
    role = None
    """ Current user role for rendering this component """
    kwargs = None
    """ Extra-kwargs passed to this componenent """
    slots = None
    """ Component's slots """
    object = None
    """ Current object """
    object_list = None
    """ Current object's list """

    def __init__(self, **kwargs):
        super().__init__()
        self.__dict__.update(**kwargs)

    def get_template(self, template_name=None):
        """
        Return Template instance to be used to render the component.

        :py:param str|None template_name: use this `template_name` \
                instead of `self.template_name`.
        """
        name = template_name or self.template_name
        if name is None:
            raise ImproperlyConfigured(
                "no `self.template_name` and no `template_name` given"
            )
        return loader.get_template(name) if isinstance(name, str) else \
                    loader.select_template(name)

    def get_context_data(self, **kwargs):
        kwargs.setdefault('slots', self.slots)
        kwargs.setdefault('object', self.object)
        kwargs.setdefault('object_list', self.object_list)
        return super().get_context_data(**kwargs)

    def render_to_string(self, **kwargs):
        r"""
        Render the component into a string (called by render), override
        this method for specialization instead of 'render()'.

        :py:param \**kwargs: arguments passed to `get_template` and \
                `get_context_data`
        """
        context = self.get_context_data(**kwargs)
        if context is None:
            return ''
        # return self.get_template().template.render(context)
        return self.get_template().render(context)

    def render(self, role, **kwargs):
        """
        Render ComponentMixin into a string and return it
        """
        self.role = role
        self.kwargs = kwargs
        return self.render_to_string(**kwargs)


class Widget(ComponentMixin, slots.SlotItem):
    """ Base class for Widgets """
    # TODO/FIXME: allow requiring more than one permission #enhance
    required_perm = None
    """
    Required permission codename to render the widget. It implies that
    ``sender`` is an Accessible object.
    """
    sender = None
    """ Sender that emitted the signal to render widget """

    def render(self, role, sender=None, **kwargs):
        if self.required_perm:
            if not sender.has_perm(role, self.required_perm):
                return ''

        self.sender = sender
        return super().render(role, sender=sender, **kwargs)


class Widgets(ComponentMixin, slots.Slot):
    """ Slot for widgets """
    tag_name = 'div'
    """
    Tag name for the HTML container; if empty, renders items only.
    """
    tag_attrs = {}
    """
    Extra attributes to add to the container tag.
    """
    template_name = 'pepr/ui/widgets_view.html'

    def __init__(self, tag_name=tag_name, tag_attrs=None,
                 **kwargs):
        super().__init__(**kwargs)
        self.tag_name = tag_name
        self.tag_attrs = tag_attrs or None

    def get_context_data(self, sender, **kwargs):
        """
        :param [WidgetMixin] items: if given, use this list instead of \
            thoses from find_items
        """
        kwargs.setdefault('sender', sender)

        # check items is empty wether it is in `kwargs` or not. Since
        # items is first get from kwargs, use `__setitem__` instead of
        # `setdefault`
        items = kwargs.get('items')
        if items is None:
            items = self.fetch(self.role, **kwargs)
            items = list(
                rendered for rendered in (
                    item.render(self.role, **kwargs)
                    for item in items
                    if isinstance(item, ComponentMixin)
                )
                if rendered
            )

        if not items:
            return
        kwargs['items'] = items

        return super().get_context_data(**kwargs)


class SiteView(AccessibleViewMixin, View):
    """
    Base view for rendering the website. This can be inherited by other
    views in order to have common slots and other things.
    """
    slots = Slots({
        'head': Widgets(''),
        'top': Widgets('nav'),
        'footer': Widgets('footer'),
    })
    can_standalone = True

    def get_context_data(self, *args, **kwargs):
        kwargs.setdefault('slots', self.slots)
        kwargs.setdefault(
            'standalone',
            self.can_standalone and 'standalone' in self.request.GET
        )
        return super().get_context_data(*args, **kwargs)

