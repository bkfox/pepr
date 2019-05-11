<template>
    <b-modal :id="id" size="lg">
        <template slot="modal-title" v-if="subscription">
            <span class="fa fa-users"></span>
            {{ subscription.context.data.title }} &#8212; Edit Subscription
        </template>

        <div v-if="!subscription" class="alert alert-warning">Not subscribed</div>
        <div v-else-if="subscription.is_request"
            class="alert alert-info">
            Subscription request to <b>{{ subscription.context.data.title }}</b>
            {{ subscription.context.type }} not yet accepted.
        </div>
        <div v-else-if="subscription.is_invite"
            class="alert alert-info">
            Invitation to <b>{{ subscription.context.data.title }}</b>
            {{ subscription.context.type }} not yet accepted.
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
                                v-if="0x10 < role.access < 0x80"
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
                                v-if="role.access <= 0x80"
                            :value="role.access">
                        {{ role.name }}
                        </option>
                    </select>
                    <div class="form-text text-muted">
                    Define who will be able to see that you are subscribed to this
                    {{ subscription.context.type }}.
                    </div>
                </div>
            </div>
        </form>

        <template slot="modal-footer">
            <button class="btn btn-danger float-left"
                :item="subscription" action="resource:delete"
                @click="unsubscribe">
                Unsubscribe
            </button>
            <button class="btn btn-primary"
                :item="subscription" action="resource:save"
                @click="save">
                Save
            </button>
        </template>
    </b-modal>
</template>

<script>
import { ROLES } from '../js/api/perms';

export default {
    props: {
        id: { type: String, default: null },
        subscription: { type: Object, default: null},
    },

    computed: {
        context() {
            return this.subscription && this.subscription.context;
        },

        roles() {
            return ROLES;
        },

        item() {
            if(!this.subscription)
                return;
            return Object.assign({}, this.subscription.data)
        },
    },

    methods: {
        save() {
            // TODO: const original = this.subscription.data;
            this.subscription.data = this.item;
            this.subscription.save();
        },

        unsubscribe() {
            if(!confirm('Do you really want to unsubscribe?'))
                return;
            this.subscription.delete();
        }
    },

}
</script>

