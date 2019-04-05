<template>
    <button @click="onClick" v-if="visible">
        <slot></slot>
    </button>
</template>

<script>
export default {
    props: {
        // informations
        name: { type: String },
        icon: { type: String },
        title: { type: String },
        description: { type: String },

        // 'action' event
        action: { type: String },
        path: { type: String },
        ask: { type: String, default: null },
        item: { type: Object, default: null },
        handler: { type: [Object,String] },
        payload: { type: Object, default: () => {} },
        method: { type: String },
        kwargs: { type: Object, default: () => {} },
    },

    computed: {
        visible() {
            var data = this.item.data;
            var r = !data || data.actions && data.actions.includes(this.name);
            console.log(this.item, r, this.name);
            return r;
        }
    },

    methods: {
        onClick(event) {
            const ev = Object.assign({
                action: this.action,
                path: this.path,
                item: this.item,
                handler: this.handler,
                payload: Object.assign(this.payload || {}, {method: this.method}),
                ask: this.ask
            }, this.kwargs);
            this.$root.action(ev);
        },
    },
}
</script>

