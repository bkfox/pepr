from django.views.generic.base import ContextMixin, View

from ..utils.slots import Slots
from .components import Widgets

__all__ = ['SiteView']


class SiteView(ContextMixin, View):
    """
    Base view for rendering the website. This can be inherited by other
    views in order to have common slots and other things.
    """
    slots = Slots([
        Widgets('head', ''),
        Widgets('top', 'nav'),
        Widgets('foorter', 'footer'),
    ])
    can_standalone = True

    def get_context_data(self, *args, **kwargs):
        kwargs.setdefault('slots', self.slots)
        kwargs.setdefault(
            'standalone',
            self.can_standalone and 'standalone' in self.request.GET
        )
        kwargs.setdefault('view', self)
        return super().get_context_data(*args, **kwargs)

