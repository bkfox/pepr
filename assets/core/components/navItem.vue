<template>
    <a :class="{ 'is-active': isActive }" :href="href" :target="target">
        <span v-if="icon" class="icon is-small">
            <i :class="icon"></i>
        </span>
        <slot></slot>
    </a>
</template>
<script>
import { computed, inject } from 'vue'

export default {
    props: {
        icon: { type: String },
        target: { type: String },
        href: { type: String, default: '#' },
    },

    computed: {
        isActive() {
            return this.$parent.selected == this.target
        },
    },
}
</script>
