export default class Role {
    /* static fields() {
        return {
            context_id: this.string(null),
            subscription_id: this.string(null),
            identity_id: this.string(null),
            access: this.number(null),
            is_anonymous: this.boolean(false),
            is_subscribed: this.boolean(false),
            is_moderator: this.boolean(false),
            is_admin: this.boolean(false),
            permissions: this.attr(null)
       }
    } */

    static subclass(name, statics, prototype={}) {
        class ChildClass extends this {}
        for(var key in statics)
            ChildClass[key] = statics[key]

        ChildClass.prototype = {...ChildClass.prototype, ...prototype}
        return ChildClass
    }

    constructor(data=null) {
        data && Object.assign(this, data)
    }

    get name() {
        const roles = this.context.roles
        return roles[this.access].name
    }

    get description() {
        const roles = this.context.roles
        return roles[this.access].description
    }

    /**
     * True if all permissions are granted on this role
     */
    hasPermission(permission, prefix='') {
        return this.permissions &&
            !!this.permissions[prefix ? `${prefix}.${permission}` : permission]
    }

    /**
     * True if all permissions are granted on this role
     */
    hasPermissions(permissions, prefix='') {
        return this.permissions && !permissions.find(
            p => this.permissions[prefix ? `${prefix}.${p}` : p]
        )
    }
}

