import Cookies from 'js-cookie'

import * as orm from '@vuex-orm/core'
import {submit, getSubmitConfig} from './api'


/**
 * Load models from data, as an Object of `{ entity: insertOrUpdateData }`
 */
export function importDatabase(store, data) {
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
export class Model extends orm.Model {
	/**
	 * Django AppConfig's application label.
	 */
    static get appLabel() { return 'pepr_core' }

	/**
	 * Model's label (equivalent to Django's `model._meta.label_lower`).
	 */
    static get label() { return this.appLabel + '.' + this.entity }

    /**
     * Default model's api entry point.
     * Defaults to `/app/label/entity/` (for `appLabel=app_label`)
     */
    static get url() {
        return `/${this.appLabel.replace('_','/')}/${this.entity}/`
    }

    /**
     * Real url of API's entry point (including store's baseURL).
     */
    static get fullUrl() {
        return `${this.store().baseURL}${this.url}`.replace('//','/')
    }

	static get primaryKey() { return 'pk' }
    static get apiConfig() {
        return {
            headers: { 'X-CSRFToken': Cookies.get('csrftoken') },
        }
    }

    static fields() {
        return {
            pk: this.string(null),
            access: this.number(null),
        }
    }

    /**
     * Item's url (PUT or POST url).
     */
    get $url() {
        return this.$id ? `${this.constructor.url}${this.$id}/`
                        :  this.constructor.url;
    }

	/**
	 * Item's real url (including store's baseURL).
	 */
    get $fullUrl() {
        const url = this.$store.baseURL;
        return url ? `${url}/${this.$url}` : this.$url
    }

    /**
     * Return model in the same database by name or class.
	 * @param model [Model|String]
     */
    $model(model) {
        model = model.prototype instanceof Model ? model.entity : model
        return this.$store().$db().model(model)
    }

    /**
     * Fetch one or more entities from server.
     */
    static fetch({id='', url=null, urlParams=null, ...config}={}) {
        if(!url)
            url = id ? `${this.url}${id}/` : this.url
        if(urlParams)
            url = `${url}?${urlParams.toString()}`

        // django drf results
        if(!id && config.dataKey === undefined)
            config.dataKey = 'results'

        return this.api().get(url, config)
    }

    /**
     * Reload item from the server
     */
    fetch(config) {
        if(!this.$id)
            throw "item is not on server"
        return this.$id && this.constructor.api().get(this.$url, config)
            .then(r => {
                if(200 <= r < 400)
                    this.constructor.insertOrUpdate({data: r.response.data})
                return r
            })
    }

    /**
     * Save item to server and return promise
     */
    save(config = {}) {
        if(!config.data && !config.form) {
            // FIXME: exclude relations / use data
            config.data = {}
            const fields = this.constructor.fields()
            for(var key in fields)
                if(this[key] !== undefined)
                    config.data[key] = this[key]
        }
        if(!config.method)
            config.method = self.$id ? 'PUT': 'POST'
        config.url = this.$url

        let {body, method, url, ...config_} = getSubmitConfig(config)
        method = method.toLowerCase()

        return this.constructor.api()[method](url, body, config_)
    }

    /**
     * Delete item from server and return promise
     */
    delete(config) {
        config.delete = true
        if(this.$url)
            return this.constructor.api().delete(this.$url, config).then(r => {
                this.constructor.delete(this.$id)
                return r
            })
        else
            throw "no api url for item"
    }
}

export class BaseAccessible extends Model {
	static get actions() {
		return [
			new Action('delete', 'Delete',
					   (item) => confirm('Delete?') && item.delete({delete:1}),
					   {icon: 'mdi mdi-delete'}),
		]
	}

	/**
	 * Available actions on this object
	 */
	getActions(role) {
		return this.constructor.actions.filter(a => a.isGranted(role, this))
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

    /**
     * True if all permissions are granted for this role
     */
    isGranted(permissions, item=null) {
        if(!this.permissions)
            return false
        if(item && item instanceof Owned && this.identity == item.owner)
            return true

        if(typeof permissions == 'string')
            permissions = [permissions]

        for(var name of permissions)
            if(!this.permissions[name])
                return false
        return true
    }
}


export class Context extends Model {
    static get entity() { return 'context' }

    static fields() {
        return { ...super.fields(),
            default_access: this.number(null),
            allow_subscription_request: this.attr(null),
            subscription_accept_role: this.number(null),
            subscription_default_access: this.number(null),
            subscription_default_role: this.number(null),
            // subsciption: this.attr(null),
            subsciptions: this.hasMany(Subscription, 'context'),
            n_subscriptions: this.number(0),
            role: this.attr(null, value => new Role(value)),
        }
    }

    static fetchRoles() {
        if(this.roles !== undefined)
            return new Promise(resolve => resolve(this.roles))
        const url = `${this.fullUrl}roles/`
        return fetch(url).then(r => r.json(), r => console.error(r))
                         .then(r => { this.roles = this._validate_roles(r) })
    }

    static _validate_roles(value) {
        if(!value)
            return {}

        const roles = {}
        for(var role of value)
            roles[role.access] = role
        return roles
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

    get roles() {
        return this.constructor.roles
    }
}



export class Accessible extends Model {
    static get entity() { return 'accessible' }

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
        return null; // Context.find(this.owner_id)
    }
}

export class Subscription extends Owned {
    static get entity() { return 'subscription' }

    static fields() {
        return { ...super.fields(),
            status: this.number(),
            access: this.number(),
            role: this.number(),
        }
    }

    static accessChoices(roles, role=null) {
        if(roles.prototype instanceof Context)
            roles = roles.roles
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

