<template>
    <div v-if="dropdown && actions.length > 1" class="dropdown hoverable">
        <div class="dropdown-trigger">
            <slot name="button">
                <p-action :item="item" :action="actions[0]" />
            </slot>
        </div>
        <div class="dropdown-menu" role="menu">
            <div class="dropdown-content">
                <template v-for="action of actions.slice(1)">
                    <slot name="item" :item="item" :action="action">
                        <p-action v-if="action instanceof Action" :item="item" :action="action" :no-text="noText"
                                dropdown>
                            <slot name="action"></slot>
                        </p-action>
                    </slot>
                </template>
                <slot></slot>
            </div>
        </div>
    </div>
    <div v-else>
        <template v-for="action of actions">
            <slot name="item" :item="item" :action="action">
                <p-action :item="item" :action="action" :no-text="noText">
                    <slot name="action"></slot>
                </p-action>
            </slot>
        </template>
        <slot></slot>
    </div>
</template>

<script>
import { computed, inject, toRefs } from 'vue'
import { useContext } from '../composables/models'
import PAction from './action'

export default {
    props: {
        item: Object,
        actions: Array,
        dropdown: Boolean,
        noText: { type: Boolean, default: false }
    },

    setup(props, ctx) {
        const { role } = useContext()
        const actions = computed(() => props.actions || (
            role.value && props.item?.getActions(role.value) || []
        ))
        return { actions }
    },

    components: { PAction },
}
</script>

