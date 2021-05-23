<template>
    <form ref="form" @submit="submit" @reset="reset">
        <input type="hidden" name="context_id" :value="context && context.pk" />
        <input v-if="data.owner_id" type="hidden" name="owner_id" :value="data.owner_id" />
        <div class="notification is-info" v-if="data.isRequest">
            <span>
                Your subscription request is awaiting for approval (you still can update it).
            </span>
        </div>

        <p-field-row label="Role">
            <p-field name="role">
                <p-select-role name="role" v-model:value="data.role"
                    :roles="roleChoices" title="Role">
                </p-select-role>
                <template #help>
                    <span class="help is-info" v-if="data.role > context.subscription_accept_role">
                        This role requires approval from moderation
                    </span>
                </template>
            </p-field>
        </p-field-row>
        <p-field-row label="Visibility">
            <p-field name="access">
                <p-select-role name="access" v-model:value="data.access"
                    :roles="accessChoices"
                    title="People being able to see you are subscribed.">
                </p-select-role>
            </p-field>
        </p-field-row>
        <div class="field is-grouped is-grouped-right">
            <p class="control">
                <button class="button is-link">
                    <template v-if="data">Save</template>
                    <template v-else>Subscribe</template>
                </button>
            </p>
            <p class="control">
                <button v-if="data" type="button" @click="reset() || $emit('done')" class="button is-link is-light">
                    Cancel</button>
            </p>
        </div>
    </form>
</template>
<script>
import { computed, inject, toRefs } from 'vue'
import { useStore } from 'vuex'
import * as composables from 'pepr/core/composables'
import PField from './field'
import PFieldRow from './fieldRow'
import PSelectRole from './selectRole'

export default {
    props: {
        ...composables.form.props({commit:true, constructor:'subscription'}),
    },

    setup(props, context) {
        const propsRefs = toRefs(props)
        const formComp = composables.form(propsRef, context_)
        const contextComp = composables.useParentContext(form.data)

        const model = formComp.constructor
        const {role, roles} = contextComp;
        const accessChoices = computed(
            () => role.value && model.value.accessChoices(role.value, roles.value)
        )
        const roleChoices = computed(
            () => role.value && model.value.roleChoices(role.value, roles.value)
        )

        return {...formComp, ...contextComp, accessChoices, roleChoices }
    },

    components: { PField, PFieldRow, PSelectRole },
}

</script>


