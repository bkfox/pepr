from importlib import import_module
import logging

from django.db import models
from django.utils.translation import ugettext_lazy as _

logger = logging.getLogger(__name__)


class ReferenceValue(str):
    def __new__(cls, value, *args, target=None, **kwargs):
        if target is not None:
            value = cls.from_target(target)
        obj = str.__new__(cls, value, *args, **kwargs)
        return obj

    @property
    def target(self):
        """ Return reference's target """
        if self:
            try:
                module, name = self.rsplit('.', 1)
                module = import_module(module)
                return getattr(module, name, None)
            except ModuleNotFoundError as e:
                logger.debug('could not import reference from ', self, ':', e)

    @staticmethod
    def from_target(target):
        """ Return a ``str`` from the given target object.  """
        if target is None:
            return ''

        if not hasattr(target, '__name__'):
            raise ValueError(
                "ReferenceValue's target does not have a `__name__`.")
        return target.__module__ + '.' + getattr(target, '__name__')


# TODO: fix this shit
class ReferenceField(models.CharField):
    """
    Store a reference to a module's object with a ``__m̀odule__`` and a
    ``__name__``. The mapped object is an instance of ReferenceValue,
    whose referenced object is available as ``field.target``.
    """
    description = _('Reference to an element of a module.')

    def __init__(self, *args, choices=None, targets=None, **kwargs):
        """
        :param iterable targets: iterable of modules' objects that can
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
        return [(target.__name__, ReferenceValue.from_target(target))
                for target in targets]

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        kwargs['targets'] = None
        kwargs['choices'] = self.choices
        del kwargs['max_length']
        return name, path, args, kwargs

    def to_python(self, value):
        return ReferenceValue(super().to_python(value))

    def from_db_value(self, value, *args, **kwargs):
        return self.to_python(value)

    def value_to_string(self, obj):
        value = self.value_from_object(obj)
        return self.get_prep_value(value)

    def run_validators(self, value):
        pass

    def get_prep_value(self, value):
        if isinstance(value, (str, None)):
            return ReferenceValue(value or '')
        return ReferenceValue(target=value)

    def formfield(self, *args, instance=None, **kwargs):
        # value=self.get_prep_value(instance), 
        formfield = super().formfield(*args, **kwargs)
        format_value = self.get_prep_value
        formfield.widget.format_value = format_value
        return formfield


