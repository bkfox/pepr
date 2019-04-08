from copy import copy


class Register:
    entries = None
    """ The objects as dict of `{key: entry}`. """
    entry_key_attr = None
    """ Use this attribute as key for objects. If None, key must always
    be specified. """
    entry_overwrite = False
    """ If True, silently overwrite entries """

    def __init__(self, **kwargs):
        self.entries = {}
        self.__dict__.update(kwargs)

    def clone(self):
        clone = copy(self)
        clone.entries = dict(self.entries.items())
        return self

    def get_entry_key(self, entry):
        """
        Return key for a given entry
        """
        if self.entry_key_attr is None:
            raise KeyError('`entry_key_attr` or `get_entry_key` must be'
                           ' defined')
        return getattr(entry, self.entry_key_attr)

    def reset(self, key, entry=None):
        """
        Update entry at the given key. If ``entry`` is None, delete
        entry at the given position. Return previous value.
        """
        previous = self.entries.get(key)
        if entry:
            self.entries[key] = entry
        else:
            del self.entries[key]
        return previous

    def add(self, entry, key=None, force=None):
        """
        Add an entry and return registered entry if success
        Flowchart: reset
        """
        key = self.get_entry_key(entry) if key is None else key
        force = self.entry_overwrite if force is None else force

        # FIXME: what about entry_overwrite = True, force = False ?
        #           => defaults force=None
        if not force and key in self.entries:
            raise KeyError('entry exists yet for this key {}'
                           .format(key))
        self.reset(key, entry)
        return entry

    def remove(self, key):
        """
        Remove entry by key and return previous value.
        Flowshart: reset
        """
        return self.reset(key)

    def remove_entry(self, entry):
        """
        Remove entry by value and return previous value. Raise ValueError
        if entry does not match the one in the registry.

        Flowchart: remove
        """
        key = self.get_entry_key(entry)
        if self.entries.get(key) is not entry:
            raise ValueError('Entry does not match to the one in the '
                             'registry.')
        return self.remove(key)

    def get(self, key, default=None):
        """
        Get entry by key, with the given ``default`` value.  ``default``
        can be a ``callable(key)``, called when required.
        """
        if callable(default):
            return self.entries.get(key) or default(key)
        return self.entries.get(key, default)

    def setdefault(self, key, default):
        """
        Set default value for entry at the given key.  ``default`` can
        be a ``callable(key)``, called when required.
        """
        if callable(default):
            if key not in self.entries:
                self.entries[key] = default(key)
            return self.entries[key]
        return self.entries.setdefault(key, default)

    def filter(self, *keys, pred=None, strict=True):
        """
        Return an iterator of `(key, entry)` of entries matching given
        ``keys`` (if provided) and ``predicate(key, entry)``.

        :param \*keys: filter entries with this keys
        :param pred: filter on this predicate
        :param strict: wether to return or not all entries of no \
            predicate and no keys have been provided.
        :returns: an iterator of ``(key: entry)`` value.
        """
        if keys:
            entries = (e for e in ((k, self.entries.get(k))
                                   for k in keys) if e)
        else:
            entries = self.entries.items()
        return ((k, e) for (k, e) in entries if pred(k, e)) \
            if pred else entries \
            if not strict else list()

    def clear(self):
        """ Clear registry of all entries. """
        self.entries.clear()

    def update(self, register):
        """
        Import entries from a register (by reference), a dict or
        an iterable of entries.

        :return: self
        """
        entries = register.entries \
            if isinstance(register, Register) else register

        if isinstance(entries, dict):
            self.entries.update(entries)
        else:
            for entry in entries:
                self.add(entry, force=True)
        return self

    def concat(self, register):
        """
        Create a new register that concatenate self to another register.
        """
        clone = self.clone()
        clone.update(register)
        return clone

    def items(self):
        """ Shorthand to ``entries.items()``. """
        return self.entries.items()

    def keys(self):
        """ Shorthand to ``entries.keys()``. """
        return self.entries.keys()

    def values(self):
        """ Shorthand to ``entries.values()``. """
        return self.entries.values()

    def __iter__(self):
        return self.entries.items()

    def __getitem__(self, key):
        return self.entries[key]

    def __contains__(self, key):
        return key in self.entries

    def __len__(self):
        return len(self.entries)
