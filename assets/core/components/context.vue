<template>
    <slot v-if="context"></slot>
</template>
<script>
import { computed, provide, ref } from 'vue'
import { useStore } from 'vuex'
import { Context } from '../models'

export default {
    props: {
        context: Object,
        contextId: String,
    },

    setup(props) {
        const model = useStore().$db().model('context');
        const contextId = ref(props.contextId)
        const context = computed(() => props.context || model.find(props.contextId))
        const role = computed(() => context.value && context.value.role)
        const subscription = computed(() => context.value.subscription);

        provide('context', context)
        provide('role', role)
        provide('subscription', subscription)

        //watch(contextId, (value) => {
        //})

        return { model, contextId, context, role, subscription }
    },
}
</script>
