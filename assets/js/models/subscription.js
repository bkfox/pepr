/** @module models/subscription **/
import Record from 'pepr/orm/record';
import {Attr, Collection} from 'pepr/orm/directives';

/**
 * Describe available subscription statuses.
 * @namespace STATUS
 */
export const STATUS = {
    INVITE: 1,
    REQUEST: 2,
    ACCEPTED: 3,
}


/**
 * Define available user roles.
 * @namespace ROLES
 * @member ANONYMOUS
 * @member DEFAULT
 * @member SUBSCRIBER
 * @member MEMBER
 * @member MODERATOR
 * @member ADMIN
 */
export var ROLES = {
    ANONYMOUS: { access: -0x10, name: 'Anonymous' },
    DEFAULT: { access: 0x10, name: 'Registered user' },
    SUBSCRIBER: { access: 0x20, name: 'Subscriber' },
    MEMBER: { access: 0x40, name: 'Member' },
    MODERATOR: { access: 0x80, name: 'Moderator' },
    ADMIN: { access: 0x100, name: 'Admin' },
}


/**
 * Return role for the given access.
 * @param access
 */
export function role(access) {
    for(var k in ROLES)
        if(ROLES[k].access == access)
            return ROLES[k];
}

/**
 * Return role name for the given access.
 * @param access
 */
export function roleName(access) {
    const role = role(access);
    return role && role.name;
}



/**
 * Subscription model class
 * @extends module:orm/record.Record
 */
export default class Subscription extends Record {
    /**
     * @member {Boolean} - true if subscription is an invite
     */
    get isInvite() { return this.status == STATUS.INVITE }

    /**
     * @member {Boolean} - true if subscription is a request
     */
    get isRequest() { return this.status == STATUS.REQUEST }

    /**
     * @member {Boolean} - true if subscription is accepted
     */
    get isSubscribed() { return this.status == STATUS.ACCEPTED }

    /**
     * @member {String} - role name for the subscription access
     */
    get accessName() {
        let access = this.access;
        return access && Roles.name(access);
    }

    /**
     * @member {String} - role name for subscription role
     */
    get roleName() {
        let role = this.role;
        return role && rolesName(role);
    }
}


Subscription.directives = [
    Collection(),
]


