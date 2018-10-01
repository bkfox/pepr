# FIXME: optimize -> set property as value, add __prop_method on value


def cache_method(func):
    """
    Cache result of a method, including at class level. It assumes that
    input parameters wont change (look at `functools.lru_cache` for
    such usage).
    """
    key = '__cache_' + func.__name__
    def decorator(cl, *args, _cache_reset=False, **kwargs):
        # use on dict level: avoid clash on class inheritance
        if _cache_reset or (key not in cl.__dict__):
            v = func(cl, *args, **kwargs)
            setattr(cl, key, v)
            decorator.reset = lambda value=None: delattr(cl, key)
        return getattr(cl, key)

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
    combined with `cache_method` in order to cache results
    """
    if not isinstance(func, (classmethod, staticmethod)):
        func = classmethod(func)
    return ClassProperty(func)



