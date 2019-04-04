"""
This module provides common widgets that can be reused in multiple
places.

Different attributes on widgets are format()ted at rendering with
``this=self`` in order to allow rendering related to current context
(e.g. related to ``self.object``).

"""
from django.urls import reverse

from .components import Widget, Widgets


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


class ActionWidget(UrlWidgetMixin):
    """
    Action is a button that send form data over API only. Can be used
    in dropdown menus too. The widget attribute ``url`` points to an API
    url.
    """
    method = 'POST'
    """ API call method """
    action = 'request'
    """ javascript method to call on click. """
    handler = None
    """ action request handler """
    data = None
    """ item related to this action """

    tag_name = 'p-action'
    tag_attrs = {'class': 'btn-xs btn-light dropdown-item'}
    url_attr = 'path'
    # template_name = 'pepr/ui/action_widget.html'

    def get_tag_attrs(self, tag_attrs, **kwargs):
        # FIXME: let user to decide wether he uses binding or value
        #        for attributes => overwrite tag_attrs
        for k in ('action', 'method', 'handler'):
            tag_attrs.setdefault(k, getattr(self, k, None))
        if self.item:
            tag_attrs.setdefault(':item', self.item)
        return super().get_tag_attrs(tag_attrs, **kwargs)

    def __init__(self, *args, method=None, **kwargs):
        if method is not None:
            self.method = method
        super().__init__(*args, **kwargs)


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


