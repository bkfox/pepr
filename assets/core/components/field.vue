<template>
    <div :class="{field: true}">
        <label class="label" v-if="label">{{ label }}</label>
        <div :class="{control: true, hasIconsLeft: leftIcons, hasIconsRight: rightIcons}">
            <slot :field='name' :error="error"></slot>
            <template v-if="leftIcons">
                <span v-for="icon in leftIcons" class="icon is-small is-left">
                    <i :class="icon"></i>
                </span>
            </template>
            <template v-if="rightIcons">
                <span v-for="icon in rightIcons" class="icon is-small is-right">
                    <i :class="icon"></i>
                </span>
            </template>
        </div>
        <span v-if="error" class="help is-danger">{{ error }}</span>
        <slot name="help"></slot>
    </div>
</template>
<script>
import {computed, inject} from 'vue'

export default {
    props: {
        label: String,
        name: String,
        leftIcons: Array,
        rightIcons: Array,
    },

    setup(props) {
        const errors = inject('errors')
        const error = computed(() => errors && errors[props.name])
        return { error }
    },
}
</script>
