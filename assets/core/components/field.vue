<template>
    <div :class="{field: true, 'has-ico': horizontal}">
        <label class="label" v-if="label">{{ label }}</label>
        <div class="{control: true, hasIconsLeft: leftIcons, hasIconsRight: rightIcons">
            <slot :field='name' :error="error"></slot>
            <span v-if="leftIcons" v-for="icon of leftIcons" class="icon is-small is-left">
                <i :class="icon"></i>
            </span>
            <span v-if="rightIcons" v-for="icon of rightIcons" class="icon is-small is-right">
                <i :class="icon"></i>
            </span>
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
    },

    setup(props) {
        const errors = inject('errors')
        const error = computed(() => errors && errors[props.name])
        return { error, controlClass }
    },
}
</script>
