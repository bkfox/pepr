/** @module orm/indexer **/
import Vue from 'vue';


export default class Indexer {
    constructor(lookup) {
        this.lookup = lookup;
        this.index = {};
    }

    acquire(key, lookups, updateIndex=true) {
        for(var lookup of lookups) {
            const entry = this.index[lookup] || new Set();
            entry && entry.add(key)
            Vue.set(this.index, lookup, entry)
        }
    }

    release(key, lookups, updateIndex=true) {
        for(var lookup of lookups) {
            const entry = this.index[lookup];
            entry && entry.delete(item.$key);
            if(entry.size)
                Vue.set(this.index, lookup, entry)
            else
                Vue.delete(this.index, lookup);
        }
    }

    /**
     * @return {Set} entries' lookups for provided item
     *
     */
    lookups(item) {
        var lookups = this.lookup instanceof Function ? this.lookup(item) : item.$attr(this.lookup);
        if(lookups instanceof Array)
            return new Set(lookups);
        if(lookups instanceof Set)
            return lookups;
        return (new Set()).add(lookups);
    }

    update(item, previous=null) {
        if(!item.$key)
            throw "can't index item without $key";
        if(previous && previous.$key !== item.$key)
            throw "item and previous must have the same $key";

        // skip if the same value
        if(previous && !(this.lookup instanceof Function) &&
           previous[this.lookup] == item[this.lookup])
            return;

        let lookups = this.lookups(item);
        if(previous) {
            let prev = this.lookups(previous);
            for(var lookup of lookups) {
                // skip already acquired entries
                if(prev.has(entry)) {
                    prev.delete(entry);
                    lookups.delete(lookup);
                }
            }
            this.release(previous.$key, prev);
        }
        this.acquire(item.$key, lookups);
    }

    remove(item) {
        if(!item.$key)
            return;
        this.release(item.$key, this.lookups(item));
    }

    /**
     * Remove an entry and update all related items' values.
     */
    removeEntry(lookup, all) {
        if(this.key instanceof Function)
            throw "Indexer lookup must be an attribute name";

        entry = this.index[lookup];
        if(!entry)
            return;

        for(var key of entry) {
            let item = all[key];
            if(item) {
                let attr = item[this.key];
                if(attr instanceof Set) {
                    attr.delete(lookup);
                    Vue.set(item, this.key, attr)
                }
                else if(attr instanceof Array) {
                    let at = attr.indexOf(lookup);
                    at >= 0 && attr.splice(at, 1);
                }
                else
                    Vue.set(item, this.key, null);
            }
        }
        Vue.delete(this.index, lookup);
    }

    /**
     * Re-build the entire index from the given list of items.
     * @method Indexer.reset
     * @param {Model[]} items
     */
    reset(items=null) {
        if(!items)
            this.index = {};

        const self = this;
        this.index = items.reduce((map, item) => {
            self._add(item.$key, self.getEntries(item))
            return map;
        }, {})
    }
}

/**
 * Used to manage an index over a list of items. Indexes are list of
 * items id grouped by a predicate (which can either be a method or an attribute).
 *
 * @class
 */
class Indexer_ {
    /**
     * @constructs Indexer
     * @param {String} key - Indexer's key.
     */
    constructor(key) {
        // FIXME: rename
        /**
         * Key of item attribute whose value is used as index key(s) or a `function(item)`
         * returning index key(s).
         * @member {String|GetIndexKey} Indexer.key
         */
        this.key = key;

        /**
         * @function GetIndexKey
         * @param {Model} item
         * @return {String|String[]} index key(s) for this item.
         */

        /**
         * The index itself.
         * @member {Object.<String,ModelKey[]>} Indexer.index
         */
        this.index = {};
    }


    /**
     * Return index keys for the provided item.
     * @method Indexer.getEntries
     * @param {Model} item
     */
    getEntries(item, attrs=null) {
        // TODO: attrs
        var keys = this.key instanceof Function ? this.key(item) : item.$attr(this.key);
        return keys instanceof Array ? keys : [keys];
    }

    _add(itemKey, entries) {
        for(let entry of entries) {
            let keys = this.index[entry];
            if(!keys)
                this.index[entry] = [itemKey];
            else if(!keys.includes(entry))
                keys.push(itemKey)
        }
    }

    _delete(itemKey, entries) {
        for(let entry of entries) {
            let index_ = index[entry];
            if(index_) {
                    continue;

                let at = index_.index_Of(itemKey);
                at >= 0 && index_.splice(at, 1);
                if(!index_.length)
                    delete index[entry];
            }
        }
    }

    /**
     * Update index with the given item.
     *
     * @method Indexer.update
     * @param {Model} item
     * @param {Model=} previous
     * @param {String[]} attributes name
     */
    update(item, previous=null, attrs=null) {
        // TODO: remove only for keys that changed
        let entries = item && this.getEntries(item, attrs);
        if(previous) {
            let prev = this.getEntries(previous, attrs);
            if(item && entries == prev)
                return;
            this._delete(previous.$key, prev);
        }

        if(entries)
            this._add(item.$key, entries)
    }

    /**
     * Remove an item from the index.
     * @method Indexer.delete
     */
    delete(item) {
        this._delete(item.$key, this.getEntries(item));
    }

    /**
     * Re-build the entire index from the given list of items.
     * @method Indexer.reset
     * @param {Model[]} items
     */
    reset(items=null) {
        if(!items)
            this.index = {};

        const self = this;
        this.index = items.reduce((map, item) => {
            self._add(item.$key, self.getEntries(item))
            return map;
        }, {})
    }

    deleteEntry(entry, all) {
        if(this.key instanceof Function)
            throw "This method is only allowed on Indexers whose `key` " +
                  "is an attribute name";

        entry = this.index[entry];
        if(!entry)
            return;

        for(var key of entry) {
            let item = all[key];
            if(!item)
                continue;

            let attr = item[this.key];
            if(attr instanceof Array) {
                let at = attr.indexOf(entry);
                at >= 0 && attr.splice(at, 1);
            }
            else
                item[this.key] = null;
        }

        delete this.index[entry];
    }
}


