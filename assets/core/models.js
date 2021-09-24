import * as orm from '@vuex-orm/core'

import Action from './action'
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
    static appLabel = 'pepr_core'
	static primaryKey = 'pk'
	static apiConfig = {
        commit: true,
	}

    static fields() {
        return {
            pk: this.string(null),
            access: this.number(null),
        }
    }

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
        const baseURL = this.store().baseURL
        return (baseURL ? `${baseURL}${this.url}` : this.url).replace('//', '/')
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
        return this.$id ? `${this.constructor.fullUrl}${this.$id}/`
                        : this.constructor.fullUrl
    }

    /**
     * Return model in the same database by name or class.
	 * @param model [Model|String]
     */
    static model(model) {
        model = model.prototype instanceof Model ? model.entity : model
        return this.store().$db().model(model)
    }

    /**
     * Return model in the same database by name or class.
	 * @param model [Model|String]
     */
    $model(model) {
        return this.constructor.model(model)
    }

    /**
     * Return instance data (based on declared fields and their default
     * values).
     */
    $data(defaults=true) {
        const data = {}
        for(const [key, field] of Object.entries(this.$fields()))
            if(field instanceof orm.Type)
                data[key] = defaults && this[key] === undefined
                                ? field.value : this[key]
        return data
    }

    /**
     * Update ORM database for this object
     */
    $update(data) {
        Object.assign(this, data)
        this.constructor.update({ where: this.$id, data })
    }

    /**
     * Fetch one or more entities from server.
     */
    static fetch({id='', url=null, action='', data=null, ...config}={}) {
        if(!id && data)
            id = data.$id
        if(!url)
            url = id ? `${this.fullUrl}${id}/` : this.fullUrl
        if(action)
            url += `${action}/`

        // django drf's results
        if(!id && config.dataKey === undefined)
            config.dataKey = 'results'

        return this.api().fetch(url, {data, ...config})
    }

    /**
     * Fetch item from the server
     */
    fetch(config) {
        if(!this.$id)
            throw "item is not on server"
        return this.constructor.fetch({id: this.$id, ...config})
    }

    /**
     * Save item to server and return promise
     */
    save(config = {}) {
        config.data = config.data || this.$data(false)
        config.method = config.method || (config.data.$id ? 'PUT' : 'POST')
        return this.constructor.fetch(config)
    }

    /**
     * Delete item from server and return promise
     */
    delete(config={}) {
        if(this.$fullUrl)
            return this.constructor.api().delete(this.$fullUrl, config).then(r => {
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



export class BaseAccessible extends Model {

    /**
     * All available actions on model
     */
	static actions = [
		new Action({label: 'Delete', permissions:'delete',
				    exec: (item) => confirm('Delete?') && item.delete({delete:1}),
				    icon: 'mdi mdi-delete'}),
	]

	/**
	 * Available actions on this model instance
	 */
	getActions(role) {
		return this.constructor.actions?.filter(a => a.isGranted(role, this)) || []
	}

    /**
     * True if all permissions are allowed
     *
     * @param {Role} role - user's role to check permission of
     * @param {...(string|Function)} permissions - permission names or
     *                               `functions(role, this)` to test
     */
	isGranted(role, ...permissions) {
        return permissions.find(
            p => p instanceof Function ? !p(role, this)
                                       : !role.hasPermission(p, this.constructor.label)
        )
	}
}


export class Context extends BaseAccessible {
    static entity = 'context'
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
    // static actions = [ ]

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
        let id = this.role?.identity_id
        return id && this.constructor.find(id)
    }

    /**
     * Return user's subscription
     */
    get subscription() {
        const id = this.role?.identity_id
        return id && this.$model('subscription').query()
            .where({ context_id: this.$id, owner_id: id }).first()
    }

    get roles() {
        return this.constructor.roles
    }
}

export class Accessible extends BaseAccessible {
    static entity = 'accessible'
    static contextEntity = 'context'
    static fields() {
        return { ...super.fields(),
            context_id: this.attr(null),
            // context: this.belongsTo(Context, 'context_id'),
        }
    }

    /**
     * Model of Accessible's context
     */
    static get contextModel() {
        return this.model(this.contextEntity)
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
}

export class Owned extends Accessible {
    static entity = 'owned'
    static fields() {
        return { ...super.fields(),
            owner_id: this.attr(null),
        //    owner: this.belongsTo(Context, 'owner_id'),
        }
    }

    isGranted(role, ...permissions) {
        if(this.owner == role.identity)
            return true
        return super.isGranted(role, ...permissions)
    }

    /**
     * Related owner object
     */
    get owner() {
        return null; // Context.find(this.owner_id)
    }
}

export class Subscription extends Owned {
    static INVITE = 1
    static REQUEST = 2
    static SUBSCRIBED = 3

    static entity = 'subscription'
    static fields() {
        return { ...super.fields(),
            status: this.number(),
            access: this.number(),
            role: this.number(),
        }
    }
    static actions = [
        new Action({
            label: 'Accept Subscription',
            exec: (item) => item.fetch({action: 'accept', method: 'PUT', commit: true})
                                .then(r => {
                                    const context = item.context
                                    context.$update({n_subscriptions: context.n_subscriptions+1})
                                }),
            icon: 'mdi mdi-account-check',
            css: 'is-success',
            permissions: ['accept', (r, i) => i.status == Subscription.REQUEST]
        }),
        ...super.actions,
    ]

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

    isGranted(role, ...permissions) {
        if(permissions.indexOf('accept') != -1 &&
            (this.status != Subscription.REQUEST ||
             !role.hasPermission('accept', this.constructor.label)))
            return false
        return super.isGranted(role, ...permissions)
    }

    save(config) {
        return super.save(config).then(r => {
            this.context && this.context.fetch()
            return r
        })
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


const defaults = { Context, Subscription }
export default defaults

