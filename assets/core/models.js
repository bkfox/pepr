import { computed } from 'vue'
import Cookies from 'js-cookie'

import { Model } from '@vuex-orm/core'


/**
 * Load models from data, as an Object of `{ entity: insertOrUpdateData }`
 */
export function loadStore(store, data) {
    let db = store.$db();
    for(var entity in data) {
        let model = db.model(entity)
        model ? model.insertOrUpdate({ data: data[entity] })
              : console.warn(`model ${entity} is not a registered model`)
    }
}


/**
 * Base model class
 */
export class Base extends Model {
    /**
     * Default model's api entry point
     */
    static get baseURL() { return '' }

    static get primaryKey() { return 'pk' }
    static get apiConfig() {
        return {
            headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
            delete: true,
        }
    }

    static fields() {
        return {
            pk: this.string(null),
            access: this.number(null),
        }
    }

    /**
     * Item's url (PUT or POST url)
     */
    get $url() {
        return this.$id ? `${this.constructor.baseURL}${this.$id}/`
                        :  this.constructor.baseURL;
    }

    /**
     * Return other model using the same database a this.
     */
    $model(model) {
        model = model.prototype instanceof Model ? model.entity : model
        return this.$store().$db().model(model)
    }

    /// Reload item from the server
    fetch(config) {
        if(!this.$id)
            throw "item is not on server"
        return this.$id && this.constructor.api().get(this.$url, config)
            .then(r => {
                this.constructor.insertOrUpdate({data: r.response.data})
                return r
            })
    }

    /// Save item to server and return promise
    save({form=null, ...config}= {}) {
        config.headers = {...(config.headers || {}),
            'Content-Type': 'multipart/form-data',
            'X-CSRFToken': Cookies.get('csrftoken'),
        }
        const data = form ? new FormData(form) : new FormData()
        if(!form)
            Object.keys(this).forEach(key => data.append(this[key]))

        if(this.$url)
            return (this.$id ? this.constructor.api().put(this.$url, data, config)
                            : this.constructor.api().post(this.$url, data, config))
                .then(r => {
                    this.constructor.insertOrUpdate({data: r.response.data})
                    return r
                })
        else
            throw "no api url for item"
    }

    /// Delete item from server and return promise
    delete(config) {
        if(this.$url)
            return this.constructor.api().delete(this.$url, config).then(r => {
                this.constructor.delete(this.$id)
                return r
            })
        else
            throw "no api url for item"
    }
}


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

    isGranted(permissions, item) {
        if(!this.permissions)
            return false
        if(item instanceof Owned && this.identity == item.owner)
            return true

        for(var name of permissions)
            if(!this.permissions[name])
                return false
        return true
    }
}


export class Context extends Base {
    static get entity() { return 'context' }
    static get baseURL() { return '/pepr/core/context/' }


    static fields() {
        return { ...super.fields(),
            title: this.string(''),
            default_access: this.number(null),
            allow_subscription_request: this.attr(null),
            subscription_accept_role: this.number(null),
            subscription_default_access: this.number(null),
            subscription_default_role: this.number(null),
            // subsciption: this.attr(null),
            subsciptions: this.hasMany(Subscription, 'context'),
            role: this.attr(null, value => new Role(value))
        }
    }

    /// Return user's identity
    get identity() {
        let id = this.role && this.role.identity_id
        return id && this.$model('context').find(id)
    }

    /// Return user's subscription
    get subscription() {
        let id = this.role && this.role.identity_id
        return id && this.$model('subscription').query()
            .where({ context_id: this.$id, owner_id: id }).first()
    }
}



export class Accessible extends Base {
    static get entity() { return 'accessible' }
    static get contextModel() { return Context }

    static fields() {
        return { ...super.fields(),
            context_id: this.attr(null),
            // context: this.belongsTo(Context, 'context_id'),
        }
    }

    get context() {
        return this.context_id && this.constructor.contextModel.find(this.context_id)
    }

    granted(permissions) {
        let role_perms = this.context.role.permissions
        if(!Array.isArray(perms))
            return !!role_perms[permissions]

        for(var permission of permissions)
            if(!role_perms[permission])
                return false
        return true
    }
}

export class Owned extends Accessible {
    static get entity() { return 'owned' }

    static fields() {
        return { ...super.fields(),
            owner_id: this.attr(null),
        //    owner: this.belongsTo(Context, 'owner_id'),
        }
    }

    get owner() {
        return Context.find(this.owner_id)
    }
}

export class Subscription extends Owned {
    static get entity() { return 'subscription' }
    static get baseURL() { return '/pepr/core/subscription/' }

    static fields() {
        return { ...super.fields(),
            status: this.number(),
            access: this.number(),
            role: this.number(),
        }
    }

    save(config) {
        return super.save(config).then(
            r => {
                this.context && this.context.fetch()
                return r
            }
        )
    }

    delete(config) {
        const context = this.context
        return super.delete(config).then(
            r => {
                context && context.fetch()
                return r
            },
        )
    }


    get isInvite() { return this.status == Subscription.INVITE }
    get isRequest() { return this.status == Subscription.REQUEST }
    get isSubscribed() { return this.status == Subscription.SUBSCRIBED }
}
Subscription.INVITE = 1
Subscription.REQUEST = 2
Subscription.SUBSCRIBED = 3


const defaults = { Context, Subscription }
export default defaults

