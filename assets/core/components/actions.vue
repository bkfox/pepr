<template>
    <slot></slot>
    <template v-for="action of actions">
        <slot name="item" :item="item" :action="action">
            <p-action :item="item" :action="action" :no-text="noText" />
        </slot>
    </template>
    <slot name="after"></slot>
</template>

<script>
import { computed, inject, toRefs } from 'vue'
import { useContext } from '../composables/models'
import PAction from './action'

export default {
    props: {
        item: Object,
        noText: { type: Boolean, default: false }
    },

    setup(props, ctx) {
        const { role } = useContext()
        const actions = computed(x => role.value ? props.item && props.item.getActions(role.value)
                                                 : [])
        return { actions }
    },

    components: { PAction },
}
</script>

