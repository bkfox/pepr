<template>
    <div :class="listClass">
        <slot name="before"></slot>

        <div ref="list">
            <p-list-item v-for="(item, index) in items"
                ref="items" :key="item[itemKey]"
                :index="index" :item="item"
                :item-class="itemClass"
                >
                <slot name="item" :list="this" :item="item" :index="index">
                </slot>
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
 * synchronized from the server using properties ('url', 'observeUrl',
 * ...).
 */
export default {
    props: {
        /**
         * @type {Connection} connection [property] Connection used to send
         * requests
         */
        connection: { type: Object },
        /**
         * @type {String} url [property] Property
         */
        url: { type: String, default: null },
        /**
         * @type {String} contextUrl [property] Property
         */
        observerPath: { type: String, default: 'observer/' },
        /**
         * @type {Object} query [property] Extra parameter to
         * pass to GET items from the server.
         */
        query: { type: Object, default: () => {} },
        /**
         * @type {String} filter [property] Observer's filter
         */
        observerFilter: { type: String, default: null },
        /**
         * @type {String} filter [property] Observer's lookup
         */
        observerLookup: { type: String, default: null },

        /**
         * @type {String} itemKey [property] Resources's idAttr.
         */
        itemKey: { type: String, default: 'pk' },
        /**
         * @type {String} listClass [property] List class
         */
        listClass: { type: String, default: 'list-group' },
        /**
         * @type {String} itemClass [property] Item class
         */
        itemClass: { type: String, default: 'list-group' },
    },

    data: function() {
        var resources = this.connection && this.url ?
                        new Resources(this.connection, this.url, this.itemKey,
                                      [], this.query) :
                        null;
        return {
            /**
             * @type {Array} Array of items to render.
             * 
             */
            items: resources.items,
            /**
             * @type {Resources} Resources instance used to link the
             * list to the server.
             */
            resources: resources,
        };
    },

    methods: {
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

            for(var i in slot) {
                var elm = slot[i].elm;
                var id = elm && elm.dataset && elm.dataset.id;
                if(!id)
                    continue;

                var data = elm.querySelector(`script[id="${id}"]`);
                try {
                    data = JSON.parse(data.textContent);
                    data.elm = elm;
                    this.items.push(data);
                }
                catch(e) {
                    console.log(e);
                }
                elm.parentNode && elm.parentNode.removeChild(elm);
            }
        },
    },

    mounted() {
        this.toList(this.$slots.default);
        var self = this;
        console.log('resource', self.resources);
        window.setTimeout(
            () => self.resources.load({ query: { limit: 2 }}), 5000
        )
    },
};
</script>


