<template>
    <form ref="form" @submit="submit" @reset="reset">
        <input type="hidden" name="context_id" :value="context && context.pk" />
        <input v-if="item.owner_id" type="hidden" name="owner_id" :value="item.owner_id" />
        <h2 class="title is-2">
            <span v-if="item">Edit subscription</span>
            <span v-else="item">Subscribe to {{ context && context.title }}</span>
        </h2>

        <div class="notification is-info" v-if="item.isRequest">
            <span>
                Your subscription request is awaiting for approval (you still can update it).
            </span>
        </div>

        <div class="field is-horizontal">
            <div class="field-label">
                <label class="label">Role</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <p-select-role name="role" v-model:value="item.role"
                        :filter="roleFilter" title="Role">
                    </p-select-role>
                    <span class="help is-info" v-if="item.role > context.subscription_accept_role">
                        This role requires approval from moderation
                    </span>
                </div>
            </div>
        </div>
        <div class="field is-horizontal">
            <div class="field-label">
                <label class="label">Visibility</label>
            </div>
            <div class="field-body">
                <div class="field">
                    <p-select-role name="access" v-model:value="item.access"
                        :filter="accessFilter"
                        title="People being able to see you are subscribed.">
                    </p-select-role>
                </div>
            </div>
        </div>
        <div class="level-right">
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
        </div>

    </form>
</template>
<script>
import { computed, toRefs } from 'vue'
import { useStore } from 'vuex'
import { Subscription } from '../models'
import { modelForm } from '../composables'
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

        function accessFilter(role) {
            if(role.status != 'moderator' && role.status != 'admin')
                return true
            return form.context.value && role.access <= form.role.value.access
        }

        function roleFilter(role) {
            return role.status != 'anonymous' && role.status != 'registered' &&
                    accessFilter(role)
        }

        return {...form, accessFilter, roleFilter }
    },

    components: { PSelectRole },
}

</script>


