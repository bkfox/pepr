<template>
    <div class="control has-icons-left">
        <div class="select">
            <select v-bind="$attrs" @change="computedValue=Number($event.target.value)"
                    :value="computedValue">
                <template v-for="role of options">
                    <option :value="role.access" :selected="role.access == computedValue">
                    {{ role.name }}
                    </option>
                </template>
            </select>
        </div>
        <span class="icon is-left">
            <i class="mdi mdi-eye"></i>
        </span>
    </div>
</template>
<script>
import { computed, ref, toRefs } from 'vue'
import * as composables from '../composables'

export default {
    inheritAttrs: false,
    emits: ['update:value'],

    props: {
        value: { type: [Number,String], default: null },
        roles: { type: Array, default: null },
        filter: { type: Function, default: null },
    },

    setup(props) {
        const {roles, filter} = toRefs(props)
        const contextComp = composables.useContext()
        const value = ref(Number(props.value))
        const options = computed(() => {
            var roles_ = roles.value ? role.value : contextComp.roles.value
            if(!filter.value)
                return roles_

            const options = []
            if(roles) {
                for(var role of Object.values(roles_)) {
                    if(filter.value(role))
                        options.push(role)
                }
                options.sort((x, y) => x.access < y.access)
            }
            return options
        })
        return { ...contextComp, value, options }
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

