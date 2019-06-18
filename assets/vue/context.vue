<template>
    <div>
        <slot :context="context" :role="role" :subscription="subscription"></slot>
    </div>
</template>

<script>
import {Subscription, Context} from 'pepr/models';
import storeMixin from './storeMixin';

/**
 * Component handling pepr context's data and user subscription.
 *
 * @module vue/context
 * @extends module:vue/storeMixin
 * @vue-prop {String} path - path to context data
 * @vue-data {Context} context - loaded context
 * @vue-computed {Object} role - (computed) user role in this context
 * @vue-computed {Object} subscription - (computed) user's subscription
 */
export default {
    mixins: [storeMixin],

    props: {
        path: { type: String },
    },

    data() {
        return {
            model: this.modelClass || Context,
            context: null,
        }
    },

    computed: {
        role() {
            return this.context && this.context.role;
        },

        subscription() {
            if(!this.context || !this.context.user)
                return null;

            // note: resource = {data: {context, owner, ...}, ...}
            const data = { context: this.context.key /*, owner: this.context.user*/ };
            return this.$store.getters['subscription/find']({data});
        },
    },

    methods: {
        /**
         * Fetch context from the server using provided url
         * @param {String} url - context url
         */
        fetchContext(url) {
            if(this.context)
                this.context.$release(this.cid);

            return this.model.dispatch('fetch', {
                url, store: this.$store, collection: this.cid
            }).then(item => this.context = item);
        },

        /**
         * Subscribe to current context
         * @param {Object} data - subscription data
         */
        subscribe(data={}) {
            data = { context: this.context.key,
                     access: this.context.data.subscription_default_access,
                     role: this.context.data.subscription_default_role,
                     owner: this.context.user,
                     ...data };
            return this.create({data}, 'subscription')
        },
    },

    mounted() {
        this.fetchContext(this.path);
    },
}
</script>


