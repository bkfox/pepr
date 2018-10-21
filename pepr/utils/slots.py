""" This module provides basic mechanism for slots.  """
from enum import IntEnum
import itertools

from django.dispatch import Signal

from pepr.utils.register import Register


class Position(IntEnum):
    """
    Defines position for widgets inside their container.
    """
    Before = -1
    Default = 0
    After = 1


class SlotItem:
    """
    Item used to render content in a container. It also holds priority
    informations.

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
    slot_name = None
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

    def __init__(self, signal_args=None, items=None, **kwargs):
        """
        :param [] signal_args: extra arguments for the signal instance.
        """
        if kwargs:
            self.__dict__.update(kwargs)
        self.items = items or []
        self.signal = Signal(self.signal_args + (signal_args or []))

    def add(self, item):
        """ Add an item to items list """
        self.items.append(item)
        self.items.sort()

    def remove(self, item):
        """ Remove an item from items list """
        del self.items[item]

    def connect(self, *args, **kwargs):
        """ Register receiver to this Slot (forward call to signal) """
        self.signal.connect(*args, **kwargs)

    def disconnect(self, *args, **kwargs):
        """ Remove receiver from this Slot (forward call to signal) """
        self.signal.disconnect(*args, **kwargs)

    def trigger(self, **signal_args):
        """ Send signal and return result """
        return self.signal.send(sender=self, **{
            k: v for k, v in signal_args.items()
            if k in self.signal_args
        })

    def fetch(self, user, sender=None, items=None, **kwargs):
        r"""
        Gather items by triggering signal, and return them sorted by
        priority as an iterator.

        :param auth.User user: user to who items are rendered
        :param sender: signal sender (if None, use self)
        :param items: add thoses items to the returned ones
        :param \**kwargs: 'kwargs' attribute to pass to receivers
        """
        items = items or []
        sender = sender or self
        results = (
            v for r, v in self.trigger(
                items=items, user=user, **kwargs
            )
            if isinstance(v, SlotItem)
        )
        return sorted(itertools.chain(self.items, items, results))


class Slots(Register):
    """
    Defines slots of `itemsSlot` instances, in order to use
    them from templates.
    """
    key = 'slot_name'

    def __init__(self, *import_list):
        r"""
        :param \*import_list: list of Slots|dict to copy.
        """
        super().__init__()
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



