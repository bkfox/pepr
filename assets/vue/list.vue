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
import Pubsub from '../js/api/pubsub';

/**
 * Component rendering items of an array. Data can be retrieved and
 * synchronized from the server using properties ('path', 'pubsubPath',
 * ...).
 */
export default {
    props: {
        /**
         * url [property] List path
         * @type {String}
         */
        path: { type: String, default: null },
        /**
         * Form used for filtering the list results
         */
        query: { type: Object, default: () => {}},

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
         * itemClass [property] Item class
         * @type {String}
         */
        itemClass: { type: String },
    },

    // TODO: watch connection, path, items, pubsubFilter, path => pubsubPath, pubsubLookup
    // -> connection change: try unsubscribe
    data: function() {
        const self = this;
        return {
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
                    create: ({item}) => { console.log(item); self.$store.dispatch('api/acquire', {owner:self, resources: [item]}) },
                    update: ({item}) => { console.log(item); self.$store.dispatch('api/acquire', {owner:self, resources: [item]}) },
                    delete: ({item}) => { console.log(item); self.$store.commit('api/drop', item.id); },
                }
            },
        };
    },

    computed: {
        connection() {
            return this.$root && this.$root.connection
        },

        items() {
            return this.$store.getters['api/getOf'](this);
        },
    },

    methods: {
        load({reset=true, query=null, ...args}={}) {
            if(reset)
                this.clear(false);

            return this.$store.dispatch('api/loadList', {
                owner: this, path: this.path,
                ...args,
                options: {query: query || this.query, ...args.options},
            });
        },

        clear(pubsub=true) {
            if(pubsub)
                this.unsubscribe()
            this.$store.dispatch('api/release', {owner:this});
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

            const pubsub = this.connection.subscribe(path, this.pubsubFilter, this.pubsubLookup);
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

            return;
            // TODO

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
        this.toList(this.$slots.data);
        this.load()
        if(this.pubsubFilter)
            this.subscribe();
    },

    beforeDestroy() {
        this.clear();
    },
};
</script>


