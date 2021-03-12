<template>
    <div v-for="(item, index) in items">
        <slot name="item" :index="index" :item="item" :items="items"></slot>
    </div>
</template>
<script>
import { nextTick } from 'vue'

export default {
    props: {
        model: Function,
        context: Object,
        contextUrl: String,
        contextFilter: { type: String, default: 'context' },
        orderBy: String,
        apiUrl: String
    },

    computed: {
        itemsQuery() {
            let query = this.model.query();
            if(this.orderBy) {
                query = this.orderBy.startsWith('-') ?
                        query.orderBy(this.orderBy.slice(1), 'desc') :
                        query.orderBy(this.orderBy)

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
        fetchContext(url, {context=null, search={}, ...config}={}) {
            context = context || this.context
            if(!context)
                return
            let params = new URLSearchParams(search)
            params.append(this.contextFilter, context.pk)
            return this.fetch(`${url}?${params.toString()}`, config)
        },

        fetch(url, config={}) {
            return this.model.api().get(url, { dataKey: 'results', ...config})
        },
    },

    watch: {
        context(context, oldContext) {
            this.fetchContext(this.apiUrl, {context});
        }
    },
}
</script>
