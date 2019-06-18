/**
 * @module models/context
 */
import Record from 'pepr/orm/record';
import {Attr, Collection} from 'pepr/orm/directives';


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
 * Context model class for pepr contexts.
 * @extends module:orm/record.Record
 */
export default class Context extends Record {
    /**
     * User info for this context
     * @member {Object} - user
     */
    get user() { return this.role && this.role.user; }
}


Context.directives = [
    Collection(),
]

