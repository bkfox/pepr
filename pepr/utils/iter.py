import copy

def as_choices(value_attr, label_attr, iterable):
    """
    Iterate over `iterable` and produce tuple that can be used
    as a choice.
    """
    # FIXME: how can we use it lazily / make a lazy version
    return (
        (getattr(obj, value_attr), getattr(obj, label_attr))
            for obj in iterable
    )


