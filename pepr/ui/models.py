from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.utils.translation import ugettext, ugettext_lazy as _

from model_utils.managers import InheritanceQuerySetMixin

from pepr.perms.models import Accessible, AccessibleQuerySet, Context
from pepr.ui.views import Position, WidgetComp


class WidgetQuerySet(AccessibleQuerySet):
    def enabled(self, enabled = True):
        return self.filter(enable = enabled)


class Widget(Accessible,WidgetComp):
    """
    A Widget is a WidgetComp that can be stored in database in order
    to allow users to configure interface.

    Widget is an accessible, in order to allow filtering based on user's
    privileges.
    """
    POSITION_CHOICES = (
        (v, _(k)) for k,v in Position.__members__.items()
    )

    slot = models.CharField(
        _('slot'),
        max_length = 32,
    )
    position = models.PositiveSmallIntegerField(
        _('position'),
        choices = POSITION_CHOICES,
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

    objects = WidgetQuerySet.as_manager()


# context can be null in this particular case
Widget._meta.get_field('context').blank = True
Widget._meta.get_field('context').null = True


