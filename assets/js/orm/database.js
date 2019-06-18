/** @module orm/database **/
import {mergeStores} from './utils';


/**
 * Store builder for the registered models.
 */
export default class Database {
    /**
     * @param options - Set Database instance's attributes
     */
    constructor({endpoint='/', directives=null, fields=null}={}) {
        /**
         * @member {String} - API root endpoint (prepent to models' endpoints).
         */
        this.endpoint = endpoint;

        /**
         * @member {Object.<String,Model>} - registered models
         */
        this.models = {};

        /**
         * @member {Object} - the generated store
         */
        this.store = {
            modules: {},
            plugins: [],
        }
    }

    /**
     * Register a model class (if not registered) and merge the provided store
     * into the model's module.
     */
    register(model, store={}) {
        if(this.models[model.entity] === undefined) {
            // TODO: this.fields directives on database
            model.modelize(this);
            this.models[model.entity] = model;
            this.store = mergeStores(this.store, model.store(this));
            this.store.modules[model.entity] = model.module(this);
            console.log(model.module(this));
            this.store.plugins.push(store => model.plugin(store));
        }

        if(store)
            mergeStores(this.store.modules[model.entity], store);
    }
}




