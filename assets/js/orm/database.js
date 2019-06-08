import {mergeStores} from './utils';

// TODO: add $store to each model

/**
 * Store builder for the registered models.
 */
export default class Database {
    constructor() {
        this.entities = {};
    }

    /**
     * Register a model if not registered and merge the provided store
     * into the entity.
     */
    register(model, store={}, getKey=null) {
        if(this.entities[model.entity] === undefined) {
            this.entities[model.entity] = mergeStores({}, model);
            model.onRegister(this);
        }

        if(store)
            mergeStores(this.entities[model.entity], store, getKey);
    }

    /**
     * Return entity as module
     */
    module(entity) {
        return {
            namespaced: true,
            ...entity
        }
    }

    /**
     * Return entities as a `store.modules` object.
     */
    modules(modules) {
        const self = this;
        return Object.keys(this.entities).reduce((modules, name) => {
            modules[name] = {...modules[name], ...self.module(self.entities[name])}
            return modules
        }, {})
    }

    /**
     * Return a store options merged to the provided ones. Entities' values
     * overrides provided options in case of conflict, in order to ensure
     * determined behaviours.
     */
    store(options={}) {
        return {
            ...options,
            modules: this.modules(options.modules || {}),
            // plugins
        }
    }
}




