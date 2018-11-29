from django.db import models
from django.utils.translation import ugettext_lazy as _

from pepr.perms.models import Accessible, AccessibleQuerySet
from pepr.ui.components import Position
from pepr.utils.fields import ReferenceField


class UserWidgetQuerySet(AccessibleQuerySet):
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


class UserWidget(Accessible):
    """
    Widget generally configured by user that is stored in database.

    Widget is an accessible, in order to allow filtering based on user's
    privileges.
    """
    POSITION_CHOICES = (
        (int(v), _(k)) for k, v in Position.__members__.items()
    )

    widget = ReferenceField(
        _('widget'),
        help_text=_('Widget class used to render component')
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
    text = models.CharField(
        max_length=64, blank=True, null=True,
    )

    objects = UserWidgetQuerySet.as_manager()

    widget_initkwargs = ('slot', 'position', 'order', 'text')

    def as_widget(self):
        """
        Return UserWidget as a widget.
        """
        return self.widget(
            **{k: getattr(self, k) for k in self.widget_initkwargs},
            user_widget=self
        )


# context can be null in this particular case
UserWidget._meta.get_field('context').blank = True
UserWidget._meta.get_field('context').null = True


