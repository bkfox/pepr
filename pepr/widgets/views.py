from enum import IntEnum
import itertools

from django.dispatch import Signal

from pepr.utils.components import ComponentMixin


class Position(IntEnum):
    Before = -1
    Default = 0
    After = 1


class WidgetView(ComponentMixin):
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

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def __lt__(a, b):
        return a.position < b.position or \
                (a.position == b.position and a.order < b.order)


class WidgetsView(ComponentMixin):
    """
    Provides a generic container for widget components.

    This uses Django's Signal in to retrieve the components to render.
    This aims to be generic enough to respond to different use case
    (menu, actions, etc.)
    """
    widgets = None
    """
    List of widgets that are fetched when finding items.
    """
    signal = None
    """
    Signal used to gather items that have to be rendered, call:

        signal(sender = Sender, items = [], request = None,
                slot = '', **signal_args)

    Signal args are passed at the view init.

    Sender's type depends of the use cases, e.g for ContentContainer's
    widgets slot, it is the current ContentContaienr instance.

    Return value of receivers can either be None or an item to add to
    items to render (as instance of ContainerItem).
    """
    tag_name = 'div'
    """
    Tag name for the component Container. If empty, render items without
    a container tag.
    """
    tag_attrs = {}
    """
    Extra attributes to add to the container tag.
    """

    template_name = 'pepr/widgets/container.html'

    def __init__(self, signal_args = None, **kwargs):
        """
        :param [] signal_args: signals arguments
        """
        if kwargs:
            self.__dict__.update(kwargs)
        self.widgets = []
        self.signal = Signal(
            ['request', 'slot', 'items'] + (signal_args or [])
        )

    def register(self, widget):
        """
        Add a widget to widgets list
        """
        self.widgets.append(widget)
        self.widgets.sort()

    def unregister(self, widget):
        """
        Remove a widget from widgets list
        """
        del self.widgets[widget]

    def connect(self, *args, **kwargs):
        """
        Register receiver to this Container (forward call)
        """
        self.signal.connect(*args, **kwargs)

    def disconnect(self, *args, **kwargs):
        """
        Remove receiver from this Container (forward call)
        """
        self.signal.disconnect(*args, **kwargs)

    def find_items(self, request, sender = None, **kwargs):
        """
        Gather items by triggering signal, and return them sorted by
        priority as an iterator.

        :param HttpRequest|None request: request being processed;
        :param sender: signal sender (if None, use self)
        :param \**kwargs: 'kwargs' attribute to pass to receivers
        """
        items = []
        sender = sender or self
        results = (v for r,v in
            self.signal.send(
                sender = sender, items = items,
                request = request, **kwargs
            )
            if isinstance(v, WidgetView)
        )
        return sorted(itertools.chain(self.widgets, items, results))

    def get_context_data(self, request, sender = None, items = None,
            **kwargs):
        """
        :param [WidgetView] items: if given, use this list instead of \
            thoses from find_items
        """
        context = super().get_context_data(request, **kwargs)

        items = items or self.find_items(request, sender, **kwargs)
        context['tag_name'] = self.tag_name
        context['tag_attrs'] = self.tag_attrs
        context["items"] = (
            item.render(request, **kwargs) for item in items
        )
        return context


class Slots:
    """
    Defines slots of `WidgetsView` instances, in order to use
    them from templates.
    """
    slots = {}
    """
    [class] Dict of `{ 'slot': WidgetsView }`.

    Slot name is virtually limited to 32 characters because Widget
    models' slot field is too.
    """
    _slots_registered = False

    @classmethod
    def register(cl, slot, container):
        cl.slots[slot] = container

    @classmethod
    def unregister(cl, slot):
        del cl.slots[slot]

    @classmethod
    def get(cl, slot):
        return cl.slots.get(slot)

    @classmethod
    def register_slots(cl, force = False):
        """
        Register this class' `find_widgets_register` to slots
        declared on this class.

        The method `find_widgets_register` should be implemented in
        order for this to work.
        """
        if not force and self._slots_registered:
            return
        for container in self.slots:
            container.connect(cl.find_widgets_receiver)

    @classmethod
    def find_widgets_receiver(cl, sender, items, request, kwargs):
        """
        Handles signals for widgets: add user's widget for the given widget
        in kwargs. Sender must be an instance of cl.

        :param cl sender: instance being rendered
        :param HttpRequest request: processing request
        :param dict kwargs: dispatch kwargs
        """
        raise NotImplemented("function must be implemented")


