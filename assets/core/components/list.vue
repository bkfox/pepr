<template>
    <template v-for="(item, index) in items">
        <slot name="item" :index="index" :item="item" :items="items"></slot>
    </template>
</template>
<script>
import { nextTick } from 'vue'

export default {
    props: {
        model: Function,
        // FIXME: db query filters
        filters: Object,
        context: Object,
        contextFilter: { type: String, default: 'context' },
        orderBy: String,
        url: String,
    },

    provide() {
        return {
            context: this.context
        }
    },

    computed: {
        itemsQuery() {
            let query = this.model.query();
            if(this.orderBy) {
                let [order, dir] = this.orderBy.startsWith('-') ?
                    [this.orderBy.slice(1), 'desc'] : [this.orderBy, 'asc'];
                query = query.orderBy((obj) => obj[order], dir)
            }
            if(this.context)
                query = query.where('context_id', this.context.pk)
            return query
        },

        items() {
            let items = this.itemsQuery.get()
            return items
        },
    },

    methods: {
        /**
         * Fetch item from list.
         */
        fetch(url, {context=null,filters=null, ...config}={}) {
            if(context || filters) {
                let params = new URLSearchParams(filters || {})
                if(context && this.contextFilter)
                    params.append(this.contextFilter, context.pk)
                url = `${url}?${params.toString()}`
            }
            return this.model.api().get(url, { dataKey: 'results', ...config})
                // FIXME: Vuex ORM API bug about using local store?
                .then(r => this.model.insertOrUpdate({data: r.response.data.results}))
        },

        /**
         * Load list using components properties as default fetch's
         * config.
         */
        load({url=null, context=null, filters=null, ...config}) {
            return this.fetch(url || this.url || this.model.baseURL, {
                filters: filters || this.filters,
                context: context || this.context,
            })
        }
    },

    watch: {
        context(context, old) {
            this.load({context})
        },

        filters(filters, old) {
            this.load({filters})
        },
    },

    mounted() {
        if(this.context)
            this.load({context: this.context})
    },
}
</script>
