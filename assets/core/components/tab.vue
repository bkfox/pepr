<template>
    <li :class="{'is-active': isActive}">
        <a :class="{'is-active': isActive}" @click="$parent.select(target)">
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
    },

    computed: {
        isActive() {
            return this.$parent.selected == this.target
        }
    },
}
</script>
