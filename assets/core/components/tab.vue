<template>
    <li :class="{'is-active': isActive}">
        <a :class="{'is-active': isActive}" @click="$parent.select({target: target, value: value})">
            <span v-if="icon" class="icon"><i :class="icon"></i></span>
            <slot :isActive="isActive"></slot>
        </a>
    </li>
</template>
<script>
export default {
    props: {
        target: String,
        icon: String,
        value: { type: [Object,String,Number,Boolean], default: null }
    },

    // TODO/
    // - isActive: in data
    // - singleSelect:
    //      - FIXME: propsRefs as arg instead of props
    //      - default value
    //      - provide custom onSelect handler
    //  - tabs:
    //      - update isActive of item

    computed: {
        isActive() {
            return this.$parent.selected == { target: this.target, value: this.value }
        }
    },
}
</script>
