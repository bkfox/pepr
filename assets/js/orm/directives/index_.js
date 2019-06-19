/** @module orm/directives/index_ **/
import Vue from 'vue';

import Indexer from '../indexer';
import Directive from './directive';

/**
 * Create an index over model's provided attribute. Index is updated automatically
 * on model's action (insert, update, remove and list versions)
 *
 * @extends module:orm/directives/directive.Directive
 * @see module:orm/indexer.Indexer
 */
export default class IndexDirective extends Directive {
    static plugin(store, model) {
        store.subscribeAction({
            before: function({type, payload}, state) {
                let at = type.lastIndexOf('/');
                if(at < 0)
                    return;
                let [module, action] = [type.substring(0, at+1), type.substring(at+1)];
                switch(action) {
                    case 'insert': case 'update':
                        store.commit(module + 'index', {
                            item: payload.data,
                            previous: state.all[model.key(payload.data)],
                            indexes: Object.keys(payload.data),
                        })
                        break;
                    case 'updateList':
                        for(const data of payload.datas)
                            store.commit(module + 'index', {
                                item: data,
                                previous: state.all[model.key(data)],
                                indexes: Object.keys(payload.data),
                            })
                        break;
                    case 'remove':
                        const item = state.all[payload.key];
                        item && store.commit(module + 'indexRemove', {item});
                        break;
                    case 'removeList':
                        for(const key of payload.keys) {
                            const item = state.all[key];
                            item && store.commit(module + 'indexRemove', {item})
                        }
                        break;
                }
            }
        });
    }

    plugin(store, model) {
        this.indexer = new Indexer(model, this.attr);
        model.commit('indexer', {index: this.attr, indexer: this.indexer}, store);
    }
}


IndexDirective.prototype.modelModule = (database, model, field) => Object({
    state: () => Object({ indexers: {} }),

    getters: {
        /**
         * Registered indexers (holding indexes)
         * @member {Object.<String,module:orm/indexer.Indexer>}
         */
        indexers: state => state.indexers,

        /**
         * Return index for the given key.
         * @param {String} index
         * @return {Object.<IndexKey, ModelKey[]>}
         */
        index: state => index => state.indexers[index] && state.indexers[index].index,

        /**
         * @param {String} index - index key
         * @param {IndexKey} lookup - entry's lookup
         * @return {Model[]}
         */
        indexItems: state => (index, lookup) => {
            let indexer = state.indexers[index];
            return indexer ? indexer.entryItems(lookup, state.all) : [];
        },
    },

    mutations: {
        /**
         * Add item to index's entries
         * @param options
         * @param {String} options.index - index name
         * @param {ModelKey} options.key - item's key
         * @param {IndexKey[]} options.lookups - entries index
         * @see module:orm/indexer.Indexer#acquire
         */
        indexAcquire(state, {index, key, lookups}) {
            let indexer = state.indexers[index];
            indexer && indexer.acquire(key, lookups, true);
        },

        /**
         * Release item from index's entries
         * @param options
         * @param {String} options.index - index name
         * @param {ModelKey} options.key - item's key
         * @param {IndexKey[]} options.lookups - entries index
         * @see module:orm/indexer.Indexer#release
         */
        indexRelease(state, {index, key, lookups}) {
            let indexer = state.indexers[index];
            indexer && indexer.release(key, lookups, true);
        },

        /**
         * Add an indexer for the given index name (remove if `indexer` is null).
         * @param options
         * @param options.index - index name
         * @param options.indexer - indexer or null if to be removed
         */
        indexer(state, {index, indexer=null}) {
            if(indexer === null)
                return Vue.delete(state.indexers, index)
            indexer.reset(Object.values(state.all))
            Vue.set(state.indexers, index, indexer);
        },

        /**
         * Update item on indexes.
         * @param options
         * @param {Model} options.item - item instance to index
         * @param {Model} [options.previous=null] - previous version of item (`undefined` if none). By default get it from state.
         * @param {String[]=} options.indexes - update only those indexes
         * @see module:orm/indexer.Indexer#update
         */
        index(state, {item, previous=null, indexes=null}) {
            let indexers = indexes === null ? Object.values(state.indexers)
                                            : indexes.map(index => state.indexers[index]);
            for(let indexer of indexers)
                indexer && indexer.update(item, previous)
        },

        /**
         * Remove item from indexes.
         * @param {Model} options.item - item instance to index
         * @param {String[]=} options.indexes - update only those indexes
         * @see module:orm/indexer.Indexer#remove
         */
        indexRemove(state, {item, indexes=null}) {
            let indexers = indexes === null ? Object.values(state.indexers)
                                            : indexes.map(index => state.indexers[index]);
            for(let indexer of indexers)
                indexer && indexer.remove(item)
        },

        /**
         * Delete index entry: all related items will be updated.
         * @param payload
         * @param {String} payload.index - index name
         * @param payload.lookup - entry's lookup
         * @see module:orm/indexer.Indexer#removeEntry
         */
        indexRemoveEntry(state, {index, lookup}) {
            const indexer = state.indexers[index]
            indexer && indexer.removeEntry(lookup);
        },
    }
});




