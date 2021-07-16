<template>
    <template v-if="list">
        <slot name="top" :list="list" :pagination='pagination'
            :fetch='fetch' :fetchNext='fetchNext' :fetchPrev='fetchPrev'></slot>
        <template v-for="(item, index) in list">
            <slot name="item" :index="index" :item="item" :list="list"
                :pagination='pagination'
                :fetch='fetch' :fetchNext='fetchNext' :fetchPrev='fetchPrev'></slot>
        </template>
        <slot name="bottom" :list="list" :pagination='pagination'
            :fetch='fetch' :fetchNext='fetchNext' :fetchPrev='fetchPrev'></slot>
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
        let listComp = composables.getList({...propsRefs, ...modelComp})
        let fetchComp = composables.fetchList(listComp)

        watch(propsRefs.url, (url) => props.fetchAuto && fetchComp.fetch({url}))
        watch(propsRefs.filters, (filters) => props.fetchAuto && fetchComp.fetch({filters}))
        return {...listComp, ...fetchComp}
    },

    mounted() {
        if(this.fetchAuto && (this.url || this.model))
            this.fetch()
    },
}
</script>
