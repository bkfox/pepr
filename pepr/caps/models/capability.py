from __future__ import annotations

from django.core.exceptions import PermissionDenied
from django.db import models
from django.utils.translation import ugettext_lazy as _, gettext as __


class Capability(models.Model):
    """
    A single capability. Provide permission for a specific action.
    Capability are stored as unique for each action/permission/max_share
    couple.
    """
    name = models.CharField(_('Action'), max_length=32, db_index=True)
    max_share = models.PositiveIntegerField(
        _('Maximum Shares'), default=0)

    def can_share(self) -> bool:
        """ Return True if this capability can be shared """
        return self.max_share > 0

    def derive(self) -> Capability:
        """
        Derive a new capability from self (without checking existence in
        database).
        """
        if self.max_share < 1:
            raise PermissionDenied(__('can not share capability {name}')
                                   .format(name=self.name))
        return Capability(name=self.name, max_share=self.max_share-1)

    def is_derived(self, max_share: int, name: str = None) -> bool:
        """
        Return True if capability contains a capability with provided
        fields.

        3 rules defines a contained capability:
        - capability permission must be lower or equal to permission
        - capability max_share must be lower to max_share
        - capability must have the same name
        """
        return (name is None or self.name == name) and \
            self.max_share > max_share

    def __contains__(self, other: Capability):
        """
        Return True if other `capability` is contained by `self`.
        """
        return self.is_derived(other.max_share, other.name)

    class Meta:
        unique_together = ('name', 'max_share')
