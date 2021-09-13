<template>
    <div class="control has-icons-left">
        <div class="select">
            <select v-bind="$attrs" v-model="value">
                <template v-for="role of options">
                    <option :value="role.access" :selected="role.access == value">
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
import { computed, ref, toRefs, watch } from 'vue'
import * as composables from '../composables'

export default {
    inheritAttrs: false,
    emits: ['update:value'],

    props: {
        value: { type: [Number,String], default: null },
        roles: { type: Array, default: null },
        filter: { type: Function, default: null },
    },

    setup(props, { emit }) {
        const {roles, filter, value} = toRefs(props)
        const contextComp = composables.useContext()
        
        const options = computed(() => {
            var roles_ = roles.value ? roles.value : contextComp.roles.value
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
}

</script>

