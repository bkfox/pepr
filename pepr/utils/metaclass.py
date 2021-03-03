"""
Provides metaclass utils
"""
from django.db import models
from django.db.models.base import ModelBase

from ..utils import register

__all__ = ['GenericMeta', 'RegisterMeta']


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
                return ModelBase.__new__(name, bases, attrs)
        return cls.default_meta.__new__(name, bases, attrs)


class RegisterMeta(type,register.RegisterClass):
    """
    Register of the classes created by this metaclass when ``should_add``
    returns True.
    """
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
        Return a class that is excluded from registry or None.
        """
        return None

