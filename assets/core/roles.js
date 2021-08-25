

export class Role {
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

    constructor(data=null) {
        data && Object.assign(this, data)
    }


    /**
     * True if all permissions are granted for this role
     */
    isGranted(permissions, item=null) {
        if(!this.permissions)
            return false
        if(item && item instanceof Owned && this.identity == item.owner)
            return true

        for(var name of permissions)
            if(!this.permissions[name])
                return false
        return true
    }
}


