<template>
    <template v-for="(item, index) in items">
        <slot name="item" :index="index" :item="item" :items="items">
            <p-subscription :id="item.pk" :item="item"></p-subscription>
        </slot>
    </template>
</template>
<script>
import { useStore } from 'vuex'
import PList from './list'
import PSubscription from './subscription'


export default {
    extends: PList,
    setup(props) {
        let model = props.models || useStore().$db().model('subscription')
        return { model }
    },

    components: { PSubscription },
}
</script>

