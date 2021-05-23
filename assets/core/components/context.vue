<template>
    <slot v-if="context"></slot>
</template>
<script>
import { computed, provide, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { Context } from '../models'
import * as composables from '../composables'

export default {
    props: {
        ...composables.useContextById.props,
    },

    setup(props, context) {
        const propsRefs = toRefs(props)
        const contextId = ref(propsRefs.contextId && propsRefs.contextId.value)
        const contextComp = composables.useContextById({...propsRefs, contextId, fetch: true})

        watch(propsRefs.contextId, (id) => { contextId.value = id })

        return {...contextComp, contextId}
    },
}
</script>
