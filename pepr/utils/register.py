from pepr.utils.iter import FilterIter

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
        """
        Unregister a given entry if present
        """
        key = self.get_key(entry)
        if self.entries.get(key) is entry:
            del self.entries[key]

    def iter(self):
        """
        Return FilterIter on self's entries
        """
        return FilterIter(self.entries.values())

    def get(self, key):
        """ Get entry by key """
        return self.entries.get(key)

    def clear(self):
        """
        Reset registry and remove all registered entries
        """
        self.entries = {}

    def __contains__(self, key):
        return key in self.entries

    def __len__(self):
        return len(self.entries)



