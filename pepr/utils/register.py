
class Register:
    entries = None
    """ the objects """
    entry_key_attr = 'id'
    """ use this attribute as key for objects """
    entry_overwrite = False
    """ if True, silently overwrite entries """

    def __init__(self, **kwargs):
        self.entries = {}
        self.__dict__.update(kwargs)

    def get_entry_key(self, entry):
        """
        Return key for a given entry
        """
        return getattr(entry, self.entry_key_attr)

    def _add_entry(self, entry, key):
        self.entries[key] = entry

    def add(self, entry, key=None, force=False):
        """ Add an entry and return registered entry if success """
        try:
            key = self.get_entry_key(entry) if key is None else key

            if not (force or self.entry_overwrite) and key in self.entries:
                raise KeyError('entry exists yet for this key {}'
                               .format(key))
            self._add_entry(entry, key)
            return entry
        except NameError:
            pass

    def _remove_entry(self, entry, key):
        del self.entries[key]

    def remove(self, entry):
        """ Unregister a given entry if present """
        key = self.get_entry_key(entry)
        if self.entries.get(key) is entry:
            self._remove_entry(entry, key)

    def get(self, key):
        """ Get entry by key """
        # TODO: default using lambda
        return self.entries.get(key)

    def clear(self):
        """ Reset registry and remove all registered entries """
        self.entries = {}

    def update(self, register):
        """ Import entries from another register (by reference) or dict.
        """
        entries = register.entries if isinstance(register, Register) \
                                   else register
        self.entries.update(entries)

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



