"""
This module provides common widgets that can be reused in multiple
places.

Different attributes on widgets are format()ted at rendering with
``this=self`` in order to allow rendering related to current context
(e.g. related to ``self.object``).

"""
import random

from django.urls import reverse
# FIXME: initialize??? should be done with uuid generator

from .components import Widget, Widgets



class ActionWidget(Widget):
    """
    Widget used to render actions. Each instance must have a unique name
    assigned (if not given, one will be generated).
    """
    name = ''
    """
    A unique identifier for the action instance.
    """
    tag_name = "p-action"
    tag_attrs = {'class': 'btn btn-sm'}

    # when action is rendered without an object, it means it is used as
    # vuejs slot's template. => always return True
    def can(self, role):
        return True


class ActionWidgets(Widgets):
    def can(self, role):
        return True

    def render(self, role, *args, as_data=False, **kwargs):
        if not as_data:
            return super().render(role, *args, **kwargs)

        items = kwargs.get('items') or self.fetch(role=role, **kwargs)
        if items:
            return [item.name
                    for item in items
                    if item.render(role, as_data=True, **kwargs)]
        return []


class ListWidget(Widget):
    """ Render multiple provided items. """
    items = []
    tag_name = 'ul'
    template_name = 'pepr/ui/list_widget.html'

    def get_context_data(self, **kwargs):
        kwargs.setdefault('items', self.items)
        return super().get_context_data(**kwargs)


class UrlWidgetMixin(Widget):
    """
    Provides an assignable url to the widget. Url can be given as string,
    or to reverse using given ``*args`` and ``**kwargs``.
    """
    url = None
    """ Url as a string. """
    url_name = None
    """ Reverse url ``name``. """
    url_kwargs = None
    """ Reverse url ``kwargs``. Can be a ``lambda self, kwargs`` """
    url_attr = 'url'
    """ Tag attribute name to use. If None, do not include it """

    def __init__(self, url=None, url_name=None, url_kwargs=None, **kwargs):
        super().__init__(**kwargs)
        if url:
            self.url = url
        if url_name:
            self.url_name = url_name
        self.url_kwargs = url_kwargs or {}

    def get_url_kwargs(self, **kwargs):
        if callable(self.url_kwargs):
            return self.url_kwargs(self, **kwargs)
        return self.url_kwargs

    def get_url(self, **kwargs):
        if self.url:
            return self.get_formatted(self.url, **kwargs)

        url_kwargs = self.get_url_kwargs(**kwargs)
        return reverse(self.url_name, kwargs=url_kwargs)

    def get_context_data(self, **kwargs):
        if 'url' not in kwargs:
            kwargs['url'] = self.get_url(**kwargs)
        return super().get_context_data(**kwargs)

    def get_tag_attrs(self, tag_attrs, url=None, url_attr=None, **kwargs):
        url_attr = url_attr or self.url_attr
        if url and url_attr and url_attr not in tag_attrs:
            tag_attrs[url_attr] = url
        return super().get_tag_attrs(tag_attrs, **kwargs)


class LinkWidget(UrlWidgetMixin):
    """
    Widget rendering an url that can either be dynamically reversed or
    directly given.
    """
    tag_name = 'a'
    url_attr = 'href'


class DropdownWidgets(Widgets):
    """
    Dropdown menu using ``<b-dropdown>``.
    """
    toggle_class = None

    tag_name = 'b-dropdown'
    template_name = 'pepr/ui/dropdown_widgets.html'

    def get_tag_attrs(self, tag_attrs, toggle_class=None, **kwargs):
        toggle_class = toggle_class or self.toggle_class
        if toggle_class:
            tag_attrs.setdefault('toggle-class', toggle_class)
        return super().get_tag_attrs(tag_attrs, **kwargs)


class DropdownLinkWidget(LinkWidget):
    """ Link as a ``<b-dropdown-item>`` """
    tag_name = 'b-dropdown-item'


