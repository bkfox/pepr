<template>
    <form ref="form" @submit="submit">
        <slot :item="item" :context="context">
            <input type="hidden" name="context_id" :value="context && context.pk" />
            <div class="field">
                <div class="control">
                    <textarea name="text" class="textarea">{{ item.text }}</textarea>
                </div>
            </div>
            <slot name="fields" :item="item" :context="context"></slot>
            <div class="level">
                <div class="level-left" v-if="showAccess">
                    <div class="field is-grouped">
                        <p-select-role name="access" v-model:value="item.access"
                            title="Visible to"
                            :filter="accessFilter">
                        </p-select-role>
                    </div>
                </div>
                <div class="level-right">
                    <div class="field is-grouped is-grouped-right">
                        <p class="control">
                            <button type="submit" class="button is-link">Publish</button>
                        </p>
                        <p class="control">
                            <button v-if="item" type="button" @click="$emit('done')" class="button is-link is-light">
                                Cancel</button>
                            <button v-else type="reset" class="button is-link is-light">
                                Reset</button>
                        </p>
                    </div>
                </div>
            </div>
        </slot>
    </form>
</template>
<script>
import {computed, toRefs} from 'vue'
import {useStore} from 'vuex'
import {Content} from '../models'
import { modelForm } from 'pepr/core/composables'
import PSelectRole from 'pepr/core/components/selectRole'

export default {
    inject: ['roles'],
    props: {
        /// Show access field
        showAccess: { type: Boolean, default: true },
        context: { type: Object, required: true },
        initial: Object,
    },

    setup(props, context) {
        const model = useStore().$db().model('content')
        const item = computed(() => new model({
            context_id: props.context && props.context.pk,
            access: props.context && Math.min(props.context.default_access,
                                              props.context.role.access),
        }))
        return modelForm(item, props, context)
    },

    methods: {
        accessFilter(role) {
            return this.context && role.access <= this.role.access
        },
    },

    components: { PSelectRole },
}
</script>
