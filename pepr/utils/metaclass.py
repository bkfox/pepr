"""
Provides metaclass utils
"""
from django.db import models
from django.db.models.base import ModelBase

from pepr.utils import register
from pepr.utils.functional import cached_result, class_property


class GenericMeta(ModelBase):
    """
    Metaclass usable for classes that can either or not be models. To
    use it, just derive your metaclass from this one, which will handle
    the creation of the class accordingly.

    For example, `foxcms.utils.Optable` should be derivable by both models
    and non-models. Its metaclass `foxcms.utils.OptableMeta` just
    inherits from `GenericMeta` to handle that shit.
    """
    default_meta = type
    """
    Metaclass to use for non-model classes.
    """

    def __new__(cls, name, bases, attrs):
        for base in bases:
            if issubclass(base, models.Model):
                return ModelBase.__new__(cls, name, bases, attrs)
        return cls.default_meta.__new__(cls, name, bases, attrs)


class RegisterMeta(type):
    """
    Metaclass that register classes by a given key. It can exclude a class
    from the registry if some is returned from `get_base_class()`
    """
    auto_register = True
    """ If True, automatically register new classes """
    register_class = register.Register
    """ Class to use as register """
    key = 'id'
    """ Register's `key` attribute  """

    @class_property
    @cached_result
    def register(cls):
        return cls.register_class(key = cls.key)

    def __new__(cls, name, base, attrs):
        cl = super().__new__(cls, name, base, attrs)
        try:
            if cls.auto_register and cl != cls.get_base_class():
                cls.add(cl)
        except NameError:
            pass
        return cl

    @classmethod
    def get_base_class(cls):
        """
        Return a class that is excluded from registry or None
        """
        return None

    @classmethod
    def add(cls, cl, key = None):
        return cls.register.add(cl, key)

    @classmethod
    def remove(cls, cl):
        return cls.register.remove(cl)

    @classmethod
    def get(cls, value):
        return cls.register.get(value)

    @classmethod
    def clear(cls):
        return cls.register.clear()

    @classmethod
    def iter(cls):
        return cls.register.iter()

