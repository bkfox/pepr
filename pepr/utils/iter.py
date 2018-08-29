import copy


class FilterIter:
    """
    Iterator that handles filtering over its values and other
    cool stuffs.
    """
    objs = None
    filters = None

    def __init__(self, objs):
        self.filters = ()
        self.objs = objs if not isinstance(objs, dict) else \
                     objs.values()

    def clone(self):
        """
        Make a shallow copy of iter.
        """
        return copy.copy(self)

    def filter(self, **filters):
        """
        Add filters, as { 'attribute': 'value' }, where value must
        be a either a compare value or a lambda(obj, attr).

        :py:return: self
        """
        self.filters = self.filters + tuple(filters.items())
        return self

    def sort(self, key):
        pass

    def as_choices(self, value_attr, label_attr):
        """
        Return an iterator that can be used as ``choices`` attributes on
        a model's field.
        """
        # FIXME: how can we use it lazily / make a lazy version
        return (
            (getattr(obj, value_attr), getattr(obj, label_attr))
                for obj in self
        )

    def test_obj(self, obj):
        """
        Run test in iterations
        """
        for k,v in self.filters:
            # v as callable
            if callable(v):
                attr = getattr(obj, k) if hasattr(obj, k) else None
                if not v(obj, attr):
                    return False
                continue

            # v as a value
            if not hasattr(obj, k) or getattr(obj, k) != v:
                return False
        return True

    def __iter__(self):
        if self.filters:
            return filter(self.test_obj, self.objs)
        return (o for o in self.objs)

    def __next__(self):
        """ Always returns first filtered item """
        return next(self.__iter__())


