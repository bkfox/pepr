# FIXME: optimize -> set property as value, add __prop_method on value


def reset_cache(cl, func, value = None):
    """
    Delete or update cache of a method decorated with `cached_result`.
    """
    key = '__' + func.__name__
    if value is None:
        if hasattr(cl, key):
            delattr(cl, key)
    else:
        setattr(cl, key, value)

def cached_result(func):
    """
    Decorator to allow caching result of a method call as the Django's
    `cached_property` does for instances, but including class methods.

    Through user should be carefull, arguments can be provided to the
    wrapped function whiches will thus be passed only when no cache is
    present.
    """
    key = '__' + func.__name__
    def decorator(cl, *args, **kwargs):
        if not hasattr(cl, key):
            v = func(cl, *args, **kwargs)
            setattr(cl, key, v)
        return getattr(cl, key)

    decorator.reset = lambda value = None: reset_cache(cl, key, value)
    return decorator


# Class property: original code by Mahmoud Abdelkader's answer found on
# StackOverflow #5189699
class ClassProperty:
    """
    Property descriptor used to have class properties.
    """
    def __init__(self, fget, fset=None):
        self.fget = fget
        self.fset = fset

    def __get__(self, obj, cl=None):
        if cl is None:
            cl = type(obj)
        return self.fget.__get__(obj, cl)()

    def __set__(self, obj, value):
        if not self.fset:
            raise AttributeError("can't set attribute")
        type_ = type(obj)
        return self.fset.__get__(obj, type_)(value)

    def setter(self, func):
        if not isinstance(func, (classmethod, staticmethod)):
            func = classmethod(func)
        self.fset = func
        return self


def class_property(func):
    """
    Transform class/static method into a class property. It can be
    combined with `cached_result` in order to cache results
    """
    if not isinstance(func, (classmethod, staticmethod)):
        func = classmethod(func)
    return ClassProperty(func)



