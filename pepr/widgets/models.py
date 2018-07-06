from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.utils.translation import ugettext, ugettext_lazy as _

from model_utils.managers import InheritanceQuerySet

from pepr.widgets.views import Position, WidgetView


class WidgetQuerySet(InheritanceQuerySet):
    #def container(self, container, slot = None):
    #    """
    #    Filter for the given Content (and slot)
    #    """
    #    qs = self.filter(container = container)
    #    return qs.filter(slot = slot) if slot else qs

    def enabled(self, enabled = True):
        return self.filter(enable = enabled)


WidgetManager = models.Manager.from_queryset(WidgetQuerySet)


class Widget(WidgetView):
    objects = WidgetManager()

    #container = models.ForeignKey(
    #    Container,
    #    blank = True, null = True,
    #    on_delete = models.CASCADE,
    #    verbose_name = _('content'),
    #    help_text = _('if empty, applies to a global level'),
    #)
    slot = models.CharField(
        _('slot'),
        max_length = 32,
    )
    position = models.PositiveSmallIntegerField(
        _('position'),
        choices = ( (v, _(k))
            for k,v in WidgetPosition.__members__.items()
        ),
    )
    order = models.SmallIntegerField(
        _('order'),
        default = 0,
    )
    enable = models.BooleanField(
        _('enable'),
        default = True,
    )
    title = models.CharField(
        max_length = 64,
        blank = True, null = True,
    )


