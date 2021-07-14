<template>
    <div class="control has-icons-left">
        <div class="select">
            <select v-bind="$attrs" @change="computedValue=$event.target.value"
                    :value="computedValue">
                <template v-for="role of options">
                    <option :value="role.access">
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

    setup(props) {
        const {filter} = toRefs(props)
        const contextComp = composables.useContext()
        const value = ref(props.value)
        const options = computed(() => {
            if(!filter.value)
                return contextComp.roles.value

            const roles = contextComp.roles.value
            const options = []
            if(roles) {
                for(var role of Object.values(roles)) {
                    if(filter.value(role))
                        options.push(role)
                }
                options.sort((x, y) => x.access < y.access)
            }
            return options
        })
        return { ...contextComp, value, options }
    },

    props: {
        // value: [Number,String],
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

