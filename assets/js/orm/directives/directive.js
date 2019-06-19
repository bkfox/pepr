/** @module orm/directives/directive **/

/**
 * Directives are used to extend a model and implement methods on the related
 * store (getters, actions, etc.). A directive does it using the `run`
 * hook.
 *
 * When ran for a model field, if `attr` is provided, it create a getter to
 * this attribute for the given field, such as: `model[field] => model[attr]`.
 */
export default class Directive {
    /**
     * @param options
     * @param {String} options.attr - related model instance's attribute
     */
    constructor(attr=null) {
        this.attr = attr;
    }

    // database store
    store(database) {
        return null;
    }

    /**
     * Return a store to merge into model's store.
     * @param {Database} database
     * @param {Model} model - model class
     * @param {null|String} field - field name
     * @returns {Object} - module options to merge into model's
     */
    modelModule(database, model, field=null) {
        return null;
    }

    /**
     * Return object to mix in in model's prototype.
     *
     * Add directive's static method `plugin` to model's plugins if defined.
     *
     * Field directive's `attr` is set to `field` if not provided, and a
     * property is defined such as: `model[field] => model[attr]`.
     *
     * @param {Database} database
     * @param {Model} model - model class
     * @param {null|String} field - field name
     * @returns {Object} - model prototype
     */
    modelPrototype(database, model, field=null) {
        this.attr = this.attr || field;

        // add static plugin to model's plugins if any
        if(this.constructor.plugin)
            model.plugins['dir.' + this.constructor.name] = this.constructor.plugin;

        if(field !== null) {
            const attr = this.attr;
            if(attr && attr != field && model.prototype[field] === undefined) {
                const descriptor = this.asProperty(model, field);
                if(descriptor)
                    return Object.defineProperty({}, field, descriptor);
            }
        }
        return null;
    }

    /**
     * Return property descriptor used by `modelPrototype` to create model property.
     * @returns {null|Object} property descriptor passed to `Object.defineProperty`
     */
    asProperty(model, field) {
        const attr = this.attr;
        return { enumerable: true, get() { return this[attr] } };
    }
}


/**
 * Static method added to model's plugin if present (once per class).
 * @param {Vuex.Store} - store
 * @param {Model} - model
 */
Directive.plugin = null

/**
 * Method called by model's plugin if present (called on each instance of Directive)
 * @param {Vuex.Store} - store
 * @param {Model} - model
 * @param {String} - field
 */
Directive.prototype.plugin = null



