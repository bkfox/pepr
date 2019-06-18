<template>
    <div>
        <slot name="header"></slot>

        <p-list-item v-for="(item, index) in items"
            ref="items" :key="item.key"
            :index="index" :item="item"
            :item-class="itemClass"
            >
            <template v-slot:before="scope">
                <slot name="beforeItem" v-bind="scope"></slot>
            </template>

            <template v-slot="scope">
                <slot name="item" v-bind="scope"></slot>
            </template>

            <template v-slot:after="scope">
                <slot name="afterItem" v-bind="scope"></slot>
            </template>
        </p-list-item>

        <slot></slot>

        <slot name="footer"></slot>
    </div>
</template>


<script>
import { mapActions } from 'vuex';

import { acquireId } from 'pepr/utils/id';
import Pubsub from 'pepr/api/pubsub';
import Content from 'pepr/models/content';

import StoreMixin from './storeMixin';

/**
 * Component rendering items of an array. Data can be retrieved and
 * synchronized from the server using properties ('path', 'pubsubPath',
 * ...).
 */
export default {
    mixin: [StoreMixin],

    props: {
        /**
         * List path
         * @type {String}
         */
        path: { type: String, default: null },
        /**
         * Form used for filtering the list results
         * @type {Object}
         */
        query: { type: Object, default: () => {}},

        /**
         * Path to use for pubsub endpoint. By default, component's `path + '/pubsub/'`
         * @type {String}
         */
        pubsubPath: { type: String, default: '' },
        /**
         * [property] pubsub's filter
         * @type {String}
         */
        pubsubFilter: { type: String, default: null },
        /**
         * pubsubLookup [property] pubsub's lookup
         * @type {String}
         */
        pubsubLookup: { type: String, default: null },

        /**
         * itemClass [property] Item class
         * @type {String}
         */
        itemClass: { type: String },
    },

    // TODO: watch connection, path, items, pubsubFilter, path => pubsubPath, pubsubLookup
    // -> connection change: try unsubscribe
    data: function() {
        const self = this;
        const cid = acquireId();
        return {
            model: this.modelClass || Content,

            /**
             * Store's collection id for this list
             */
            get cid() {
                return cid;
            },

            /**
             * Pubsub request instance.
             * @type {Pubsub|null}
             */
            pubsub: null,

            /**
             * Pubsub events listener
             */
            listener: {
                on: {
                    create: ({item}) => item.$acquire(self.cid),
                    update: ({item}) => item.$acquire(self.cid),
                    delete: ({item}) => item.$remove(),
                }
            },
        };
    },

    computed: {
        connection() {
            return this.$root && this.$root.connection
        },

        collection() {
            return this.model.getter('collections')[this.cid];
        },

        items() {
            return this.model.getter('collectionItems')(this.cid);
        },
    },

    methods: {
        clear(pubsub=true) {
            if(pubsub)
                this.unsubscribe()
            this.commit('release', {collection: this.cid})
        },

        /**
         * Pubsub unsubscribe
         */
        unsubscribe() {
            if(this.pubsub && this.listener)
                this.pubsub.release(this.listener)
        },

        /**
         * Pubsub subscribe
         */
        subscribe() {
            let path = this.pubsubPath ? this.pubsubPath : this.path + 'pubsub/';
            path = path + '/subscription';

            const pubsub = this.connection.subscribe(path, this.pubsubFilter, this.pubsubLookup, this.model);
            if(this.pubsub)
                pubsub != this.pubsub && this.unsubscribe();
            else
                this.listener = pubsub.acquire(this.listener);
            this.pubsub = pubsub;
            return this.pubsub;
        },

        /**
         * Reload list using given form's data as query parameters.
         */
        formFilter(form) {
            return this.load({
                reset: true,
                query: new FormData(form)
            });
        },

        /**
         * Extract items from the given slot's elements.
         */
        loadData(slot) {
            if(!slot || slot.length == 0)
                return;

            let datas = [];
            for(var item of slot) {
                item = item.children && item.children[0];
                if(!item || !item.text)
                    continue;

                try {
                    const data = JSON.parse(item.text);
                    if(data)
                        datas.push(data);
                }
                catch(e) {
                    console.error(e);
                }
            }

            this.model.dispatch('updateList', {collection: this.cid, datas})
        },
    },

    mounted() {
        this.loadData(this.$slots.data);
        //if(!this.items && this.path)
        //    this.load({path: this.path})

        if(this.pubsubFilter)
            this.subscribe();
    },

    beforeDestroy() {
        this.clear();
    },
};
</script>


