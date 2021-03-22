<template>
    <p-modal ref="modal">
        <p-subscription-form @done="$refs.modal.hide()" class="box" :context="context"
            :initial="subscription"></p-subscription-form>
    </p-modal>
    <div class="dropdown is-hoverable is-right" v-if="!subscription">
        <div class="dropdown-trigger">
            <button class="button is-link" @click="subscribe"
                    :title="`Subscribe as ${roles[context.subscription_default_role]}`">
                <span class="icon"><i class="mdi mdi-account-multiple"></i></span>
                <span>Subscribe</span>
            </button>
        </div>
        <div class="dropdown-menu" role="menu">
            <div class="dropdown-content">
                <a class="dropdown-item" @click="edit">Subscribe...</a>
            </div>
        </div>
    </div>
    <div class="dropdown is-hoverable is-right" v-else>
        <div class="dropdown-trigger">
            <button class="button" @click="edit" v-if="subscription.isSubscribed">
                <span class="icon"><i class="mdi mdi-account-multiple"></i></span>
                <span>{{ roles[context.role.access].name }}</span>
            </button>
            <button class="button is-info" @click="edit" v-else>
                <span class="icon"><i class="mdi mdi-account-multiple"></i></span>
                <span>Request sent</span>
            </button>
        </div>
        <div class="dropdown-menu" role="menu">
            <div class="dropdown-content">
                <a class="dropdown-item" @click="unsubscribe">Unsubscribe</a>
            </div>
        </div>
    </div>
</template>
<script>
import PSubscriptionForm from './subscriptionForm'
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

        unsubscribe() {
            this.subscription.delete()
        },
    },

    components: { PSubscriptionForm, PModal },
}
</script>
