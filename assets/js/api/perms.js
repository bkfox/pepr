import Vue from 'vue';

import Resource from './resource';

export const STATUS = { INVITE: 1, REQUEST: 2, ACCEPTED: 3, }
export const ROLES = {
    ANONYMOUS: { access: -0x10, name: 'Anonymous' },
    DEFAULT: { access: 0x10, name: 'Registered user' },
    SUBSCRIBER: { access: 0x20, name: 'Subscriber' },
    MEMBER: { access: 0x40, name: 'Member' },
    MODERATOR: { access: 0x80, name: 'Moderator' },
    ADMIN: { access: 0x100, name: 'Admin' },
}

export const STATUS_INVITE = 1;
export const STATUS_REQUEST = 2;
export const STATUS_ACCEPTED = 3;


export class Context extends Resource {
    get role() { return this.attr('role'); }

    get user() {
        const subscription = this.subscription;
        return subscription.owner;
    }

    /**
     *  User's subscription for this context.
     *  @property {Subscription|null} subscription
     */
    get subscription() { return this.attr('subscription') }

    subscribe(endpoint, data={}) {
        var data = {
            context: this.key,
            access: this.data.subscription_default_access,
            role: this.data.subscription_default_role,
            ...data
        };

        const self = this;
        const req = Subscription.create(endpoint, data, {context:this});
        req.then(data => self.setSubscription(data),
                 data => {})
        return req;
    }
}


export class Subscription extends Resource {
    get is_invite() { return this.attr('status') == STATUS_INVITE }
    get is_request() { return this.attr('status') == STATUS_REQUEST }
    get is_subscribed() { return this.attr('status') == STATUS_ACCEPTED }
}


/**
 * User role for a given context.
 */
export class Role {
    /**
     *  Create a new role using given info.
     *
     *  @param {Resource} context parent context resource
     */
    constructor(context, subscriptionEndpoint) {
        const role = context.data.role;
        this.context = context;
        if(role.subscription)
            this.subscription = new Subscription(context, subscriptionEndpoint,
                                                 role.subscription.pk,
                                                 role.subscription);
        else
            this.subscription = null;

        for(var k in role)
            if(this[k] === undefined)
                this[k] = role[k];
    }

    get is_subscribed() {
        return Boolean(this.subscription) && this.subscription.is_subscribed;
    }
}

