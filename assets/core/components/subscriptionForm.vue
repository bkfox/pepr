<template>
    <form ref="form" @submit="submit" @reset="reset">
        <input type="hidden" name="context_id" :value="context && context.pk" />
        <input v-if="item.owner_id" type="hidden" name="owner_id" :value="item.owner_id" />
        <div class="notification is-info" v-if="item.isRequest">
            <span>
                Your subscription request is awaiting for approval (you still can update it).
            </span>
        </div>

        <p-field label="Role" horizontal>
            <div class="field">
                <p-select-role name="role" v-model:value="item.role"
                    :roles="roleChoices" title="Role">
                </p-select-role>
                <span class="help is-info" v-if="item.role > context.subscription_accept_role">
                    This role requires approval from moderation
                </span>
            </div>
        </p-field>
        <p-field label="Visibility" horizontal>
            <div class="field">
                <p-select-role name="access" v-model:value="item.access"
                    :roles="accessChoices"
                    title="People being able to see you are subscribed.">
                </p-select-role>
            </div>
        </p-field>
        <div class="field is-grouped is-grouped-right">
            <p class="control">
                <button class="button is-link">
                    <template v-if="item">Save</template>
                    <template v-else>Subscribe</template>
                </button>
            </p>
            <p class="control">
                <button v-if="item" type="button" @click="reset() || $emit('done')" class="button is-link is-light">
                    Cancel</button>
            </p>
        </div>
    </form>
</template>
<script>
import { computed, inject, toRefs } from 'vue'
import { useStore } from 'vuex'
import { modelForm } from '../composables'
import PField from './field'
import PSelectRole from './selectRole'

export default {
    props: {
        context: { type: Object, required: true },
        initial: Object,
    },

    setup(props, context) {
        const model = useStore().$db().model('subscription')
        const item = computed(() => new model({
            context_id: props.context && props.context.pk,
            access: props.context && props.context.subscription_default_access,
            role: props.context && props.context.subscription_default_role,
        }))
        const form = modelForm(item, props, context)

        const roles = computed(() => Object.values(inject('roles')))
        const accessChoices = computed(
            () => model.accessChoices(form.context.value.role, roles.value)
        )
        const roleChoices = computed(
            () => model.roleChoices(form.context.value.role, roles.value)
        )

        return {...form, accessChoices, roleChoices }
    },

    components: { PField, PSelectRole },
}

</script>


