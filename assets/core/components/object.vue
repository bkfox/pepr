<template>

</template>
<script>
import { ref, toRefs, watch } from 'vue'
import * as composables from '../composables'

export default {
    props: {
        ...composables.getOrFetch.props(),
    },

    setup(props) {
        const propsRefs = toRefs(props)
        return composables.getOrFetch(propsRefs)
    },
}
</script>
