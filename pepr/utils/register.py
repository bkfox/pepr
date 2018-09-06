
class Register:
    entries = None
    """ the objects """
    key = 'id'
    """ use this attribute as key for objects """

    def __init__(self, **kwargs):
        self.entries = {}
        self.__dict__.update(kwargs)

    def get_entry_key(self, entry):
        """
        Return key for a given entry
        """
        return getattr(entry, self.key)

    def add(self, entry, key = None):
        """ Register an entry """
        try:
            key = self.get_entry_key(entry) if key is None else key
            self.entries[key] = entry
        except NameError:
            pass

    def remove(self, entry):
        """ Unregister a given entry if present """
        key = self.get_key(entry)
        if self.entries.get(key) is entry:
            del self.entries[key]

    def get(self, key):
        """ Get entry by key """
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



