<template>
    <div :class="listClass">
        <slot name="before"></slot>

        <div ref="list">
            <p-list-item v-for="(item, index) in items"
                ref="items" :key="item[itemKey]"
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
        </div>

        <slot></slot>

        <slot name="after"></slot>
    </div>
</template>


<script>
import Resources from 'pepr/api/resources';

/**
 * Component rendering items of an array. Data can be retrieved and
 * synchronized from the server using properties ('path', 'pubsubPath',
 * ...).
 */
export default {
    props: {
        /**
         * connection [property] Connection used to send requests
         * @type {Connection}
         */
        connection: { type: Object },
        /**
         * url [property] Property
         * @type {String}
         */
        path: { type: String, default: null },
        /**
         * query [property] Extra parameter to pass to GET items from the server.
         * @type {Object}
         */
        query: { type: Object, default: () => {} },
        /**
         * path [property] Path to use for pubsub endpoint. By default, component's `path + '/pubsub/'`
         * @type {String}
         */
        pubsubPath: { type: String, default: '' },
        /**
         * filter [property] pubsub's filter
         * @type {String}
         */
        pubsubFilter: { type: String, default: null },
        /**
         * filter [property] pubsub's lookup
         * @type {String}
         */
        pubsubLookup: { type: String, default: null },

        /**
         * items [property] array of items
         * @type {Array}
         */
        items: { type: Array, default: () => [] },
        /**
         * itemKey [property] Resources's idAttr.
         * @type {String}
         */
        itemKey: { type: String, default: 'pk' },
        /**
         * listClass [property] List class
         * @type {String}
         */
        listClass: { type: String, default: 'list-group' },
        /**
         * itemClass [property] Item class
         * @type {String}
         */
        itemClass: { type: String, default: 'list-group' },
    },

    // TODO: watch connection, path, items, pubsubFilter, path => pubsubPath, pubsubLookup
    // -> connection change: try unsubscribe
    data: function() {
        return {
            /**
             * Resources instance used to link the list to the server.
             * @type {Resources|null}
             */
            resources: null,

            /**
             * Pubsub instance used by Resources.
             * @type {Pubsub|null}
             */
            get pubsub() {
                return this.resources && this.resources.pubsub;
            }
        };
    },

    methods: {
        /**
         * Reset resources
         */
        resetResources(init=false) {
            if(this.resources)
                this.resources.drop();

            this.resources = null;
            if(init && this.connection && this.path) {
                this.resources = new Resources(this.connection, this.path, this.itemKey,
                                               this.items, this.query);
                this.resetPubsub(true);
            }
            return this.resources;
        },

        /**
         * Reset Pubsub
         */
        resetPubsub(init=false) {
            if(this.resources)
                this.resources.unsubscribe();

            if(init && this.pubsubFilter) {
                var path = this.pubsubPath ? this.pubsubPath : this.path + 'pubsub/';
                this.resources.subscribe(path, this.pubsubFilter, this.pubsubLookup);
            }

            return this.pubsub;
        },

        /**
         * Return component at given the index
         */
        getComponent(index) {
            return index > -1 ? this.$refs.items[index] : null;
        },

        /**
         * Extract items from the given slot's elements.
         */
        toList(slot) {
            if(!slot || slot.length == 0)
                return;

            for(var item of slot) {
                item = item.children && item.children[0];
                if(!item || !item.text)
                    continue;

                try {
                    const data = JSON.parse(item.text);
                    if(data)
                        this.resources.update(data);
                }
                catch(e) {
                    console.error(e);
                }
            }
            return;
        },
    },

    mounted() {
        this.resetResources(true);
        console.log('init to list', this.$slots);
        this.toList(this.$slots.data);
        var self = this;
        console.log('resources', this.resources);
        console.log(this.$slots, this.$scopedSlots);
        /*if(this.resources)
            window.setTimeout(
                () => self.resources.load({ query: { limit: 2 }}), 5000
            )*/
    },
};
</script>


