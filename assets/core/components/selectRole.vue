<template>
    <div class="control has-icons-left">
        <div class="select">
            <select v-bind="$attrs" @change="computedValue=$event.target.value"
                    :value="computedValue">
                <option v-for="role of roles" :value="role.access">
                    {{ role.name }}
                </option>
            </select>
        </div>
        <span class="icon is-left">
            <i class="mdi mdi-eye"></i>
        </span>
    </div>
</template>
<script>
import { computed, inject, ref, toRefs } from 'vue'

export default {
    inheritAttrs: false,

    setup(props, context) {
        const value = ref(props.value)
        return { value }
    },

    props: {
        value: [Number,String],
        roles: { type: [Array,Object], default: [] },
        filter: { type: Function, default: null },
    },

    computed: {
        computedValue: {
            get() {
                return this.value
            },
            set(value) {
                this.value = value;
                this.$emit('update:value', value)
            }
        },
    },
}

</script>

