"""
This module provides common widgets that can be reused in multiple
places.

Different attributes on widgets are format()ted at rendering with
``this=self`` in order to allow rendering related to current context
(e.g. related to ``self.object``).

"""
from django.urls import reverse

from .views import Widget, Widgets


class LabelWidget(Widget):
    """
    Display a label
    """
    template_name = 'pepr/widgets/label.html'

    tag = 'label'
    title = ''
    icon = None
    css_class = ''

    def get_title(self):
        """ Return title formatted with ``this=self``. """
        return self.title.format(this=self)


class LinkWidget(LabelWidget):
    """
    Widget rendering an url that can either be dynamically reversed or
    directly given.
    """
    template_name = 'pepr/widgets/link.html'

    tag = 'a'
    url = None
    url_name = None
    url_args = None
    url_kwargs = None

    def get_url_kwargs(self, w):
        return self.url_kwargs

    def get_url(self):
        if self.url:
            return self.url.format(this=self)
        return reverse(self.url_name, kwargs=self.get_url_kwargs(self))

class DropdownLinkWidget(LinkWidget):
    tag = 'b-dropdown-item'

class ActionWidget(LabelWidget):
    """
    Action is a "on-click" button that send form data.
    """
    template_name = 'pepr/widgets/action.html'

    fields = None
    """ hidden input by default """
    action = ''
    """ form action """
    method = 'POST'
    """ form target """
    css_class='btn-xs btn-light'
    """ button css class """

    def get_action(self):
        """ Return action formatted with ``this=self``. """
        return self.action.format(this=self)


