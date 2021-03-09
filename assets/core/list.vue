<template>
    <div>
        <div class="">
        <div v-for="content in self.content">
            <slot name="content">{{ content.html }}</slot>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        model: { type: Function },
        context: { type: String },
        orderBy: { type: String },
    },

    computed: {
        itemsQuery() {
            let query = this.model.query();
            if(this.orderBy)
                query = query.orderBy(this.orderBy)
            if(this.context)
                query = query.where('context', (context) => context == this.context)
            return query
        },

        items() {
            return this.itemsQuery.get()
        },

        loadData(data) {
            for(let entity in data) {
                let model = this.$store.$db.model(entity);
                model && model.insert({ data: data[entity] })
                if(!model)
                    console.warn(`model ${entity} is not a registered model`)
            }
        },

        /// Load data from `data` slot.
        loadDataSlot() {
            let slot = self.$slots['data'];
            if(!slot || !slot.length)
                return

            for(var item of slot) {
                item = item.children && item.children[0]
                if(!item || !item.text)
                    return

                try {
                    const data = JSON.parse(item.text)
                    if(data)
                        this.loadData(data);
                }
                catch(e) { console.error(e); }
            }
        },
    },
}
</script>
