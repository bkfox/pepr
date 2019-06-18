import Vue from 'vue';

import match from './match';
import {mergeStores} from './utils';


/**
 * Store returned by base `Model.store()` method
 * @namespace Store
 * @memberof module:orm/model.Model
 */
export default function(database) /** @lends module:orm/model.Model.Store **/ {
const model = this;
const store = { namespaced: true, }

const stores = []
this.runDirectives((dir, field=null) => {
    var store = dir.modelModule(database, this, field);
    store && stores.push(store)
})

/**
 * @namespace state
 * @memberof module:orm/model.Model.Store
 */
store.state = function() {
    return /** @lends module:orm/model.Model.Store.state **/ {
        /**
         * Model class related to this store. It is used to instanciate
         * new items.
         *
         * @member {Model}
         */
        model: model,

        /**
         * All store's model instances, by primary key.
         * @member {Object}
         */
        all: {},

        /**
         * Items indexers by name their are used to build indexes.
         * @member {Object}
         */
        indexers: {},
    };
}

/**
 * Store getters provided by Model class.
 * @namespace getters
 * @memberof module:orm/model.Model.Store
 */
store.getters = /** @lends module:orm/model.Model.Store.getters **/ {
    /**
     * @member {Model} - store's model class
     */
    model(state) { return state.model; },

    /**
     * @member {Model[]} - all stored model instances
     */
    all(state) { return state.all; },

    /**
     * @param {ModelKey} key - get item by key
     */
    get(state) { return key => state.all[key] },

    /**
     * @param {ModelKey[]} keys - get items by keys
     * @returns A tuple of `[Model[], ModelKey[]]` of found items and keys of missing ones.
     */
    getList(state) {
        return keys => keys.reduce( (s, key) => {
            let item = state.all[key];
            if(item) s[0].push(item)
            else s[1].push(key)
            return s;
        }, [[], []]);
    },

    /**
     * Get item keys whose attribute matches the provided lookup.
     * @param {String} attr - attribute name
     * @param lookup - lookup 
     * @return {ModelKey[]}
     * @see {module:orm/match.match}
     */
    findKeysBy(state, getters) {
        return (attr, lookup) => {
            let index = getters.index(attr);
            if(index)
                return [... new Set(
                    Object.keys(index).filter(value => match(lookup, value))
                          .map(value => index[value]).flat()
                )]

            return Object.values(state.all)
                         .filter(item => match(lookup, item[attr]))
                         .map(item => item.$key)
        }
    },

    /**
     * Get items whose attribute matches the provided lookup.
     * @param {String} attr - attribute name
     * @param lookup - lookup 
     * @return {Model[]}
     * @see {module:orm/match.match}
     */
    findBy(state, getters) {
        return (attr, lookup) => {
            let index = getters.index(attr);
            if(index)
                return getters.findKeysBy(attr, lookup)
                              .map(key => state.all[key])
            return Object.values(state.all)
                         .filter(item => match(lookup, item[attr]))
        }
    },

    /**
     * Return all model instances that `match()` the provided expression.
     * (return a function).
     *
     * @param lookup - lookup 
     * @return {Model[]}
     * @see {module:orm/match.match}
     */
    filter(state) {
        // TODO use indexes
        return lookup => Object.values(state.all).filter(item => match(lookup, item));
    },

    /**
     * Registered indexers (holding indexes)
     * @member {Object.<String,module:orm/indexer.Indexer>}
     */
    indexers(state) {
        return state.indexers;
    },

    /**
     * Return index for the given key.
     * @param {String} index
     * @return {Object.<IndexKey, ModelKey[]>}
     * @see {Indexer}
     */
    index(state) {
        return index => state.indexers[index] && state.indexers[index].index;
    },

    /**
     * @param {String} index - index key
     * @param {IndexKey} entry - indexed value
     * @return {Model[]|null}
     */
    indexItems(state) {
        return (index, entry) => {
            index = state.indexers[index] && state.indexers[index][entry];
            return (index && index.map(key => state.all[key]).filter(item => item)) || null;
        }
    },
};


// allow to commit inside the store. self = the store
const commit = function(self, mutation, state, payload) {
    return store.mutations[mutation].call(self, state, payload);
};

// TODO redo docs from here

/**
 * @namespace mutations
 * @memberof module:orm/model.Model.Store
 */
store.mutations = /** @lends module:orm/model.Model.Store.mutations **/ {
    /**
     * Insert the given data into the store if not present as an instance
     * of `model` (by default: store's model).
     *
     * @method ModelStore.mutations.insert
     * @param options
     * @param {Object} data - data to insert
     * @param {Model} model - model class to instanciate
     */
    insert(state, {data, model=null}) {
        model = model || state.model;
        let key = model.key(data);
        if(key === null)
            throw "data's key is missing";

        if(state.all[key] !== undefined)
            return;

        let item = model.as(data, this);
        if(state.indexers)
            commit(this, 'index', state, {item});
        return Vue.set(state.all, key, item);
    },

    /**
     * Update stored items' attributes with provided data. Only values for
     * attributes of data will be updated (other remain untouched). Attributes
     * whose values is set to undefined will be deleted from the item.
     *
     * If item is not present in store, a new one is instanciated with
     * provided model (or store's one).
     *
     * @method ModelStore.mutations.update
     * @param options
     * @param {Object} data - data to insert. It must always have items' primary key.
     * @param {Model} model - model class to instanciate
     */
    update(state, {data, model=null}) {
        let key = state.model.key(data);
        if(!key)
            throw "data's key is missing";

        let item = state.all[key];
        let attrs = Object.keys(data);
        if(item) {
            for(var attr of attrs)
                if(data[attr] === undefined)
                    Vue.delete(item, attr);
                else
                    Vue.set(item, attr, data[attr]);
        }
        else {
            model = model || state.model;
            item = Vue.set(state.all, key, model.as(data, this));
        }

        // FIXME: item indexes wont be updated correctly
        if(state.indexers)
            commit(this, 'index', state, {item, attrs});
        return item;
    },

    /**
     * Update a list of given data items into the store overriding existing
     * data.
     * @method ModelStore.mutations.updateList
     */
    updateList(state, {datas, ...options}) {
        return datas.map(
            data => commit(this, 'update', state, {data, ...options})
        );
    },

    /**
     * Remove item from store by key.
     * @param {ModelKey} key
     */
    remove(state, {key}) {
        if(state.all[key] && state.indexers)
            commit(this, 'deleteIndex', state, {item: state.all[key]});
        return Vue.delete(state.all, key);
    },

    /**
     * Remove items of provided keys from store.
     * @param {ModelKey[]} keys
     */
    removeList(state, {keys}) {
        for(var data of datas)
            commit(this, 'update', state, key);
    },

    /**
     * Set an indexer for the given key. Indexers are used to generate
     * indexers. If `indexer` is null, removes it with the provided key.
     *
     * @param options
     * @param options.index - index name
     * @param options.indexer - indexer or null if to be removed
     */
    indexer(state, {index, indexer=null}) {
        if(indexer === null) {
            Vue.delete(state.indexers, index)
            return;
        }

        indexer.reset(Object.values(state.all))
        Vue.set(state.indexers, index, indexer);
    },

    /**
     * Update index(es) for item (before it is saved if no `previous` is provided).
     * If no index name is provided, update all indexes of item.
     *
     * When `attrs` is provided, only update indexes whose key is in it or a
     * function.
     *
     * @param options
     * @param {Model} options.item - item instance to index
     * @param {String[]} options.attrs - update indexes only for those attributes
     * @param {Model} [options.previous=null] - previous version of item (`undefined` if none). By default get it from state.
     * @param {String} [options.index=null] - if not null update only this index.
     *
     * @see {Indexer.update}
     */
    index(state, {item, attrs=null, index=null, previous=null}) {
        // TODO: implement indexing only provided attrs
        previous = previous === null ? state.all[item.$key] : previous;
        if(index !== null)
            return state.indexers[index].update(item, previous, attrs)

        for(let indexer of Object.values(state.indexers))
            indexer.update(item, previous, attrs)
    },

    /**
     * Remove item from index(es).
     * @see {Indexer.delete}
     */
    indexRemove(state, {item, index=null}) {
        if(index !== null)
            return state.indexers[index].delete(item);

        for(let indexer of Object.values(state.indexers))
            indexer.remove(item)
    },

    /**
     * Delete index entry: all related items will be updated
     * entry removed
     */
    indexRemoveEntry(state, {index, entry}) {
        const indexer = state.indexers[index]
        indexer && indexer.removeEntry(entry);
    },
};


/**
 * @namespace actions
 * @memberof module:orm/model.Model.Store
 */
store.actions = /** @lends module:orm/model.Model.Store.actions **/ {
    /***
     * Insert item, if already present reject to the one in the store,
     * else resolve to the inserted one.
     * @param {Object} options
     * @see {module:orm/model.Model.Store.mutations.insert}
     */
    insert({state}, options) {
        const item = commit(this, 'insert', state, options);
        return item ? Promise.resolve(item)
                    : Promise.reject(state.all[state.model.key(options.data)]);
    },

    /***
     * Update item in store (insert if required) and resolve to it.
     * @param {Object} options
     * @see {module:orm/model.Model.Store.mutations.update}
     */
    update({state}, options) {
        try {
            return Promise.resolve(commit(this, 'update', state, options))
        }
        catch(e) {
            console.error(e);
            return Promise.reject(e);
        }
    },

    /**
     * Update multiple itms, resolve them.
     * @method ModelStore.actions.update
     * @see {ModelStore.mutations.update
     */
    updateList({state}, options) {
        return Promise.resolve(commit(this, 'updateList', state, options))
    },

    /**
     * Remove an item and resolve to it.
     * @method ModelStore.actions.remove
     * @see {ModelStore.mutations.remove}
     */
    remove({state}, options) {
        return Promise.resolve(commit(this, 'remove', state, options))
    },

    /**
     * Remove multiple item and resolve to it.
     * @method ModelStore.actions.remove
     * @see {ModelStore.mutations.remove}
     */
    removeList({state}, options) {
        return Promise.resolve(commit(this, 'removeList', state, options));
    }
};

return stores ? mergeStores(store, ...stores) : store;
}

