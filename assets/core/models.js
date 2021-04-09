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
     * Return other model in the same database.
     */
    $model(model) {
        model = model.prototype instanceof Model ? model.entity : model
        return this.$store().$db().model(model)
    }

    // TODO: many=True, getOrFetch
    static fetch(id, config={}) {
        return this.api().get(`${this.baseURL}/${id}/`, config)
    }

    /**
     * Reload item from the server
     */
    fetch(config) {
        if(!this.$id)
            throw "item is not on server"
        return this.$id && this.constructor.api().get(this.$url, config)
            .then(r => {
                this.constructor.insertOrUpdate({data: r.response.data})
                return r
            })
    }

    /**
     * Save item to server and return promise
     */
    save({form=null, ...config}= {}) {
        config.headers = {...(config.headers || {}),
            'Content-Type': 'multipart/form-data',
            'X-CSRFToken': Cookies.get('csrftoken'),
        }
        const data = form ? new FormData(form) : new FormData()
        if(!form)
            // FIXME: exclude relations / use data
            Object.keys(this.constructor.fields()).forEach(key => this[key] !== null && data.append(key, this[key]))

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

    /**
     * Delete item from server and return promise
     */
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


export class Context extends Base {
    static get entity() { return 'context' }
    static get baseURL() { return '/pepr/core/context/' }


    static fields() {
        return { ...super.fields(),
            title: this.string(''),
            headline: this.string(''),
            default_access: this.number(null),
            allow_subscription_request: this.attr(null),
            subscription_accept_role: this.number(null),
            subscription_default_access: this.number(null),
            subscription_default_role: this.number(null),
            // subsciption: this.attr(null),
            subsciptions: this.hasMany(Subscription, 'context'),
            n_subscriptions: this.number(0),
            role: this.attr(null, value => new Role(value))
        }
    }

    /**
     * Return user's identity
     */
    get identity() {
        let id = this.role && this.role.identity_id
        return id && this.$model('context').find(id)
    }

    /**
     * Return user's subscription
     */
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

    /**
     * Available choices for 'access' attribute.
     */
    static accessChoices(roles, role=null) {
        if(!Array.isArray(roles))
            roles = Object.values(roles)
        return role ? roles.filter((r) => r.access <= role.access) : roles
    }

    /**
     * Parent context object.
     */
    get context() {
        return this.context_id && this.constructor.contextModel.find(this.context_id)
    }

    // FIXME: wtf
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

    /**
     * Related owner object
     */
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

    static accessChoices(roles, role=null) {
        return super.accessChoices(roles, role)
                    .filter(role => role.status != 'moderator' && role.status != 'admin')
    }

    /**
     * Available choices for the 'role' attribute
     */
    static roleChoices(roles, role=null) {
        return this.accessChoices(roles, role)
                   .filter(role => role.status != 'anonymous' &&
                                   role.status != 'registered')
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

    /**
     * Subscription is an invitation
     */
    get isInvite() { return this.status == Subscription.INVITE }

    /**
     * Subscription is a request
     */
    get isRequest() { return this.status == Subscription.REQUEST }

    /**
     * Subscription is validated
     */
    get isSubscribed() { return this.status == Subscription.SUBSCRIBED }
}
Subscription.INVITE = 1
Subscription.REQUEST = 2
Subscription.SUBSCRIBED = 3


const defaults = { Context, Subscription }
export default defaults

