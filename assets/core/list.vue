<template>
    <div>
        <div v-for="(item, index) in items">
            <slot name="item" :index="index" :item="item" :items="items"></slot>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        model: { type: Function },
        contextId: { type: String },
        orderBy: { type: String },
    },

    computed: {
        itemsQuery() {
            let query = this.model.query();
            if(this.orderBy)
                query = query.orderBy(this.orderBy)
            if(this.context)
                query = query.where('context_id', (id) => id == this.context.id)
            return query
        },

        items() {
            console.log(this.itemsQuery.get(), this.model.all())
            return this.itemsQuery.get()
        },
    },
}
</script>
