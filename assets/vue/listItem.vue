<template>
    <div :class="computedClass"
        @click="toggleSelect()" @mouseover="focus()">
        <slot :list="list" :item="item" :index="index"
            :active="active" :selected="selected">
        </slot>
    </div>
</template>

<script>
module.exports = {
    props: {
        item: { type: Object, default: null },
        index: { type: Number },
        itemClass: { type: String, default: 'list-group' },
        activeClass: { type: String, default: 'active' },
        selectedClass: { type: String, default: 'list-group-item-primary' },
    },

    computed: {
        list() {
            return this.$parent;
        },

        selector() {
            return this.list && this.list.selector;
        },

        computedClass() {
            var extra = this.active ? ' ' + this.activeClass :
                        this.selected ? ' ' + this.selectedClass: '';
            return this.itemClass + extra;
        },

        active() {
            return this.selector && this.index == this.selector.active.index
        },

        selected() {
            return this.selector && this.index == this.selector.selected.index
        },
    },

    methods: {
        toggleSelect() {
            this.selected ? this.unselect() : this.select();
        },

        select() { this.selector && this.selector.select(this.index); },
        unselect() { this.selector && this.selector.unselect(this.index); },
        focus() { this.selector && this.selector.focus(this.index); },
        blur() { this.selector && this.selector.blur(this.index); },
    },
}
</script>
