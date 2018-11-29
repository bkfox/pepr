"""
This module provides common widgets that can be reused in multiple
places.

Different attributes on widgets are format()ted at rendering with
``this=self`` in order to allow rendering related to current context
(e.g. related to ``self.object``).

"""
from django.urls import reverse

from .components import Widget, Widgets


class LinkWidget(Widget):
    """
    Widget rendering an url that can either be dynamically reversed or
    directly given.
    """
    tag_name = 'a'
    url = None
    url_name = None
    url_args = None
    url_kwargs = None

    def __init__(self, url=None, url_name=None, url_args=None,
                 url_kwargs=None, **kwargs):
        super().__init__(**kwargs)
        self.url = url
        self.url_name = url_name
        self.url_args = url_args
        self.url_kwargs = url_kwargs

    def get_url_kwargs(self, **kwargs):
        if callable(self.url_kwargs):
            return self.url_kwargs(self, **kwargs)
        return self.url_kwargs

    def get_url(self, **kwargs):
        if self.url:
            return self.get_formatted(self.url, **kwargs)

        url_kwargs = self.get_url_kwargs(**kwargs)
        return reverse(self.url_name, kwargs=url_kwargs)

    def get_tag_attrs(self, **kwargs):
        tag_attrs = super().get_tag_attrs(**kwargs).copy()
        tag_attrs['href'] = self.get_url(**kwargs)
        return tag_attrs


class ActionWidget(Widget):
    """
    Action is a button that send form data over API only. Can be used
    in dropdown menus too.
    """

    url = ''
    """ API url """
    method = 'POST'
    """ API call method """
    action = 'submit'
    """
    Javascript method to call on click.
    """
    target = None

    tag_name = 'button'
    tag_attrs = {'class': 'btn-xs btn-light dropdown-item'}
    # template_name = 'pepr/ui/action_widget.html'

    def get_url(self, **kwargs):
        """ Return url formatted with ``this=self``. """
        return self.get_formatted(self.url, **kwargs)

    def get_tag_attrs(self, **kwargs):
        tag_attrs = super().get_tag_attrs(**kwargs).copy()
        tag_attrs['data-action-url'] = self.get_url(**kwargs)
        if self.action:
            tag_attrs['@click.prevent'] = self.action
        if self.method:
            tag_attrs['data-action-method'] = self.method
        if self.target:
            tag_attrs['data-action-target'] = self.target
        return tag_attrs

    def __init__(self, url=None, method=None, **kwargs):
        if url is not None:
            self.url = url
        if method is not None:
            self.method = method
        super().__init__(**kwargs)


class DropdownWidgets(Widgets):
    """
    Dropdown menu using <b-dropdown>.
    """
    tag_name = 'b-dropdown'

    template_name = 'pepr/ui/dropdown_widgets.html'

    def get_tag_attrs(self, toggle_class='', right=False, **kwargs):
        tag_attrs = super().get_tag_attrs(**kwargs)
        if toggle_class:
            tag_attrs['toggle-class'] = toggle_class
        if right:
            tag_attrs['right'] = right
        return tag_attrs


class DropdownLinkWidget(LinkWidget):
    """ Link as a dropdown item """
    tag_name = 'b-dropdown-item'

