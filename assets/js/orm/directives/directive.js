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
        if(attr !== null)
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
     * @param {String} field - field name
     * @returns {Object} - module options to merge into model's
     */
    modelModule(database, model, field=null) {
        return null;
    }

    /**
     * Return object to mix in in model's prototype.
     *
     * Field directive's `attr` is set to `field` if not provided, and a
     * property is defined such as: `model[field] => model[attr]`.
     *
     * @param {Database} database
     * @param {Model} model - model class
     * @param {String} field - field name
     * @returns {Object} - model prototype
     */
    modelPrototype(database, model, field=null) {
        if(field !== null) {
            this.attr = this.attr || field;

            const attr = this.attr;
            if(!attr || attr == field || model[field] !== undefined)
                return;

            const descriptor = this.asProperty(model, field);
            if(descriptor)
                return Object.defineProperty({}, field, descriptor);
        }
        return null;
    }

    /**
     * Return property descriptor used by `modelPrototype` to create model property.
     * @returns {null|Object} property descriptor passed to `Object.defineProperty`
     */
    asProperty(model, field) {
        const attr = this.attr;
        return { enumerable: true,
                 get() { return this[attr] } };
    }

    /**
     * Vuex plugin called for a related model.
     * @param {Vuex.Store} store - store
     * @param {Model} model - related model class
     * @param {String=} field - field name or null
     */
    plugin(store, model, field=null) {}

}


