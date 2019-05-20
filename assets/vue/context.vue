<template>
    <div>
        <slot :context="context" :subscription="subscription"></slot>
    </div>
</template>

<script>
import {Subscription} from 'pepr/api/perms';
import storeCollectionMixin from './storeCollectionMixin';

export default {
    // TODO: watch path

    mixins: [storeCollectionMixin],

    props: {
        contextId: { type: String },
        subscriptionEndpoint: { type: String },
        storeNamespace: { type: String, default: 'context' },
    },

    data() {
        return {
            context: null,
        }
    },

    computed: {
        subscription() {
            if(!this.context || !this.context.user)
                return null;

            // note: resource = {data: {context, owner, ...}, ...}
            const data = { context: this.context.key, owner: this.context.user };
            return this.$store.getters['subscription/find']({data});
        },
    },

    methods: {
        loadContext(id) {
            // TODO: release context
            const self = this;
            return this.acquire({id}).then(
                context => {
                    if(context.subscription)
                        self.acquire({item: new Subscription(context.subscription)}, 'subscription');
                    self.context = context;
                    return context;
                }
            )
        },
    },

    mounted() {
        this.loadContext(this.contextId);
    },
}
</script>


