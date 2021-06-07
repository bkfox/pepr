<template>
    <template v-if="list">
        <template v-for="(item, index) in list">
            <slot name="item" :index="index" :item="item" :list="list">
                <p-content :id="item.pk" :item="item"></p-content>
            </slot>
        </template>
    </template>
</template>
<script>
import PList from 'pepr/core/components/list'
import PContent from './content'

export default {
    extends: PList,
    components: { PContent },
}
</script>
