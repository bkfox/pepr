<template>
    <span @click="trigger">
        <slot :item="item" :action="action">
            <component v-bind="componentProps">
                <span v-if="action.icon" class="icon is-small">
                    <i :class="action.icon"></i>
                </span>
                <span v-if="!noText">{{ action.label }}</span>
            </component>
        </slot>
    </span>
</template>

<script>
import { computed } from 'vue'
import { useContext } from '../composables/models'
import Action from '../action'

export default {
    emits: ['trigger'],
    props: {
        item: Object,
        action: Object,
        dropdown: Boolean,
        
        label: {type: String, default: ''},
        exec: Function,
        permissions: [Array,String,Function],
        icon: {type: String, default: ''},
        help: {type: String, default: ''},
        css: {type: String, default: ''},
        noText: { type: Boolean, default: false }
    },

    setup(props, {emit}) {
        const { role } = useContext()
        const action = computed(() => props.action || new Action(props))
        const componentProps = computed(() => {
            const value = props.dropdown ?
                {'is': 'a', 'class': 'dropdown-item ' + (action.value.css || '')} :
                {'is': 'button', 'class': 'button m-1 ' + (action.value.css || '')}
            return { ...value, 'title': action.help, 'aria-description': action.help}
        })

        function trigger(...args) {
            if(props.item && action.value.exec)
                action.value.trigger(role && role.value, props.item, ...args)
            emit('trigger', { role: role && role.value,
                              item: props.item,
                              args: args })
        }
        return { trigger, action, componentProps }
    },
}
</script>
