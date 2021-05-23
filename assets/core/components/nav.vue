<template>
    <nav @click.native="onClick">
        <slot></slot>
    </nav>
</template>
<script>
import { computed, provide, watch } from 'vue'
import { singleSelect } from '../composables'

export default {
    props: {
        default: { type: String, default: 'default' },
        // deck: { type: Object },
    },

    setup(props, { emit }) {
        var select = singleSelect(props, emit)

        function onClick(event) {
            let el = event.target
            if(!el.hasAttribute('target'))
                return

            event.preventDefault()
            event.stopPropagation()

            select.select(el.getAttribute('target'))
        }
        return { ...select, onClick }
    },
}

</script>
