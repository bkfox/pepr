<template>
    <form ref="form" @submit="submit" @reset="reset">
        <h4 class="subtitle is-4">Main settings</h4>

        <p-field label="Title" horizontal>
            <div class="field">
                <div class="control">
                    <component is="input" name="headline" type="text" v-model:value="item.title"
                        placeholder="Title" />
                </div>
            </div>
        </p-field>
        <p-field horizontal>
            <div class="field">
                <div class="control">
                    <component is="input" name="headline" type="text" v-model:value="item.headline"
                        placeholder="Headline" />
                </div>
            </div>
        </p-field>

        <p-field label="Publications' default visibility" horizontal>
            <div class="field">
                <div class="control">
                    <p-select-role :roles="roles" v-model:value="item.default_access" />
                </div>
            </div>
        </p-field>

        <h4 class="subtitle is-4">Subscriptions</h4>

        <p-field label="Allow subscription request" horizontal>
            <component is="input" type="checkbox" name="allow_subscription_request"
                v-model:value="item.allow_subscription_request" />
        </p-field>

        <!-- subscription_accept_role -->
        <p-field label="Accept Subscriptions" horizontal>
            <div class="field">
                <div class="control">
                    <p-select-role
                        :roles="subscriptionRoleChoices"
                        v-model:value="item.subscription_accept_role" />
                </div>
                <div class="help">
                Subscription requests will not need moderator approval for
                    <i><template v-for="role of subscriptionRoleChoices">
                        <template v-if="role.access <= item.subscription_accept_role">
                            {{ role.name }}
                        </template>
                    </template></i>
                </div>
            </div>
        </p-field>

        <!-- subscription_default_role -->
        <p-field label="Default role" horizontal>
            <div class="field">
                <div class="control">
                    <p-select-role
                        :roles="subscriptionRoleChoices"
                        v-model:value="item.subscription_default_role" />
                </div>
            </div>
        </p-field>

        <!-- subscription_default_role -->
        <p-field label="Default visibility" horizontal>
            <div class="field">
                <div class="control">
                    <p-select-role
                        :roles="subscriptionAccessChoices"
                        v-model:value="item.subscription_default_access" />
                </div>
            </div>
        </p-field>


        <div class="field is-grouped is-grouped-right">
            <p class="control">
                <button class="button is-link">Save</button>
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
import { Subscription } from '../models'
import { modelForm } from '../composables'
import PField from './field'
import PSelectRole from './selectRole'

export default {
    props: { 
        initial: Object,
    },

    setup(props, context) {
        const model = useStore().$db().model('context')
        const item = computed(() => new model({}))
        const form = modelForm(item, props, context)

        const roles = computed(() => Object.values(inject('roles')))
        const subscriptionRoleChoices = computed(() => form.context.value && Subscription.roleChoices(roles.value, form.context.value.role))
        const subscriptionAccessChoices = computed(() => form.context.value && Subscription.accessChoices(roles.value, form.context.value.role))

        return {...form, roles, subscriptionRoleChoices, subscriptionAccessChoices }
    },

    components: { PField, PSelectRole },
}


</script>
