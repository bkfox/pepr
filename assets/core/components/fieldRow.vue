<template>
    <div class="field is-horizontal">
        <div v-if="label" class="field-label">
            <label class="label">{{ label }}</label>
        </div>
        <div v-else class="field-label"></div>
        <div class="field-body">
            <slot></slot>
        </div>
    </div>
</template>
<script>
import {computed, inject} from 'vue'

export default {
    props: {
        label: String,
        name: String,
        horizontal: { type: Boolean, default: false },
    },

    setup(props) {
        const errors = inject('errors')
        const error = computed(() => errors && errors[props.name])
        return { error }
    },
}
</script>
