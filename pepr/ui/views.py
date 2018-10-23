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
from pepr.utils import slots
# reimport for API
from pepr.utils.slots import Position, Slots


class ComponentMixin(TemplateResponseMixin, ContextMixin):
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
    current_user = None
    """ Current user rendering this component """
    kwargs = None
    """ Extra-kwargs passed to this componenent """

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
        context['user'] = self.current_user
        context['slots'] = getattr(self, 'slots', None)
        # return self.get_template().template.render(context)
        return self.get_template().render(context)

    def render(self, current_user, **kwargs):
        """
        Render ComponentMixin into a string and return it
        """
        self.current_user = current_user
        self.kwargs = kwargs
        return self.render_to_string(**kwargs)


class WidgetBase(ComponentMixin, slots.SlotItem):
    """ Base class for both Widget and Widget """
    # TODO: allow requiring more than one permission
    required_perm = None
    """
    Required permission codename to render the widget. It implies that
    ``sender`` is an Accessible object.
    """
    object = None
    """ Related object if any. """
    object_kwargs_attr = 'sender'
    """
    Attribute in render's ``**kwargs`` that is used to pass a related
    object.
    """

    def get_context(self, context=None, **kwargs):
        """
        Return permission Context.
        """
        if not context and isinstance(self.object, Accessible):
            return self.object.related_context
        return context

    def should_render(self, **kwargs):
        """
        Return True if widget should be rendered. By default it tests
        over ``required_perms`` if any is given.
        """
        if not self.required_perm:
            return True
        if not self.current_context:
            return False

        return self.current_context.has_perm(
            self.current_user, self.required_perm,
            type(self.object) if isinstance(self.object, Accessible) else
            None
        )

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['context'] = self.current_context
        context['object'] = self.object
        return context

    def render_to_string(self, **kwargs):
        if not self.should_render(**kwargs):
            return ''
        return super().render_to_string(**kwargs)

    def render(self, user, **kwargs):
        self.object = kwargs.get(self.object_kwargs_attr)
        self.current_context = self.get_context(**kwargs)
        return super().render(user, **kwargs)


class Widget(WidgetBase):
    """ Base class for widgets. """
    def __init__(self, **kwargs):
        self.__dict__.update(**kwargs)


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
        self.tag_attr = tag_attrs or None

    def get_context_data(self, sender, items=None, **kwargs):
        """
        :param [WidgetMixin] items: if given, use this list instead of \
            thoses from find_items
        """
        context = super().get_context_data(**kwargs)
        items = items or self.fetch(self.current_user, sender, **kwargs)
        context['tag_name'] = self.tag_name
        context['tag_attrs'] = self.tag_attrs

        kwargs['sender'] = sender
        context["items"] = (
            item.render(self.current_user, **kwargs) for item in items
            if isinstance(item, ComponentMixin)
        )
        return context


class SiteView(View):
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
        context = super().get_context_data(*args, **kwargs)
        context['slots'] = self.slots

        if self.can_standalone and 'standalone' in self.request.GET:
            context['standalone'] = True
        return context

