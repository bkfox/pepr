<template>
    <form ref="form" @submit="submit" :action="data.$fullUrl"
            :method="data.$id ? 'PUT' : 'POST'">
        <h4 class="subtitle is-4">Main settings</h4>

        <p-field-row label="Title">
            <p-field name="title">
                <component is="input" name="title" type="text" v-model:value="data.title"
                    placeholder="Title" />
            </p-field>
        </p-field-row>

        <slot name="main"></slot>

        <p-field-row label="Publications' default visibility">
            <p-field name="default_access">
                <p-select-role v-model:value="data.default_access" />
            </p-field>
        </p-field-row>

        <slot name="main" :data="data"></slot>

        <h4 class="subtitle is-4">Subscriptions</h4>

        <p-field-row label="Allow subscription request">
            <p-field name="allow_subscription_request">
                <component is="input" type="checkbox" name="allow_subscription_request"
                    v-model:value="data.allow_subscription_request" />
            </p-field>
        </p-field-row>

        <!-- subscription_accept_role -->
        <p-field-row label="Accept subscriptions">
            <p-field name="subscription_accept_role">
                <p-select-role
                    :roles="data.roles"
                    v-model:value="data.subscription_accept_role" />
                <template #help>
                Subscription requests will not need moderator approval for
                <i><template v-for="role of subscriptionRoleChoices">
                        <template v-if="role.access <= data.subscription_accept_role">
                        {{ role.name }}
                        </template>
                    </template></i>
                </template>
            </p-field>
        </p-field-row>

        <!-- subscription_default_role -->
        <p-field-row label="Default role">
            <p-field name="subscription_default_role">
                <p-select-role
                    :roles="data.roles"
                    v-model:value="data.subscription_default_role" />
            </p-field>
        </p-field-row>

        <!-- subscription_default_role -->
        <p-field-row label="Default visibility">
            <p-field name="subscription_default_access">
                <p-select-role
                    :roles="data.roles"
                    v-model:value="data.subscription_default_access" />
            </p-field>
        </p-field-row>

        <slot :data="data"></slot>

        <div class="field is-grouped is-grouped-right">
            <p class="control">
                <button class="button is-link">Save</button>
            </p>
            <p class="control">
                <button v-if="data" type="button" @click="reset() || $emit('done')" class="button is-link is-light">
                    Cancel</button>
            </p>
        </div>
    </form>
</template>
<script>
import { computed, toRefs } from 'vue'
import { Subscription } from '../models'
import * as composables from '../composables'
import PField from './field'
import PFieldRow from './fieldRow'
import PSelectRole from './selectRole'

export default {
    props: {
        ...composables.form.props({commit:true, constructor: 'context'}),
    },

    setup(props, context_) {
        const propsRefs = toRefs(props)
        const formComp  = composables.form(propsRefs, context_)
        const contextComp = composables.useContext(formComp.data)

        const {role, roles} = contextComp;
        const subscriptionRoleChoices = computed(() =>
            role.value && Subscription.roleChoices(Object.values(roles.value), role.value)
        )
        const subscriptionAccessChoices = computed(() =>
            role.value && Subscription.accessChoices(Object.values(roles.value), role.value)
        )

        return {...formComp, ...contextComp, subscriptionRoleChoices, subscriptionAccessChoices }
    },

    components: { PField, PFieldRow, PSelectRole },
}


</script>
