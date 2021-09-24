<template>
    <div class="dropdown is-hoverable" v-if="roles">
        <div class="dropdown-trigger">
            <div class="field has-addons">
                <div class="control">
                    <button v-if="subscription && subscription.isSubscribed"
                            :class="['button is-info', isSmall && 'is-small']" @click="edit">
                        <span class="icon"><i class="mdi mdi-account-multiple-check"></i></span>
                        <span v-if="!noText">{{ roles[role.access].name }}</span>
                    </button>
                    <button v-else-if="subscription && subscription.isRequest"
                            :class="['button is-info', isSmall && 'is-small']" @click="edit">
                        <span class="icon"><i class="mdi mdi-account-question"></i></span>
                        <span v-if="!noText">Request sent</span>
                    </button>
                    <button v-else-if="!subscription || !subscription.isSubscribed"
                            :class="['button is-link', isSmall && 'is-small']"
                            :title="`Subscribe as ${roles[context.subscription_default_role].name}`"
                            @click="subscribe">
                        <span class="icon"><i class="mdi mdi-account-multiple-plus"></i></span>
                        <span v-if="!noText">Subscribe</span>
                    </button>
                    <!-- Accept Invite -->
                </div>
                <div class="control" v-if="!noText">
                    <button class="button is-white">
                        {{ context.n_subscriptions }}
                    </button>
                </div>
            </div>
        </div>
        <div class="dropdown-menu" role="menu">
            <div v-if="!subscription" class="dropdown-content">
                <a class="dropdown-item" @click="edit">Subscribe...</a>
            </div>
            <div v-else class="dropdown-content">
                <a class="dropdown-item" @click="unsubscribe">Unsubscribe</a>
            </div>
        </div>
    </div>
</template>
<script>
import { computed } from 'vue'
import * as composables from '../composables'

export default {
    props: {
        modal: {type: Object},
        noText: { type: Boolean, default: false },
        isSmall: { type: Boolean, default: false },
        subscription: {type: Object, default: null},
    },

    setup(props) {
        const contextComp = composables.useContext()
        const context = contextComp.context
        const subscription = computed(() => props.subscription || context.value.subscription ||
            context.value && new (context.value.$model('subscription'))({
                context_id: context.value.$id,
                access: context.value.subscription_default_access,
                role: context.value.subscription_default_role,
            })
        )
        return { ...contextComp, subscription }
    },

    methods: {
        edit() {
            this.modal.show({data: this.subscription})
        },

        subscribe() {
            this.subscription.save()
        },

        unsubscribe() {
            confirm(`Unsubscribe from "${this.context.title}"?`) &&
                this.subscription.delete()
        },
    },
}
</script>
