<template>
    <template v-if="$slots.filters">
        <p-list-filters @submit.native="fetch($event)">
            <slot name="filters" :list="list" :pagination="pagination"></slot>
        </p-list-filters>
    </template>
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
        ...composables.fetchList.props({ default: true }),
    },

    setup(props) {
        let propsRefs = toRefs(props)
        let modelComp = composables.useModel(propsRefs)
        let listComp = composables.getList({...propsRefs, ...modelComp})
        let fetchComp = composables.fetchList({...propsRefs, ...listComp})

        watch(propsRefs.filters, (filters) => props.fetchAuto && filters != propsRefs.filters.value
                                                && fetchComp.fetch({filters}))
        return {...modelComp, ...listComp, ...fetchComp}
    },
}
</script>
