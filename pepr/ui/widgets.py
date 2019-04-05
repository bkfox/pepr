"""
This module provides common widgets that can be reused in multiple
places.

Different attributes on widgets are format()ted at rendering with
``this=self`` in order to allow rendering related to current context
(e.g. related to ``self.object``).

"""
from django.urls import reverse
# FIXME: initialize??? should be done with uuid generator
import random

from .components import Widget, Widgets


class ActionWidget(Widget):
    name = ''
    """
    A unique identifier for the action instance.
    """
    tag_name = "p-action"
    tag_attrs = {'class': 'btn-xs btn-light dropdown-item'}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.name:
            self.name = '{}-{}'.format(self.text or type(self).__name__,
                                       str(random.random())[2:])

    def get_tag_attrs(self, *args, **kwargs):
        tag_attrs = super().get_tag_attrs(*args, **kwargs)
        tag_attrs.setdefault('name', self.name)
        return tag_attrs

    def render(self, role, *args, as_data=False, **kwargs):
        if as_data:
            obj = kwargs.get('object', self.object)
            return self.can_obj(role, obj) if obj else self.can(role)
        return super().render(role, *args, **kwargs)


class ActionWidgets(Widgets):
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


class CollectionWidget(ListWidget):
    """
    Render the ``<pepr-collection>`` javascript component, used to
    dynamically and manage render collection of items.
    """
    tag_name = 'pepr-collection'
    id_attr = None
    sort_attr = None

    def get_tag_attr(self, tag_attrs, id_attr=None, sort_attr=None,
                     **kwargs):
        tag_attrs.setdefault('id_attr', id_attr or self.id_attr)
        tag_attrs.setdefault('sort_attr', sort_attr or self.sort_attr)
        return super().get_tag_attrs(tag_attrs, **kwargs)


class BoundCollectionWidget(Widget):
    """
    Collection that can be dynamically updated from server and observe
    items updates.
    """
    tag_name = 'pepr-bound-collection'


