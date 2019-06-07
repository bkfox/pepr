from django.views.generic.base import ContextMixin, View

from ..utils.slots import Slots
from .components import Widgets

__all__ = ['BaseView']


class BaseView(View):
    """
    Provides a standard layout among all different views. It includes
    common slots, and an embedding feature.

    The related template (``pepr/ui/base.html``) can be overridden using
    the following block(s): main.
    """
    slots = Slots([
        Widgets('head', ''),
        Widgets('top', 'nav'),
        Widgets('footer', 'footer'),
    ])
    can_embed = True
    """
    If True, view can be embedded into modals and others. Embeddable
    view renders only their ``main`` block when ``embed`` query is
    passed.
    """

    def get_context_data(self, *args, **kwargs):
        kwargs.setdefault('slots', self.slots)
        kwargs.setdefault('view', self)
        kwargs.setdefault('base_template', 'pepr/ui/base_' + (
            'embed.html' if self.can_embed and 'embed' in self.request.GET else
            'page.html'
        ))
        return super().get_context_data(*args, **kwargs)


