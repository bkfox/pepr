<template>
    <div>
        <ul>
            <slot :selected="selected" :select="select"></slot>
        </ul>
    </div>
</template>
<script>
import { singleSelect } from '../composables'

export default {
    emits: singleSelect.emits,
    props: singleSelect.props(),

    setup(props, { emit }) {
        return singleSelect(props, emit)
    },

}
</script>
