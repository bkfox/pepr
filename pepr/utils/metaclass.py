"""
Provides metaclass utils
"""
from django.db import models
from django.db.models.base import ModelBase

from pepr.utils import register
from pepr.utils.functional import cache_method, class_property


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


class RegisterMetaMeta(type):
    """ Metaclass of metaclass! """
    def __new__(cls, name, bases, attrs):
        cl = super().__new__(cls, name, bases, attrs)
        cl.register = cl.register_class(entry_key_attr=cl.entry_key_attr)
        return cl

    # __getattr__ and class level will not be called when using super()
    # proxy objects (cf. SO#12047847)


class RegisterMeta(type,metaclass=RegisterMetaMeta):
    """
    Metaclass that register classes by a given key. It can exclude a class
    from the registry if some is returned from `get_base_class()`
    """
    register_class = register.Register
    """ Class to use as register """
    entry_key_attr = 'id'
    """ Register's `key` attribute  """
    register = None

    def __new__(cls, name, base, attrs):
        cl = super().__new__(cls, name, base, attrs)
        try:
            if cls.should_add(cl):
                cls.add(cl)
        except NameError:
            pass
        return cl

    @classmethod
    def should_add(cls, cl):
        """ Return True if this class should be registered """
        return cl != cls.get_base_class()

    @classmethod
    def get_base_class(cls):
        """
        Return a class that is excluded from registry or None
        """
        return None

    @classmethod
    def add(cls, cl, key=None, force=None):
        return cls.register.add(cl, key, force)

    @classmethod
    def remove(cls, cl):
        return cls.register.remove(cl)

    @classmethod
    def get(cls, key, default=None):
        return cls.register.get(key, default)

    @classmethod
    def clear(cls):
        return cls.register.clear()

    @classmethod
    def values(cls):
        return cls.register.values()

