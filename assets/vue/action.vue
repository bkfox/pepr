<template>
    <button @click="onClick">
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
        item: { type: Object, default: null },
        handler: { type: [Object,String] },
        payload: { type: Object, default: () => {} },
        method: { type: String },
        kwargs: { type: Object, default: () => {} },
    },

    methods: {
        onClick(event) {
            const ev = Object.assign({
                action: this.action,
                path: this.path,
                item: this.item,
                handler: this.handler,
                payload: Object.assign(this.payload || {}, {method: this.method}),
            }, this.kwargs);
            this.$root.action(ev);
        },
    },
}
</script>

