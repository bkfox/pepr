"""
Provides metaclass utils
"""
from django.db import models
from django.db.models.base import ModelBase

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
    items = {}
    """ Registered classes as a dict """
    key = 'id'
    """ Class attribute to use as key """

    def __new__(cls, name, base, attrs):
        cl = super().__new__(cls, name, base, attrs)
        if cls.auto_register:
            cls.register(cl)
        return cl

    @classmethod
    def get_key(cls, cl):
        """
        Return key for a given item
        """
        return getattr(cl, cls.key)

    @classmethod
    def get_base_class(cls):
        """
        Return a class that is excluded from registry or None
        """
        return None

    @classmethod
    def register(cls, cl):
        """
        Register an item
        """
        try:
            key = cls.get_key(cl)
            if cl != cls.get_base_class():
                cls.items[key] = cl
        except NameError:
            pass

    @classmethod
    def unregister(cls, cl):
        """
        Unregister a given item if present
        """
        key = cls.get_key(cl)
        if cls.items.get(key) is cl:
            del cls.items[key]

    @classmethod
    def reset(cls):
        """
        Reset registry and remove all registered items
        """
        self.items = {}

    @classmethod
    def filter(cls, **filters):
        """
        Return items that matches the given filters.
        """
        filters = tuple(filters.items())
        def test(item):
            for k,v in filters:
                if not hasattr(item, k) or getattr(item, k) != v:
                    return False
            return True

        return (item for item in self.items.values() if test(item))

    @classmethod
    def as_choices(cls, value_attr, label_attr, **filters):
        """
        Return an iterator that can be used as ``choices`` attributes on
        a model's field.
        """
        # FIXME: how can we use it lazily
        if filters:
            items = cls.filter(**filters)
        else:
            items = cls.items.values()

        return (
            (getattr(item, value_attr), getattr(item, label_attr))
                for item in items
        )

