<template>
    <form ref="form" @submit="submit">
        <slot :data="data" :context="context">
            <input type="hidden" name="context_id" :value="context && context.pk" />
            <div class="field">
                <div class="control">
                    <textarea name="text" class="textarea">{{ data.text }}</textarea>
                </div>
            </div>
            <slot name="fields" :data="data" :context="context"></slot>
            <div class="level">
                <div class="level-left" v-if="showAccess">
                    <div class="field is-grouped">
                        <p-select-role name="access" v-model:value="data.access"
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
                            <button v-if="data" type="button" @click="$emit('done')" class="button is-link is-light">
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
import {Content} from '../models'
import * as composables from 'pepr/core/composables'
import { PField, PFieldRow, PSelectRole} from 'pepr/core/components'

export default {
    inject: ['roles'],
    props: {
        ...composables.form.props({commit:true, constructor: 'content'}),
        ...composables.useContext.props(),

        /// Show access field
        showAccess: { type: Boolean, default: true },
    },

    setup(props, context_) {
        const propsRefs = toRefs(props)
        const contextComp = composables.useContext(propsRefs.context)
        const defaults = computed(() => {
            context_id: contextComp.context.value && contextComp.context.value.$id
        })
        const formComp = composables.form({...propsRefs, defaults}, context_)
        return { ...formComp, ...contextComp }
    },

    methods: {
        // TODO: in composable
        accessFilter(role) {
            return this.context && role.access <= this.role.access
        },
    },

    components: { PField, PFieldRow, PSelectRole },
}
</script>
