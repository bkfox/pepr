<template>
    <b-modal :id="id" size="lg">
        <template slot="modal-title" v-if="subscription">
            <span class="fa fa-users"></span>
            {{ context.attr('title') }} &#8212; Edit Subscription
        </template>

        <div v-if="!subscription" class="alert alert-warning">Not subscribed</div>
        <div v-else-if="subscription.is_request"
            class="alert alert-info">
            Subscription request to <b>{{ context.attr('title') }}</b>
            {{ context.type }} not yet accepted.
        </div>
        <div v-else-if="subscription.is_invite"
            class="alert alert-info">
            Invitation to <b>{{ context.attr('title') }}</b>
            {{ context.type }} not yet accepted.
        </div>

        <form v-if="subscription">
            <div class="form-group row">
                <label for="subscription-role" class="col-sm-4 col-form-label">
                    Subscribe as
                </label>
                <div class="col-sm-8">
                    <select class="form-control " id="subscription-role" name="role"
                        v-model="item.role">
                        <option v-for="role in roles" :key="role.access"
                            v-if="roles.DEFAULT.access < role.access && role.access < roles.MODERATOR.access"
                            :value="role.access">
                        {{ role.name }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="form-group row">
                <label for="subscription-access" class="col-sm-4 col-form-label">
                    <span class="far fa-eye"></span>
                    Access
                </label>
                <div class="col-sm-8">
                    <select class="form-control" id="subscription-role" name="role"
                        v-model="item.access">
                        <option v-for="role in roles" :key="role.access"
                                v-if="role.access <= roles.MODERATOR.access"
                            :value="role.access">
                        {{ role.name }}
                        </option>
                    </select>
                    <div class="form-text text-muted">
                    Define who will be able to see that you are subscribed to this
                    {{ context.type }}.
                    </div>
                </div>
            </div>
        </form>

        <template slot="modal-footer">
            <button class="btn btn-danger float-left"
                :item="subscription" action="destroy"
                @click="unsubscribe">
                Unsubscribe
            </button>
            <button class="btn btn-primary"
                :item="subscription" action="save"
                @click="save">
                Save
            </button>
        </template>
    </b-modal>
</template>

<script>
import { ROLES } from 'pepr/models/subscription';

export default {
    props: {
        id: { type: String, default: null },
        subscription: { type: Object, default: null},
        context: { type: Object, default: null},
    },

    computed: {
        roles() {
            return ROLES;
        },

        item() {
            if(!this.subscription)
                return;
            return {...this.subscription.data};
        },
    },

    methods: {
        save() {
            // TODO: const original = this.subscription.data;
            this.subscription.data = this.item;
            this.$store.dispatch('subscription/save',
                {item: this.subscription, data: this.item}
            );
        },

        unsubscribe() {
            if(!confirm('Do you really want to unsubscribe?'))
                return;
            this.$store.dispatch('subscription/delete', {item: this.subscription});
        }
    },

}
</script>

