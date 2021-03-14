<template>
    <div>
        <p-list ref="list" :model="model" :context="context" :contextUrl="contextUrl" :api-url="apiUrl" orderBy="-modified">
            <template v-slot:item="{item, items, index}">
                <slot name="item" :item="item" :items="items" :index="index">
                    <p-content :id="item.pk" :item="item" class="box"></p-content>
                </slot>
            </template>
        </p-list>
    </div>
</template>
<script>
import Action from 'pepr/core/action'
import * as coreComponents from 'pepr/core/components'
import * as components from './content'


export const actions = [
    new Action('Edit', ['update'], (item, comp) => {
        comp.edit = true
    }),
    new Action('Delete', ['destroy'], (item, comp) => {
        if(confirm('Delete?'))
            item.delete({ delete: 1})
    }),
]

export default {
    data() {
        return {
            formItem: null,
        }
    },

    provide() {
        return {
            actions
        }
    },

    props: {
        model: Function,
        context: Object,
        contextUrl: String,
        apiUrl: String,
    },

    components: {
        ...coreComponents, ...components
    },
}
</script>
