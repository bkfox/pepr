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
    constructor(...args)
    {
        super(...args)

        /**
         *  @member {Subscription|null} subscription
         *  User's subscription for this context.
         */
        this.subscription = null;
    }

    fetch(options={}) {
        var req = super.fetch(options);
        req.then(context => context.loadSubscription())
        return req;
    }

    setSubscription(data) {
        if(data instanceof Subscription)
            data.context = this;
        else
            data = new Subscription(null, data, {context:this})
        return Vue.set(this, 'subscription', data)
    }

    subscribe(endpoint, data={}) {
        var data = Object.assign({
            context: this.key,
            access: this.data.subscription_default_access,
            role: this.data.subscription_default_role
        }, data);

        const self = this;
        const req = Subscription.create(endpoint, data, {context:this});
        req.then(data => self.setSubscription(data))
        return req;
    }


    loadSubscription() {
        // TODO:
        // - subscribed/unsubscribed react to changes of subscription object
        // - test role limitation in api
        // - 
        const subscription = this.data && this.data.subscription;
        if(!subscription)
            return;

        if(subscription instanceof Object) {
            this.setSubscription(subscription);
            return
        }

        const self = this;
        if(typeof subscription == 'string')
            fetch_json(subscription).then(
                data => self.setSubscription(data),
                data => Vue.set(self, 'subscription', null)
            )
    }

    handleSubscriptionRequest(req, args) {
        const self = this;
        req.then(data => {
            const res = data instanceof Subscription ?
                data : new Subscription(null, data, {context:this});
            Vue.set(self, 'subscription', res)
        })
        return req;
    }
}


export class Subscription extends Resource {
    constructor(id, data={}, {context, ...args}={}) {
        super(id, data, args);
        this.context = context;
    }

    fetch(options={}) {
        if(this.key)
            return super.fetch(options);

        // FIXME: need owner + fetch_json(endpoint) => endpoint don't exists ↓
        const self = this;
        options.query = Object.assign(options.query || {}, {context: this.context.key})
        return fetch_json(endpoint, options).then(data => {
            Vue.set(self, 'data', results ? results[0] : null);
            return self;
        })
    }

    get is_invite() { return this.data && this.data.status == STATUS_INVITE }
    get is_request() { return this.data && this.data.status == STATUS_REQUEST }
    get is_subscribed() { return this.data && this.data.status == STATUS_ACCEPTED }
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

