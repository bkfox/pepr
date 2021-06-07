<template>
    <template v-if="list">
        <template v-for="(item, index) in list">
            <slot name="item" :index="index" :item="item" :list="list"></slot>
        </template>
    </template>
</template>
<script>
import { toRefs, watch } from 'vue'
import * as composables from '../composables'

export default {
    props: {
        ...composables.useModel.props(),
        ...composables.getList.props(),
        ...composables.fetchList.props(),
        fetchAuto: { type: Boolean, default: true },
    },

    setup(props) {
        let propsRefs = toRefs(props)
        let modelComp = composables.useModel(propsRefs)
        let listComp = composables.getList({...props, ...modelComp})
        let fetchComp = composables.fetchList(listComp)

        watch(propsRefs.url, (url) => propsRefs.fetchAuto.value && fetchComp.fetch({url}))
        watch(propsRefs.filters, (filters) => propsRefs.fetchAuto.value && fetchComp.fetch({filters}))
        return {...listComp, ...fetchComp}
    },

    mounted() {
        if(this.fetchAuto && (this.url || this.model))
            this.fetch()
    },
}
</script>
