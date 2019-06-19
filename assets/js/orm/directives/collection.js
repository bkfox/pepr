/** @module orm/directives/collection **/
import Vue from 'vue';
import IndexDirective from './index_';

// TODO - doc
//      - model.prototype.$release
//      - fetch & acquire?

/**
 * Provides acquire and release mechanisms on model instances, that
 * act as shared pointers: items are acquired by collections, and when there
 * is no more collection handling it, they are removed from the store.
 *
 * @extends module:orm/directives/directive.Directive
 */
export default class CollectionDirective extends IndexDirective /** @lends module:orm/directives/collection.CollectionDirective */ {
    constructor() {
        super('$collections')
    }

    modelPrototype(database, model, field) { return {
        /**
         * Acquire model instance by the collection. It also ensures that item is
         * inserted into the store.
         * @param {CollectionKey} collection - collection acquiring item
         */
        $acquire(collection) {
            const data = {};
            this.$collections = (this.$collections || new Set()).add(collection);
            this.$commit('indexAcquire', {index: '$collections', key: this.$key, lookups:[collection]});
        },

        /**
         * Release item from the provided collection.
         * @param {CollectionKey} collection
         * @param {Boolean} remove - remove item from store
         */
        $release(collection=null, remove=true) {
            if(collection)
                this.$commit('indexRelease', {index: '$collections', key: this.$key, lookups:[collection]});
        },
    }}

    /**
     * Attributes added to the Model's store.
     * @namespace
     */
    modelModule(database, model, field) /** @lends module:orm/directives/collection.CollectionDirective.modelModule **/ {
        var dir = this.constructor;
        var module = super.modelModule(database, model, field);
        module.getters = {
            ...module.getters,
            /** @member - collections by key */
            collections: (state) => state.indexers['$collections'] &&
                                    state.indexers['$collections'].index,
            /**
             * Return items of a collection for the provided key
             * @param {CollectionKey} collection
             */
            collectionItems: (state, getters) => collection =>
                getters.indexItems('$collections', collection),

        }
        return module;
    }
}

