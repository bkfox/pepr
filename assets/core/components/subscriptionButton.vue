<template>
    <p-modal ref="modal">
        <div class="box">
            <h2 class="title is-2">
                <span v-if="subscription">Edit subscription</span>
                <span v-else>Subscribe to {{ context && context.title }}</span>
            </h2>
            <p-subscription-form @done="$refs.modal.hide()" :context="context"
                :initial="subscription"></p-subscription-form>
        </div>
    </p-modal>
    <div class="dropdown is-hoverable is-right">
        <div class="dropdown-trigger">
            <div class="field has-addons">
                <div class="control">
                    <button v-if="!subscription" class="button is-link" @click="subscribe"
                            :title="`Subscribe as ${roles[context.subscription_default_role]}`">
                        <span class="icon"><i class="mdi mdi-account-multiple"></i></span>
                        <span>Subscribe</span>
                    </button>
                    <button v-else-if="subscription.isSubscribed" class="button is-info" @click="edit">
                        <span class="icon"><i class="mdi mdi-account-multiple"></i></span>
                        <span>{{ roles[context.role.access].name }}</span>
                    </button>
                    <button v-else class="button is-info" @click="edit">
                        <span class="icon"><i class="mdi mdi-account-question"></i></span>
                        <span>Request sent</span>
                    </button>
                </div>
                <div class="control">
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
import PSubscriptionForm from './subscriptionForm'
import PSubscriptionList from './subscriptionList'
import PModal from './modal'


export default {
    inject: ['roles'],
    props: {
        context: Object,
    },

    computed: {
        role() {
            return this.context && this.context.role
        },

        subscription() {
            return this.context && this.context.subscription
        },
    },
    methods: {
        edit() {
            this.$refs.modal.show()
        },

        subscribe() {
            return new this.$root.Subscription({
                context_id: this.context.$id,
                access: this.context.subscription_default_access,
                role: this.context.subscription_default_role,
            }).save()
        },

        unsubscribe() {
            confirm(`Unsubscribe from ${this.context.title}?`) &&
                this.subscription.delete()
        },
    },

    components: { PSubscriptionForm, PSubscriptionList, PModal },
}
</script>
