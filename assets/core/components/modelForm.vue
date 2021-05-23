<template>
    <form :method="method" :action="action">

    </form>
</template>
<script>
import modelForm from '../composables/form'

export default {
    props: {
        initial: Object,
        model: String,
    },

    setup(props, context) {
        const model = useStore().$db().model(props.model)
        const item = computed(() => new model({}))
        const form = modelForm(item, props, context)

        const roles = computed(() => Object.values(inject('roles')))
        const subscriptionRoleChoices = computed(() => form.context.value && Subscription.roleChoices(roles.value, form.context.value.role))
        const subscriptionAccessChoices = computed(() => form.context.value && Subscription.accessChoices(roles.value, form.context.value.role))

        return {...form, roles, subscriptionRoleChoices, subscriptionAccessChoices }
    },

}
</script>
