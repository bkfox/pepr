from importlib import import_module
import logging

from django.db import models
from django.utils.translation import ugettext_lazy as _

logger = logging.getLogger(__name__)


# TODO: fix this shit
class ReferenceField(models.CharField):
    """
    This fields stores a reference to an object (as long it has a
    ``__m̀odule__`` and a ``__name__``).
    """
    description = _('Reference to an element of a module.')

    def __init__(self, *args, choices=None, targets=None, **kwargs):
        """
        :param iterable target: iterable of modules' objects that can
            be the target of this field. If given, overrides `choices`
            value.
        """
        kwargs['max_length'] = 128
        if targets is None:
            if choices is not None:
                targets = tuple(self.from_db_value(choice[0])
                                for choice in choices)

        if targets is not None:
            choices = self.get_choices(targets)

        self.targets = targets
        super().__init__(*args, choices=choices, **kwargs)

    def get_choices(self, targets):
        return list(
            (target.__name__, self.get_prep_value(target))
            for target in targets
        )

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        kwargs['targets'] = None
        kwargs['choices'] = self.choices
        del kwargs['max_length']
        return name, path, args, kwargs

    def to_python(self, value):
        if not isinstance(value, str):
            return value

        if not value:
            return None

        try:
            module, name = value.rsplit('.', 1)
            module = import_module(module)
            value = getattr(module, name, None)
            return value
        except ImportError as e:
            logger.debug('could not import reference from ', value, ':', e)
            return None

    def from_db_value(self, value, *args, **kwargs):
        return self.to_python(value)

    def value_to_string(self, obj):
        value = self.value_from_object(obj)
        return self.get_prep_value(value)

    def run_validators(self, value):
        pass

    def get_prep_value(self, value):
        if isinstance(value, str):
            return value
        if value is None:
            return ''

        if not hasattr(value, '__name__'):
            logger.warning('get_prep_value: missing attr `__name__` on '
                           "`value`. Use the module's one.")
            return value.__module__
        return value.__module__ + '.' + getattr(value, '__name__')

    def formfield(self, *args, instance=None, **kwargs):
        # value=self.get_prep_value(instance), 
        formfield = super().formfield(*args, **kwargs)
        format_value = self.get_prep_value
        formfield.widget.format_value = format_value
        return formfield


