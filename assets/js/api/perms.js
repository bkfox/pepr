import Vue from 'vue';
import find from 'lodash/find';

import Resource from './resource';

export const STATUS = {
    INVITE: 1,
    REQUEST: 2,
    ACCEPTED: 3,
}

export const Status = {
    get(value) {
        return find(STATUS, value);
    }
}

export const ROLES = {
    ANONYMOUS: { access: -0x10, name: 'Anonymous' },
    DEFAULT: { access: 0x10, name: 'Registered user' },
    SUBSCRIBER: { access: 0x20, name: 'Subscriber' },
    MEMBER: { access: 0x40, name: 'Member' },
    MODERATOR: { access: 0x80, name: 'Moderator' },
    ADMIN: { access: 0x100, name: 'Admin' },
}

export const Roles = {
    get(access) {
        return find(ROLES, {access});
    },

    name(access) {
        const role = this.get(access);
        return role && role.name;
    }
}



export class Context extends Resource {
    /**
     * User role for this context
     */
    get role() { return this.attr('role'); }

    /**
     * User info for this context
     */
    get user() { return this.role && this.role.user; }

    /**
     *  User's subscription for this context.
     *  @property {Subscription|null} subscription
     */
    get subscription() { return this.attr('subscription') }
}


export class Subscription extends Resource {
    get is_invite() { return this.attr('status') == STATUS.INVITE }
    get is_request() { return this.attr('status') == STATUS.REQUEST }
    get is_subscribed() { return this.attr('status') == STATUS.ACCEPTED }

    get accessName() {
        let access = this.attr('access');
        return access && Roles.name(access);
    }

    get roleName() {
        let role = this.attr('role');
        return role && Roles.name(role);
    }
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

