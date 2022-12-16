from collections.abc import Iterable

from django.core.exceptions import PermissionDenied
from django.db import models
from django.db.models import Q
from django.utils.translation import ugettext_lazy as _, gettext as __


__all__ = ('Capabilities',)


from .capability import Capability


class Capabilities(models.Model):
    """ Handle a set of capabilities. """
    capabilities = models.ManyToManyField(Capability, models.CASCADE,
                                          verbose_name=_('Capabilities'))

    def is_subset(self, subset: Iterable[Capability]) -> bool:
        """
        Return True if `capabilities` iterable is a subset of self.
        """
        capabilities = {c.name: c for c in self.capabilities}
        for item in subset:
            capability = capabilities.get(item.name)
            if not capability or item not in capability:
                return False
        return True

    def share(self, capabilities: Iterable[Capability], save: bool = False) \
            -> list[Capability]:
        """
        Create a subset of this capability based on capabilities' names
        iterator as `(name, max_share)`.
        Return an array of Capability instances.
        """
        by_id = {c.name: c for c in self.by_id}
        subset = []

        query = None
        for name, max_share in sorted(capabilities, key=lambda n, _: n):
            if not by_id:
                raise PermissionDenied(__('{} not found.').format(name))

            capability = by_id[name]
            if capability is None:
                raise PermissionDenied(__('{} not found.').format(name))
            if capability.max_share < 1 or capability.max_share < max_share:
                raise PermissionDenied(__('{} can not be shared').format(name))
            subset.append((name, max_share or 0, capability))

            predicate = Q(name=name, max_share=capability.max_share)
            query = (query | predicate) if query else predicate

        qs = Capability.objects.filter(query)
        in_db = {r.name for r in qs}
        created = [cap.derive(perm) for name, perm, cap in subset
                   if name not in in_db]
        if save and created:
            Capability.objects.bulk_create(created)
        return created + list(qs)

    class Meta:
        abstract = True
