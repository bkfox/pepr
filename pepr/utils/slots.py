""" This module provides basic mechanism for slots.  """
from enum import IntEnum
from itertools import chain

from django.dispatch import Signal

from ..utils.register import Register


class Position(IntEnum):
    """
    Defines position for widgets inside their container.
    """
    Before = -1
    Default = 0
    After = 1


class SlotItem:
    """
    Base class for items fetched from a Slot.

    Position is the general position in the list. It is ensured that all
    items with smaller position value will be rendered before thoses
    with higher ones, such as:

        [ Before items, Default items, After items ]

    Order is a the priority between items of the same position.
    """
    position = Position.Default
    """
    Position in the list of items.
    """
    order = 0
    """
    Sort order in the rendered items
    """
    predicate = None
    """
    If given, slot is fetched if `predicate(slot_item, **signal_kwargs)`
    is True only.
    """

    def __init__(self, position=Position.Default, order=0, pred=None,
                 **kwargs):
        self.position = position
        self.order = order
        self.predicate = pred
        super().__init__(**kwargs)

    def __lt__(self, b):
        return self.position < b.position or \
                (self.position == b.position and self.order < b.order)


class Slot:
    """
    Provides a generic container for multiple items. Items are retrieved
    using the ``fetch()`` method which will trigger a signal to get them.
    Items are sorted using their position and order.

    Slot can be attached to a Slots register using its ``slot_name`` as
    the key.
    """
    name = None
    """
    Slot name (used as key in Slots register)
    """
    items = None
    """
    List of items to add when ``fetch()`` is called.
    """
    signal = None
    """
    Signal used to gather items that have to be rendered, call:

        ```
        signal(sender = Sender, **signal_args)
        ```

    Return value of receivers can either be None or an item to add to
    the fetched items.
    """
    signal_args = ['request', 'slot', 'items']
    """ Signal arguments """

    def __init__(self, name=None, signal_args=None, items=None, **kwargs):
        """
        :param [] signal_args: extra arguments for the signal instance.
        """
        self.name = name
        self.items = items or []
        self.signal = Signal(self.signal_args) \
            if signal_args is None else \
            Signal(self.signal_args + signal_args)
        super().__init__(**kwargs)

    def add(self, item):
        """ Add an item to items list """
        self.items.append(item)
        self.items.sort()

    def remove(self, item):
        """ Remove an item from items list """
        self.items.remove(item)

    def connect(self, *args, **kwargs):
        """ Register receiver to this Slot (forward call to signal) """
        self.signal.connect(*args, **kwargs)

    def disconnect(self, *args, **kwargs):
        """ Remove receiver from this Slot (forward call to signal) """
        self.signal.disconnect(*args, **kwargs)

    def trigger(self, sender, **signal_kwargs):
        """ Send signal and return result """
        slot = signal_kwargs.get('slot', self)
        if self.signal.has_listeners(sender):
            return self.signal.send(slot=slot, sender=sender, **signal_kwargs)
        return tuple()

    def fetch(self, sender=None, items=None, **signal_kwargs):
        r"""
        Gather items by triggering signal, and return them sorted by
        priority as an iterator.

        :param sender: signal sender (if None, use self)
        :param items: add thoses items to the returned ones
        :param \**signal_kwargs: arguments to pass to signal trigger
        """
        items = items or []
        results = (
            v for r, v in self.trigger(
                sender, items=items, **signal_kwargs)
            if isinstance(v, SlotItem)
        )

        # TODO/FIXME: defaults for self.items?
        items = (i for i in chain(self.items, items, results)
                 if i.predicate is None or
                 i.predicate(i, **signal_kwargs))

        # when there is only self.items, we return them immediately
        # since they are yet sorted.
        if next(results, None) is not None and not items:
            return items
        return sorted(items)


class Slots(Register):
    """
    Defines slots of `itemsSlot` instances, in order to use
    them from templates.
    """
    entry_key_attr = 'name'

    def __init__(self, *import_list, **kwargs):
        r"""
        :param \*import_list: list of Slots|dict to copy.
        """
        super().__init__(**kwargs)
        for slots in import_list:
            self.update(slots)

    def connect(self, receiver):
        """ Connect a given receiver to all slots """
        for slot in self.entries:
            slot.connect(receiver)

    def disconnect(self, receiver):
        """ Disconnect a receiver from all slots """
        for slot in self.entries:
            slot.disconnect(receiver)

    def fetch(self, *names, _pred=None, _strict=False, **kwargs):
        """
        Fetch and return slots filtered using given arguments.
        ``**kwargs`` is passed down to ``fetch()``.
        """
        slots = self.filter(*names, pred=_pred, strict=_strict)
        return {name: slot.fetch(**kwargs) for name, slot in slots}

