<template>
    <button @click="onClick" v-if="visible"
        :aria-label="title" :aria-description="description"
        :title="description">
        <slot v-if="$slots.default">
        </slot>
        <span v-else>
            <span :class="['fas', icon]">
            </span>
            {{ title }}
        </span>
    </button>
</template>

<script>
export default {
    props: {
        // informations
        icon: { type: String },
        title: { type: String },
        description: { type: String },

        // 'action' event
        action: { type: String },
        api_action: { type: String },
        ask: { type: String, default: null },

        // common action arguments
        kwargs: { type: Object, default: () => {} },
        path: { type: String },
        item: { type: Object, default: null },
        data: { type: Object, default: null },
        handler: { type: [Object,String] },
        payload: { type: Object, default: null },
        method: { type: String },
    },

    computed: {
        visible() {
            const actions = this.item && this.item.actions;
            return !(actions instanceof Array) ||
                   actions.includes(this.api_action)
        }
    },

    methods: {
        closeParent() {
            if(this.$parent.hide)
                this.$parent.hide(true)
        },

        onClick(event) {
            this.closeParent();

            const ev = Object.assign({
                action: this.action,
                ask: this.ask,
                path: this.path,
                item: this.item,
                data: this.data,
                handler: this.handler,
                payload: Object.assign(this.payload || {}, {method: this.method}),
            }, this.kwargs);
            ev.request = this.$root.action(ev);
            this.$emit('action', ev)
        },
    },
}
</script>

