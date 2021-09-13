<template>
    <span @click="trigger">
        <slot :item="item" :action="action">
            <button :class="'button is-light ' + (action && action.css || '')"
                    :title="help || action && action.help"
                    :aria-description="help || action && action.help">
                <span v-if="icon || action && action.icon" class="icon is-small">
                    <i :class="icon || action && action.icon"></i>
                </span>
                <span v-if="!noText">{{ label || action && action.label }}</span>
            </button>
        </slot>
    </span>
</template>

<script>
import { useContext } from '../composables/models'
export default {
    emits: ['trigger'],
    props: {
        item: Object,
        action: Object,
        label: String,
        help: String,
        icon: String,
        noText: { type: Boolean, default: false }
    },

    setup(props, {emit}) {
        const { role } = useContext()

        function trigger(...args) {
            if(props.item && props.action)
                props.action.trigger(role && role.value, props.item, ...args)
            emit('trigger', { role: role && role.value,
                              item: props.item,
                              args: args })
        }

        return { trigger }
    },
}
</script>
