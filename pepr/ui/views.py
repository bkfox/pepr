from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader, Template, Context
from django.views.generic.base import ContextMixin, TemplateResponseMixin, View
from django.views.generic.detail import SingleObjectMixin

from pepr.utils import slots
# reimport for API
from pepr.utils.slots import Position, Slots


class ComponentMixin(TemplateResponseMixin,ContextMixin):
    """
    A Component is an element that aims to be rendered in other views.
    It allows rendering item into a string for this purpose.
    """
    template_name = ''
    """
    Name of the template to load from `get_template` can be a list of/a
    single string.
    """

    request = None
    super_view = None
    kwargs = None

    def get_template(self, template_name = None):
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

    def render_to_string(self, request, **kwargs):
        """
        Render the component into a string (called by render), override
        this method for specialization instead of 'render()'.

        :py:param django.http.Request http request
        :py:param \**kwargs: arguments passed to `get_template` and \
                `get_context_data`
        """
        context = self.get_context_data(**kwargs)
        if context is None:
            return ''
        return self.get_template().render(context)

    def render(self, request, super_view = None, **kwargs):
        """
        Render ComponentMixin into a string and return it
        """
        self.request = request
        self.super_view = super_view
        self.kwargs = kwargs
        return self.render_to_string(request, **kwargs)

class ComponentDetailView(View,SingleObjectMixin):
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
            k: kwargs.get(k) for k in self.map_kwargs
                if k in kwargs
        }
        if not 'super_view' in kwargs:
            kwargs['super_view'] = self
        return self.object.render(request, **kwargs)

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        return HttpResponse(self.render_object(request))


class WidgetView(ComponentMixin, slots.SlotItem):
    """ Base class for widgets. """
    pass


class WidgetsView(ComponentMixin, slots.Slot):
    tag_name = 'div'
    """
    Tag name for the HTML container; if empty, renders items only.
    """
    tag_attrs = {}
    """
    Extra attributes to add to the container tag.
    """
    template_name = 'pepr/ui/widgets_view.html'


    def __init__(self, tag_name = tag_name, tag_attrs = None,
                    **kwargs):
        super().__init__(**kwargs)
        self.tag_name = tag_name
        self.tag_attr = tag_attrs or None

    def get_context_data(self, sender = None, items = None,
            **kwargs):
        """
        :param [WidgetMixin] items: if given, use this list instead of \
            thoses from find_items
        """
        context = super().get_context_data(**kwargs)

        items = items or self.fetch(self.request, sender, **kwargs)
        context['tag_name'] = self.tag_name
        context['tag_attrs'] = self.tag_attrs
        context["items"] = (
            item.render(self.request, **kwargs) for item in items
            if isinstance(item, ComponentMixin)
        )
        return context


