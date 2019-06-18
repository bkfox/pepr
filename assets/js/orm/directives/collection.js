/** @module orm/directives/collection **/
import Vue from 'vue';
import Directive from './directive';


/**
 * Provides acquire and release mechanisms on model instances, that
 * act as shared pointers: items are acquired by collections, and when there
 * is no more collection handling it, they are removed from the store.
 *
 * @extends module:orm/directives/directive.Directive
 */
// TODO: based on IndexDirective
export default class CollectionDirective extends Directive /** @lends module:orm/directives/collection.CollectionDirective */ {
    plugin(store, model, field) {
        // Since hook needs store, it is scoped inside this function which is
        // a different object for everycall. Vuex `genericSubscribe`'s check for
        // the presence of the hook will fails because function objects are different
        // instances.
        // TODO: (eventually) find a solution and report bug
        if(store._collectionsSubscribed)
            return

        function hook({type, payload}, state) {
            let at = type.lastIndexOf('/');
            if(at < 0)
                return

            let collection = payload.collection;
            let model_ = payload.model || model;
            let [module, subtype] = [type.substring(0, at+1), type.substring(at+1)];
            switch(subtype) {
                case 'insert': case 'update':
                    store.commit(module + 'acquire',
                        {collection, key: model.key(payload.data)});
                    break;
                case 'updateList':
                    store.commit(module + 'acquireList',
                        {collection, keys: payload.datas.map(data => model_.key(data))});
                    break;
                case 'remove':
                    store.commit(module + 'release', {key: payload.key})
                    break;
                case 'removeList':
                    store.commit(module + 'releaseList', {keys: payload.keys});
                    break;
            }
        }

        store.subscribe(hook)
        store.subscribeAction({after: hook})
        store._collectionsSubscribed = true;
    }

    /**
     * Add an item to collection set
     * @param {Set.<ModelKey>} entry - collection entry
     * @param {Model} item
     * @protected
     */
    static acquire(collection, entry, item) {
        if(item && item.$key) {
            entry.add(item.$key);
            item.$collections = (item.$collections || new Set()).add(collection);
        }
    }

    /**
     * Release item from the given collection
     * @param {Object} state
     * @param {Set.<ModelKey>} entry - collection entry
     * @param {ModelKey} key - item key
     * @param {Boolean} remove - remove orphan items
     * @param {Boolean} [updateEntry=true] - delete item from entry
     * @protected
     */
    static release(state, entry, key, remove, updateEntry=true) {
        const item = state.all[key]
        if(item && item.$collections) {
            item.$collections.delete(collection)
            if(remove && !item.$collections.size)
                Vue.delete(state.all, key);
        }
        updateEntry && entry.delete(key);
    }

    /**
     * Release item from all its related collections.
     * @param {Object} state
     * @param {ModelKey} key - item key
     * @param {Boolean} remove - remove orphan items
     * @protected
     */
    static releaseItem(state, key, remove) {
        const item = state.all[key];

        // even though code is similar to releaseCollection's one, its hard to
        // find a clean way to reuse common code base. Don't loose your time.
        if(!item || !item.$collections)
            return;

        for(var collection of item.$collections) {
            const entry = state.collections[collection];
            if(entry) {
                entry.delete(key);
                if(entry.size)
                    Vue.set(state.collections, collection, entry)
                else
                    Vue.delete(state.collections, collection)
            }
        }
        item.$collections.clear();
        remove && Vue.delete(state.all, key)
    }

    modelPrototype(database, model, field) { return {
        /**
         * Acquire model instance by the collection. It also ensures that item is
         * inserted into the store.
         * @param {CollectionKey} collection - collection acquiring item
         */
        $acquire(collection) {
            // plugin handles 'acquire'.
            this.$commit('insert', {collection, data: this})
        },

        /**
         * Release item from the provided collection.
         * @param {CollectionKey} collection
         * @param {Boolean} remove - remove item from store
         */
        $release(collection=null, remove=true) {
            if(collection)
                this.$dispatch('release', {collection, keys: [this.$key]})
        },
    }}
}

/**
 * Attributes added to the Model's store.
 * @namespace
 */
