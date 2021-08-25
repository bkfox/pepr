<template>
    <slot v-if="context" :context="context" :role="context.role" :roles="context.roles"
        :subscription="context.subscription"></slot>
</template>
<script>
import { ref, toRefs, watch } from 'vue'
import * as composables from '../composables'

export default {
    props: {
        ...composables.useContextById.props(),
    },

    setup(props) {
        const propsRefs = toRefs(props)
        const contextId = ref(propsRefs.contextId && propsRefs.contextId.value)
        const contextComp = composables.useContextById({...propsRefs, contextId, fetch: true})

        watch(propsRefs.contextId, (id) => { contextId.value = id })

        return {...contextComp, contextId}
    },
}
</script>
