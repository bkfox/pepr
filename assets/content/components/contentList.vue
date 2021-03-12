<template>
    <p-list ref="list" :model="model" :context="context" :contextUrl="contextUrl" :api-url="apiUrl" orderBy="-modifiedDate">
        <template v-slot:item="{item, items, index}">
            <slot name="item" :item="item" :items="items" :index="index">
                <div :id="item.pk" class="box">
                    <p-content :item="item"></p-content>
                </div>
                <br>
            </slot>
        </template>
    </p-list>
</template>
<script>
import coreComponents from 'pepr/core/components'
import components from './content'

export default {
    props: {
        model: Function,
        context: Object,
        contextUrl: String,
        apiUrl: String,
        showForm: Boolean,
    },

    components: {
        ...coreComponents, ...components
    },
}
</script>
