/** @module orm/model **/
import {mergeStores} from './utils';
import ModelModule from './modelModule';



/**
 * Model is an abstraction used to generates a Vuex module that can store its
 * instances. A model is described using model and field directives that add
 * functionalities to the module and the model itself.
 * @see ModelModule
 */
export default class Model {
    /**
     * Return primary key for data.
     * @param {Object|Model} data
     */
    static key(data) {
        return data[this.primaryKey] || null;
    }

    /**
     * Ensure data is an instance of model class. If not, instanciate this
     * model with provided data and store.
     *
     * @param {Object|Model} data
     * @param {Vuex.Store} store - init store
     */
    static as(data, store=null) {
        return data instanceof this ? data : new this(data, store)
    }

    /**
     * Return a namespaced version of the key of a store's element.
     * @param {String} key
     */
    static namespaced(key) {
        return this.entity + '/' + key;
    }


    /**
     * Call callback for each directive and field directive.
     *
     * @param {Function} callback - function to call
     * @param {Directive[]} [directives=this.directives] - model directives
     * @param {Object.<String, Directive[]|Directive>} [fields=this.fields] - field directives
     */
    static runDirectives(callback) {
        for(let directive of this.directives)
            callback(directive);
        for(let [name, field] of Object.entries(this.fields))
            if(field instanceof Array)
                field.forEach(field => callback(field, name))
            else
                callback(field, name)
    }

    /**
     * Initialize model class and set defaults static attributes. Called by
     * Database before model is registered.
     * @param {Database}
     */
    static modelize(database) {
        let defaults = /** @lends module:orm/model.Model **/ {
            /** 
             * @member {String} - module name in store (default is "modelname" + s)
             * @static
             */
            entity: this.name.toLowerCase() + 's',
            /**
             * @member {String} - instance attribute to use as primary key (bound to $key)
             * @static
             */
            primaryKey: 'pk',
            /**
             * @member {Object.<String, Directive|Directive[]>} - field directives by field name
             * @static
             */
            fields: {},
            /**
             * @member {String[]} - model directives
             * @static
             */
            directives: [],
            /**
             * @member {Object.<String, Function|Object>} directive's plugins to run.
             */
            plugins: {},
        };
        for(let [key, value] of Object.entries(defaults))
            if(this[key] === undefined)
                this[key] = value;

        // prototypes
        this.runDirectives((dir, field=null) => {
            var prototype = dir.modelPrototype(database, this, field);
            if(prototype)
                for(var key in prototype)
                    this[key] = key;
        })
    }

    /**
     * Return model as a Vuex module for provided database, using provided and 
     * model's directives.
     *
     * @see {orm/model/Model.store}
     */
    static store(database) {
        const stores  = [];
        this.runDirectives((dir, field=null) => {
            var store = dir.store(database, this, field);
            store && stores.push(store)
        })
        return stores ? mergeStores(...stores) : {};
    }

    /**
     * Store plugin -- it calls all 
     * `$store`.
     * @param {Vuex.Store} store
     */
    static plugin(store) {
        /**
         * Model instance's store, by default the latest one passed to
         * `plugin(store)`.
         *
         * @member Model.prototype.$store
         */
        this.prototype.$store = store;

        let model = this;
        this.runDirectives(
            (dir, field=null) => dir.plugin && dir.plugin(store, model, field),
        )
        for(plugin of Object.values(this.plugins))
            plugin(store, model);
    }

    /**
     * Getter of model's module in store
     */
    static getter(name, store=null) {
        store = store || this.prototype.$store;
        return store.getters[this.namespaced(name)];
    }

    /**
     * Commit to model's module in store
     */
    static commit(name, payload, store=null) {
        store = store || this.prototype.$store;
        return store.commit(this.namespaced(name), payload);
    }

    /**
     * Dispatch to model's module in store
     */
    static dispatch(name, payload, store=null) {
        store = store || this.prototype.$store;
        return store.dispatch(this.namespaced(name), payload);
    }

    /**
     * @param {Object} data of the model instance, set as instance's attributes.
     */
    constructor(data=null, store=null) {
        for(var attr in data)
            this[attr] = data[attr];

        if(store !== null)
            this.$store = store;
    }

    /**
     * @member {Model} - reference to the instance's class to access statics members (e.g.
     * `obj.$.commit()`)
     */
    get $() {
        return this.constructor;
    }

    /**
     * @member {ModelKey|null} - instance primary key if any
     */
    get $key() {
        return this.$.key(this);
    }

    /**
     * Return getter from item's model store.
     * @param {String} type
     */
    $getter(type) { return this.$.getter(type, ); }

    /**
     * Commit mutation to item's model store
     * @param {String} type
     * @param {Object} payload
     */
    $commit(type, payload) { return this.$.commit(type, payload, this.$store); }

    /**
     * Dispatch action to item's model store
     * @param {String} type
     * @param {Object} payload
     */
    $dispatch(type, payload) { return this.$.dispatch(type, payload, this.$store); }

    /**
     * Update item in the store
     * @param {Object} data - update with those data instead of this instance
     * @return item updated (from store if any)
     */
    // TODO: support for store == null && update this
    $update(data=null) {
        if(data)
            for(var attr in data)
                this[attr] = data[attr];

        if(!this.$store)
            return this;

        this.$commit('update', {data: data || this});
        return this.$.getter('all')[this.$key];
    }

    /**
     * Remove item from store
     * @method
     */
    $remove() { this.$commit('remove', {key: this.$key}) }
}


/**
 * Return the basic module store for the provided database (without directives)
 * @param {Database} database
 * @return {module:orm/model.Model.Store
 */
Model.module = ModelModule

