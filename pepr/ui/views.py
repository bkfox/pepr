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

    def render(self, user, super_view=None, **kwargs):
        """
        Render ComponentMixin into a string and return it
        """
        self.current_user = user
        self.super_view = super_view
        self.kwargs = kwargs
        return self.render_to_string(**kwargs)


class ComponentDetailView(View, SingleObjectMixin):
    """
    View used to render a component model (that is ``self.object``).

    Component ``render()`` is called with ``super_view`` set to self,
    and view's ``**kwargs``.
    """
    map_kwargs = tuple()
    """
    List of kwargs argument names that are forwarded to object's
    ``render`` method.
    """

    def render_object(self, request):
        """ Returned rendered component """
        kwargs = {
            k: self.kwargs.get(k) for k in self.map_kwargs
            if k in self.kwargs
        }
        if 'super_view' not in kwargs:
            kwargs['super_view'] = self
        return self.object.render(request.user, **kwargs)

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        return HttpResponse(self.render_object(request))


class WidgetComp(ComponentMixin, slots.SlotItem):
    """ Base class for widgets. """
    pass


class WidgetsComp(ComponentMixin, slots.Slot):
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

    def get_context_data(self, sender=None, items=None, **kwargs):
        """
        :param [WidgetMixin] items: if given, use this list instead of \
            thoses from find_items
        """
        context = super().get_context_data(**kwargs)
        items = items or self.fetch(self.current_user, sender, **kwargs)
        context['tag_name'] = self.tag_name
        context['tag_attrs'] = self.tag_attrs
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
        'head': WidgetsComp(''),
        'top': WidgetsComp('nav'),
        'footer': WidgetsComp('footer'),
    })
    can_standalone = True

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        context['slots'] = self.slots

        if self.can_standalone and 'standalone' in self.request.GET:
            context['standalone'] = True
        return context