CollectionDirective.prototype.modelModule = function(database, model, field) /** @lends module:orm/directives/collection.CollectionDirective.store **/ {
    var dir = this.constructor;
    return {
        state: () => Object({collections: {}}),

        getters: {
            /**
             * Collections by key
             */
            collections(state) {
                return state.collections;
            },

            /**
             * Return items of a collection for the provided key
             */
            collectionItems(state, getters) {
                return collection => {
                    let entry = state.collections[collection];
                    return entry && [...entry].map(key => state.all[key])
                                              .filter(item => item !== undefined)
                }
            }
        },

        /**
         * @namespace Collection.store.actions
         */
        mutations: {
            /**
             * Add one or multiple items to the collection (if specified), by keys and/or
             * values.
             * Item insertion is not handled by this function.
             *
             * @method Collection.store.actions.acquire
             * @param payload
             * @param {CollectionKey} payload.collection - collection key
             * @param {Model[]} payload.items - items' keys to acquire
             * @param {ModelKey[]} payload.keys - items' keys to acquire
             */
            // TODO: payload.items => caller must ensure that items are stored in
            //       state.
            acquire(state, {collection, item=null, key=null}) {
                let entry = state.collections[collection] || new Set();
                if(key) {
                    let item = state.all[key];
                    item && dir.acquire(collection, entry, item);
                }
                item && dir.acquire(collection, entry, item);
                Vue.set(state.collections, collection, entry);
            },

            /**
             * Acquire a list of items
             * @param payload
             * @param {CollectionKey} payload.collection - collection
             * @param {Model[]} [payload.items=[]]
             * @param {ModelKey[]|null=} payload.keys
             */
            acquireList(state, {collection, items=[], keys=null}) {
                let entry = state.collections[collection] || new Set();
                if(keys)
                    items = [...items, ...keys.reduce(
                        (s, key) => (!state.all[key] || s.push(state.all[key])) && s,
                        [])
                    ];
                for(var item of items)
                    dir.acquire(collection, entry, item);
                Vue.set(state.collections, collection, entry)
            },

            /**
             * Release item from collection and remove it from the store if there
             * is no more acquired to any collection.
             * @param payload
             * @param {CollectionKey=} payload.collection - collection key
             * @param {ModelKey=} payload.key - item's key
             * @param {Boolean} payload.remove - remove item if not more acquired
             */
            release({state}, {collection, key=null, remove=true}) {
                const entry = state.collections[collection];
                if(entry) {
                    dir.release(state, entry, key, remove, true);
                    if(!entry.size)
                        Vue.delete(state.collections, collection)
                    else
                        Vue.set(state.collections, collection, entry)
                }
            },

            /**
             * Release a list of items from the provided collection.
             * @param payload
             * @param {CollectionKey=} payload.collection - collection key
             * @param {ModelKey=} payload.keys - items' key
             * @param {Boolean} payload.remove - remove item if not more acquired
             */
            releaseList({state}, {collection, keys=null, remove=true}) {
                const entry = state.collections[collection];
                if(entry) {
                    const fromKeys = keys !== null;
                    for(var key of fromKeys ? keys : entry)
                        dir.release(state, entry, key, removed, fromKeys)

                    if(!fromKeys || !entry.size)
                        Vue.delete(state.collections, collection)
                    else
                        Vue.set(state.collections, collection, entry)
                }
            },

            /**
             * Release items from all of their collections.
             * @param {Object} state - store state
             * @param {Object} payload
             * @param {Model} payload.key - released item's key
             * @param {Boolean} [payload.remove=true] - if true, remove items
             */
            releaseItem(state, {key, remove=true}) {
                dir.releaseItem(state, key, remove);
            },

            /**
             * Release items from all of their collections.
             * @param {Object} state - store state
             * @param {Object} payload
             * @param {Model} payload.keys - item keys released
             * @param {Boolean} [payload.remove=true] - if true, remove items
             */
            releaseItems(state, {keys, remove=true}) {
                for(let key of keys)
                    dir.releaseItem(state, key, remove)
            },
        },
    };
}


