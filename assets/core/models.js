import Cookies from 'js-cookie'

import { Model } from '@vuex-orm/core'
import Role from './role'


export class Base extends Model {
    static get primaryKey() { return 'pk' }

    static get apiConfig() {
        return {
            headers: { 'X-CSRFToken': Cookies.get('csrftoken') }
        }
    }

    static fields() {
        return {
            pk: this.string(null),
            api_url: this.string(null),
            access: this.number(null),
        }
    }

    /// Delete item from server
    delete(config) {
        if(this.api_url)
            this.constructor.api().delete(this.api_url, config)
        else
            throw "no api url for item"
    }
}


export class Context extends Base {
    static get entity() { return 'contexts' }

    static fields() {
        return { ...super.fields(),
            title: this.string(null),
            role: this.attr(null, (value) => new Role(value)),
            allow_subscription_request: this.attr(null),
            subscription_default_access: this.number(null),
            subscription_default_role: this.number(null),
            // subsciption: this.attr(null),
            subsciptions: this.hasMany(Subscription, 'context'),
        }
    }

    /// Return user's identity
    get identity() {
        let identity = this.role && this.role.identity
        return identity && this.constructor.find(identity)
    }

    /// Return user's subscription
    get subscription() {
        let identity = this.role && this.role.identity
        return identity && Subscription.query().where('owner_id', identity).first()
    }
}


export class Accessible extends Base {
    static get entity() { return 'accessibles' }

    static fields() {
        return { ...super.fields(),
            context_id: this.attr(null),
            // context: this.belongsTo(Context, 'context_id'),
        }
    }

    get context() {
        return this.context_id && Context.find(this.context_id)
    }

    granted(permissions) {
        let role_perms = context.role.permissions
        if(!Array.isArray(perms))
            return !!role_perms[permissions]

        for(var permission of permissions)
            if(!role_perms[permission])
                return false
        return true
    }
}

export class Owned extends Accessible {
    static get entity() { return 'owneds' }

    static fields() {
        return { ...super.fields(),
            owner_id: this.attr(null),
            // owner: this.belongsTo(this.contextModel, 'owner_id'),
        }
    }

    get owner() {
        return Context.find(this.owner_id)
    }
}

export class Subscription extends Owned {
    static get entity() { return 'subscriptions' }

    static fields() {
        return { ...super.fields(),
            status: this.number(),
            access: this.number(),
            role: this.number(),
        }
    }
}


