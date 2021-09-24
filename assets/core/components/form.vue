<template>
    <form :method="method" :action="action" @submit="submit({event: $event})">
        <slot :model="model" :data="data" :reset="reset" :resetErrors="resetErrors" v-bind="$attrs"></slot>
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
        const modelComp = composables.useModel({...propsRefs, item: propsRefs.initial});
        const formComp  = composables.form({...propsRefs, ...modelComp}, context_)
        const data = formComp.data
        const method = computed(() => modelComp.model.value ? (data.$id ? 'PUT' : 'POST')
                                                            : (props.method || 'POST'))

        function submit({event, form, ...config}={}) {
            if(event) {
                event.preventDefault()
                event.stopPropagation()
                form = form || event.target
            }

            const url = form.getAttribute('action') || props.action
            const method = form.getAttribute('method') || method.value
            return formComp.submit({ form, url, method, ...config})
        }
        
        return {...modelComp, ...formComp, method, submit}
    },


}
</script>
