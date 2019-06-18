/** @module orm/recordStore **/
import {mergeStores} from './utils';
import ModelModule from './modelModule';

/**
 * Provides store options for Record models.
 * @namespace RecordStore
 */
export default function(database) {
    // this is used a record.store method, which means we can call super
    return mergeStores(ModelModule.call(this, database), {
        actions: {
            /**
             * Fetch a record from the server and store it.
             * @param options
             * @param options.collection - acquire item by this collection.
             * @see {Record.fetch}
             */
            fetch({state, dispatch}, {collection=null, ...options}) {
                return state.model.fetch(options).then(
                    data => dispatch('update', {collection, data})
                );
            },

            /**
             * Fetch a list of records from the server and store it.
             * @param options
             * @param options.collection - acquire items by this collection.
             * @see {Record.fetchList}
             */
            fetchList({state, dispatch}, {collection=null, ...options}) {
                return state.model.fetchList({...options, asRecord:false}).then(
                    data => dispatch('updateList', {collection, data})
                );
            },

            /**
             * Post a record from the server and store result into store if any.
             * @param payload
             * @param payload.fetch - fetch payload
             * @param payload.collection - acquire item by this collection.
             * @param payload.item - model instance or item data
             * @see {module:orm/record.Record.post}
             * @see {module:orm/record.Record.fetch}
             */
            post({state, dispatch}, {data, fetch=null, ...payload}) {
                data = state.model.as(data, this);
                return data.$post(fetch, false).then(
                    data => dispatch('update', {collection, data})
                );
            },

            /**
             * Delete a record from the server and store.
             * @return a Promise resolving to a array of `[key, removeItem]`.
             */
            delete({state, commit}, {item, key=null, ...options}) {
                item = item || state.all[key];
                key = key || item.$key;
                return item.$delete(options).then(item => dispatch('remove', {key}));
            },

            /**
             * Get an item from the store using provided key, or fetch it from
             * the server.
             * @params options - `Model.fetch`'s options.
             * @return a Promise resolving to the item.
             * @see {Record.fetch}
             */
            getFetch({state, dispatch}, {key, ...options}) {
                if(state.all[key])
                    return Promise.resolve(state.all[key]);
                return dispatch('fetch', {key, ...options})
            },
        }
    });
}



