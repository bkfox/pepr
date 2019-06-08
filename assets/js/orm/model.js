import Vue from 'vue';

import {as} from './utils';


// lookup: {attr: lookup}|[lookups]|pred(item,attr=null)|value
// -> FIXME: conflict if we recurse between attrs & value
export function match(lookup, value) {
    if(lookup instanceof Object) {
        // FIXME: how to 
    }
    else if(lookup instanceof Array) {

    }

}


/**
 * Basic store options for models.
 */
export const ModelStore = {
    getters: {
        model(state) {
            return state.model;
        },

        all(state) {
            return state.all;
        },

        // match(lookup, value)
        // find(lookup) / findKeys
    },

    mutations: {
        /// Insert the given data into the store if not present
        insert(state, data) {
            data = as(state.model, data);
            if(data.$key === null)
                throw "missing key for data";

            if(state.all[data.$key] === undefined)
                Vue.set(state.all, data.$key, data);
        },

        /// Insert given data into the store (overrides existing data).
        reset(state, data) {
            data = as(state.model, data);
            if(data.$key === null)
                throw "missing key for data";
            Vue.set(state.all, data.$key, data);
        },

        /// Remove the given instance from the store
        remove(state, data) {
            data = as(state.model, data);
            if(data.$key)
                Vue.delete(state.all, data.$key);
        },

        /// Remove from the store at the given key
        removeAt(state, key) {
            Vue.delete(state.all, key);
        },
    },
}


export default class Model {
    static modelize(model) {
        if(!this.entity) {
            this.entity = this.name.toLowerCase() + 's';
            this.primaryKey = 'pk'
            this.fields = {};
            this.directives = {};
        }

        for(let attr in model)
            this[attr] = model[attr]

        // rebuild list of indexed fields.
        this.indexes = this.findFields(directive);
    }

    /**
     * Search fields having this `directive` and return as an object (or array
     * of `[fieldName, fieldDirective]`, if `asArray`).
     */
    static findFields(directive, asArray=false) {
        let fields = Object.entries(this.fields).filter([k, v] => v.has(directive));
        return asArray ? fields
                       : fields.reduce((m, [k, v]) => { m[k] = v; return m; }, {});
    }

    static get state() {
        return {
            model: this,
            all: {},
        }
    }

    static commit(name, ...args) {
        return this.$store.commit(this.entity + '/' + name, ...args);
    }

    static getters(name) {
        return this.$store.getters[this.entity + '/' + name];
    }

    static dispatch(name, ...args) {
        return this.$store.dispatch(this.entity + '/' + name, ...args);
    }

    // TODO HERE
    // -> registerDirective(directive, field=null)
    //
    // fields: {
    //      a: Field({ index: Index() }),
    //      b: Directive({}, Relation(), Index())
    // },
    // directives: []
    //
    //
    static onRegister(database) {
        // common store options
        database.register(this, ModelStore);

        // model directives
        // TODO

        // fields directives
        for(let name of Object.keys(this.fields || {})) {
            let field = this.fields[name];
            if(field instanceof Array)
                for(let directive of field)
                    directive.onRegister(database, this, name)
            else
                field.onRegister(database, this, name)
        }
    }

    constructor(data=null) {
        for(let attr in data)
            this[attr] = data[attr];
    }

    /**
     * Return constructor in order to access statics as: obj.$.commit()
     */
    get $() {
        return this.constructor;
    }


    /**
     * Return instance primary key or null.
     */
    get $key() {
        const attr = this.constructor.primaryKey;
        return attr in this ? this[attr] : null;
    }
}

