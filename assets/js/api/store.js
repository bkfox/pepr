import filter from 'lodash/filter';
import find from 'lodash/find';

import Vue from 'vue';

import Drop from 'pepr/utils/drop';
import Resource from './resource';


function acquire(state, id, collection) {
    const set = (state.collections[collection] || new Set())
    Vue.set(state.collections, collection, set.add(id))
    return state.items[id];
}

/**
 * Commit and acquire owner for the given item. Return the stored
 * item.
 */
function handleResource({commit, state}, item, collection=null) {
    commit('item', item);
    if(collection !== null)
        acquire(state, item.id, collection);
    return state.items[item.id];
}


/**
 * Store managing items loading and CRUD.
 *
 * Collections have ownership of acquired items, which are dropped when no
 * more collection use them.
 */
export default {
    namespaced: true,

    state() {
        return {
            class: Resource,
            path: '',
            items: [],
            collections: {}
        };
    },

    getters: {
        /**
         * Constructor function for loaded items.
         */
        class(state) { return state.class; },

        /**
         * The default path used for data loading.
         */
        path(state) { return state.path; },

        /**
         * Return item for the given id.
         */
        get: state => id => state.items[id],

        /**
         * Return item for the given predicate
         */
        find: state => pred => find(state.items, pred),

        /**
         * Filter items for the given predicate
         */
        filter: state => pred => filter(pred),

        /**
         * Return items for the given ids
         */
        items: state => ids => ids.map(id => state.items[id])
                                      .filter(item => Boolean(item)),

        /**
         *  Get the collection (as an array of resource ids)
         */
        collection: state => id => state.collections[id],

        /**
         * Get items for the given collection id.
         */
        collectionItems: state => id => {
            const collection = state.collections[id];
            return collection ? [...collection].map(id => state.items[id])
                                               .filter(item => Boolean(item))
                              : [];
        },
    },

    mutations: {
        class(state, classe) { state.class = classe; },
        path(state, path) { state.path = path; },

        /**
         * Set item into the store.
         */
        item(state, item) {
            if(!item.key)
                throw "item must have been saved on the server";

            const current = state.items[item.id];
            if(!current)
                Vue.set(state.items, item.id, item);
            else
                Vue.set(current, 'data', item.data);
        },

        /**
         * Drop an item from state and clean-up.
         */
        drop(state, id) {
            const item = state.items[id];
            if(item instanceof Drop)
                item.drop();
            Vue.delete(state.items, id);

            // clean-up collections
            for(const key in state.collections) {
                const collection = state.collections[key];
                if(collection.has(id)) {
                    collection.delete(id);
                    Vue.set(state.collections, key, collection);
                }
            }
        },
    },

    actions: {
        acquire({commit, state, dispatch}, {collection, item=null, key=null, id=null, ...payload}) {
            if(item) {
                commit('item', item);
                item = state.items[item.id]
                id = item.id;
            }
            else {
                if(key)
                    id = state.path + key + '/';

                item = state.items[id];
                console.log('before load', collection, id);
                if(!item)
                    return dispatch('load', {collection, id});
            }
            return acquire(state, id, collection);
        },

        acquireList({dispatch}, {collection, items}) {
            for(const item of items)
                dispatch('acquire', {collection, item});
        },

        release({state}, {collection, id=null}) {
            const set = state.collections[collection];
            if(!set)
                return;

            // TODO: remove from items if no more handled
            if(id === null)
                set.clear();
            else
                set.delete(id);

            Vue.set(collections, collection, set);
        },

        releaseList({dispatch}, {collection, ids}) {
            for(const id of ids)
                dispatch('release', {collection, id});
        },

        /**
         * Load item and return a promise resolving to the stored item.
         */
        load(context, {id=null, key=null, collection=null, classe=null, options={}}) {
            if(key)
                id = context.state.path + key + '/';

            classe = classe || context.state.class;
            console.log('load', classe, id, collection, key)
            return classe.load(id, options).then(
                item => handleResource(context, item, collection),
                item => { context.commit('drop', item.id);
                              return Promise.reject(item); },
            )
        },

        /**
         * Load multiple items and return a promise resolving to the stored
         * items.
         *
         * @param {String|null} path - load with this path instead of store's;
         * @param {String} key       - load by key.
         * @param {} collection      - acquire loaded items for this collection;
         * @param {class} classe     - use this constructor instead of store's.
         * @param {Boolean} reset    - release all collection's items before loading.
         * @param {Object} options   - load options
         */
        loadList(context, {path=null, collection=null, classe=null, reset=false, options={}}) {
            if(reset && collection)
                context.dispatch('release', {collection});

            path = path || context.state.path;
            classe = classe || context.state.class;
            return classe.loadList(path, options).then(
                data => ({
                    ...data,
                    results: data.results.map(item => handleResource(context, item, collection))
                })
            )
        },

        /**
         * Create a new item on server and store result. Return a promise
         * resolving to the stored item.
         */
        create(context, {path=null, data, collection=null, classe=null, ...initArgs}) {
            path = path || context.state.path;
            classe = classe || context.state.class;
            return classe.create(path, data, initArgs)
                .then(item => handleResource(context, item, collection))
        },

        /**
         * Save the given item and update the store. Return a promise
         * resolving to the stored item.
         */
        save(context, {item, collection=null, data=null}) {
            return item.save(data)
                .then(item => handleResource(context, item, collection))
        },

        /**
         * Destroy the given item and update the store. Return a promise resolving
         * to the removed item.
         */
        delete({commit}, {item}) {
            return item.delete()
                .then(item => commit('drop', item.id))
        },
    },
}

