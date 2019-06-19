/** @module orm/indexer **/
import Vue from 'vue';
import {iterable} from './utils';

// TODO: #Vue3 remove Vue.set for Map and Set

/**
 * Create and manage an index over a items for a provided lookup.
 * Index is a Map storing items' key for the value retrieved by lookup.
 */
export default class Indexer {
    /**
     * @constructs Indexer
     * @member {Model} - model class
     * @param {String} lookup - name of attribute to index
     */
    constructor(model, lookup) {
        /** @member {Model} - model class **/
        this.model = model;
        /** @member {String} - name of items' attribute to index */
        this.lookup = lookup;
        /** @member {Map.<IndexKey,Set.<ModelKey>>} - the index */
        this.index = new Map();
    }

    /**
     * Add item's key to index entries.
     * @param {ModelKey} key - item's key
     * @param {IndexKey[]} lookups - entries lookups
     * @param {Boolean} [updateIndex=true] - call Vue.set to update index
     */
    acquire(key, lookups, updateIndex=true) {
        for(var lookup of lookups) {
            const entry = this.index.get(lookup) || this.index.set(lookup, new Set());
            entry && entry.add(key)
        }
        updateIndex && Vue.set(this, 'index', this.index);
    }

    /**
     * Remove item's key from index entries.
     * @param {ModelKey} key - item's key
     * @param {IndexKey[]} lookups - entries lookups
     * @param {Boolean} [updateIndex=true] - call Vue.set to update index
     */
    release(key, lookups, updateIndex=true) {
        for(var lookup of lookups) {
            const entry = this.index.get(lookup);
            entry && entry.delete(key);
            if(!entry.size)
                this.index.delete(lookup);
        }
        updateIndex && Vue.set(this, 'index', this.index);
    }

    /**
     * @return {Set} entries' lookups for provided item
     */
    lookups(item) {
        var lookups = item[this.lookup];
        if(lookups instanceof Set)
            return lookups;
        if(iterable(lookups))
            return new Set(lookups);
        return (new Set()).add(lookups);
    }

    /**
     * Shortcut to get index entry
     * @param {IndexKey} lookup
     */
    entry(lookup) {
        return this.index.get(lookup);
    }

    /**
     * Return entry's items
     * @param {IndexKey} lookup
     * @param {Object.<ModelKey, Model>} all - retrieve items there
     * @return {Model[]}
     */
    entryItems(lookup, all) {
        let entry = this.index.get(lookup);
        if(!entry)
            return [];

        let items = [];
        for(var key of entry) {
            let item = all[key];
            item && items.push(item);
        }
        return items;
    }

    /**
     * Update index with the given item.
     * @param {Model|Object} item
     * @param {Model=} previous
     */
    update(item, previous=null) {
        // this allows indexing based on data without having to instanciate
        // a model instance.
        itemKey = this.model.key(item);
        previousKey = this.model.key(previous);

        if(!itemKey)
            throw "can't index an item without key";
        if(previous && previousKey !== itemKey)
            throw "item and previous must have the same key";

        // skip if the same value
        if(previous && previous[this.lookup] == item[this.lookup])
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
            this.release(previousKey, prev);
        }
        this.acquire(itemKey, lookups);
    }

    /**
     * Remove item from index
     * @param {Model} item
     */
    remove(item) {
        let key = this.model.key(item);
        key && this.release(key, this.lookups(item));
    }

    /**
     * Remove an entry and update all related items' values.
     * @param {IndexKey} lookup - entry's lookup
     * @param {Object.<ModelKey, Model>} all - items
     */
    removeEntry(lookup, all) {
        let entry = this.index.get(lookup);
        if(!entry)
            return;

        for(var key of entry) {
            let item = all[key];
            if(item) {
                let attr = item[this.lookup];
                if(attr instanceof Set)
                    attr.delete(lookup) && Vue.set(item, this.lookup, attr)
                else if(attr instanceof Array) {
                    let at = attr.indexOf(lookup);
                    at >= 0 && attr.splice(at, 1);
                }
                else
                    Vue.set(item, this.lookup, null);
            }
        }
        this.index.delete(lookup);
        Vue.set(this, 'index', this.index);
    }

    /**
     * Re-build the entire index from the given list of items.
     * @param {Model[]} items
     */
    reset(items=null) {
        this.index = new Map();
        if(items)
            for(var item in items) {
                let [lookups, key] = [this.lookups(item), this.model.key(item)];
                this.acquire(key, lookups, false);
            }
        Vue.set(this, 'index', this.index);
    }
}

