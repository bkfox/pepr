from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.utils.translation import ugettext, ugettext_lazy as _

from model_utils.managers import InheritanceQuerySetMixin

from pepr.perms.models import Accessible, AccessibleQuerySet, Context
from pepr.ui.views import Position, WidgetBase


class WidgetQuerySet(AccessibleQuerySet):
    def slot(self, slot):
        """
        Return widgets for the given slot and ordered by their position.
        """
        return self.filter(slot=slot).order_by('position', 'order')

    def is_enabled(self, is_enabled=True):
        """
        Return enabled widgets.
        """
        return self.filter(is_enabled=is_enabled)


class UserWidget(Accessible, WidgetBase):
    """
    Widget generally configured by user that is stored in database.

    Widget is an accessible, in order to allow filtering based on user's
    privileges.
    """
    POSITION_CHOICES = (
        (int(v), _(k)) for k, v in Position.__members__.items()
    )

    slot = models.CharField(
        _('slot'), max_length=32,
    )
    position = models.PositiveSmallIntegerField(
        _('position'), choices=POSITION_CHOICES,
    )
    order = models.SmallIntegerField(
        _('order'), default=0,
    )
    is_enabled = models.BooleanField(
        _('enable'), default=True,
    )
    title = models.CharField(
        max_length=64, blank=True, null=True,
    )

    objects = WidgetQuerySet.as_manager()


# context can be null in this particular case
UserWidget._meta.get_field('context').blank = True
UserWidget._meta.get_field('context').null = True


