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

    def _reset(self, key, entry=None):
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

    def add(self, entry, key=None, force=False):
        """ Add an entry and return registered entry if success """
        try:
            key = self.get_entry_key(entry) if key is None else key

            # FIXME: what about entry_overwrite = True, force = False ?
            #           => defaults force=None
            if not (force or self.entry_overwrite) and key in self.entries:
                raise KeyError('entry exists yet for this key {}'
                               .format(key))
            self._reset(key, entry)
            return entry
        # FIXME: wtf?
        except NameError:
            pass

    def remove(self, key):
        """ Unregister a given entry if present and if is this one """
        return self._reset(key)

    def remove_entry(self, entry):
        key = self.get_entry_key(entry)
        if self.entries.get(key) is entry:
            return self.remove(key)

    def get(self, key, default=None):
        """ Get entry by key """
        # TODO: default using lambda
        return self.entries.get(key, default)

    def clear(self):
        """ Reset registry and remove all registered entries """
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

    def keys(self):
        return self.entries.keys()

    def values(self):
        """ Return iterator on entries' values """
        return self.entries.values()

    def __iter__(self):
        return self.entries.items()

    def __getitem__(self, key):
        return self.entries[key]

    def __contains__(self, key):
        return key in self.entries

    def __len__(self):
        return len(self.entries)


