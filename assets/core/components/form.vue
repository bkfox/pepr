<template>
    <form :method="method" :action="action" @submit="submit">
        <slot :data="data" v-bind="$attrs"></slot>
    </form>
</template>
<script>
import { computed, toRefs } from 'vue'
import * as composables from '../composables'

export default {
    emits: [...composables.form.emits],
    props: {
        ...composables.useModel.props(),
        ...composables.form.props({commit:true}),
    },

    setup(props, context_) {
        const propsRefs = toRefs(props)
        // const contextComp = composables.useContext()
        const modelComp = composables.useModel(propsRefs);
        const formComp  = composables.form({...propsRefs, ...modelComp}, context_)
        const data = formComp.data;
        const method = computed(() => modelComp.model ? data.value && data.value.$id ? 'PUT' : 'POST'
                                                      : props.method || 'POST')
        return {...modelComp, ...formComp, method}
    },


}
</script>
