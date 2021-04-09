<template>
    <template v-for="(item, index) in items">
        <slot name="item" :index="index" :item="item" :items="items">
            <p-content :id="item.pk" :item="item"></p-content>
        </slot>
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
