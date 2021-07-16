<template>
    <form :method="method" :action="action">
        <slot :data="data"></slot>
    </form>
</template>
<script>
import { toRefs } from 'vue'
import * as composables from '../composables'

export default {
    props: {
        ...composables.useModel.props(),
        ...composables.form.props({commit:true}),
    },

    setup(props, context_) {
        const propsRefs = toRefs(props)
        // const contextComp = composables.useContext()
        const modelComp = composables.useModel(propsRefs);
        const formComp  = composables.form({...propsRefs, ...modelComp}, context_)
        return {...modelComp, ...formComp}
    },


}
</script>
