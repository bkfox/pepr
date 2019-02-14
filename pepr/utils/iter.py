import copy

# TODO: lazy iter

def as_choices(value_attr, label_attr, iterable):
    """
    Iterate over `iterable` and produce iterable that can be used
    as a model field's choice.
    """
    return (
        (getattr(obj, value_attr), getattr(obj, label_attr))
            for obj in iterable
    )

