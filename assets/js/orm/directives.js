
/**
 * Directives are used to extend a model and implement methods on the related
 * store (getters, actions, etc.). A directive does it using the `run`
 * hook.
 *
 * Directives can be nested.
 */
export default class Directive {
    constructor({attr=null}={}, ...directives) {
        if(attr !== null)
            this.attr = attr;
        this.register(directives);
    }

    get key() { return 'directive' }
    set key(key) {
        Object.defineProperty(this, 'key', {
            value: key, enumerable: true, writable: true
        })
    }

    /**
     * Return true if there is a directive of this key
     */
    has(key) {
        return this.key == key || this.directives[key];
    }

    /**
     * Get directive by key
     */
    get(key) {
        if(key == this.key)
            return this;
        return this.directives[key];
    }

    /**
     * Register inner directives (overrides existing directives).
     */
    register(directives) {
        directives = directives.reduce((map, directive) => {
                map[directive.key] = directive;
                return map;
        }, {});
        this.directives = {...this.directives, directives};
    }

    /**
     * Generate key for entities' items (passed to Database.register)
     */
    getKey(k) {
        let field = this.field.charAt(0).toUpperCase() + this.field.substring(1);
        return k + field;
    }

    /**
     * Return the descriptor of a property to create on model for the given
     * field.
     */
    asProperty(model, field) {
        const attr = this.attr;
        return { get() { return this[attr]; } }
    }

    /**
     * Run a directive over provided `database` and `model`. The `field`
     * attribute defines for which model field the directive is running.
     *
     * Default behaviour binds `model[directive.attr]` to `model[field]` if
     * they're provided and differs.
     */
    run(database, model, field=null) {
        if(field !== null) {
            this.field = field;

            // define a getter to this.attr for the given field name
            const attr = this.attr;
            if(attr && attr != field && !model[field])
                Object.defineProperty(model.prototype, field, this.asProperty(model, field))
            else if(!attr)
                this.attr = field;
        }

        this.directivesOnRegister(database, model, field)
    }

    /**
     * Run inner directives.
     */
    runDirective(database, model, field=null) {
        for(let directive of Object.values(this.directives))
            directive.run(database, model, field)
    }
}

/**
 * Create a new directive
 */
export function Attr(...args) {
    return new Directive(...args);
}


/**
 * Directive providing `by${field}` and `findBy${field}` methods on the store.
 */
export class FieldDirective extends Directive {
    get key() { return 'field' }

    run(database, model, field) {
        super.run(database, model, field);

        const self = this;
        database.register(model, this, k => self.getKey(k));
    }

    getters() {
        const self = this;
        return {
            by: (...args) => self.getBy(...args),
            findBy: (...args) => self.findBy(...args),
            findKeysBy: (...args) => self.findKeysBy(...args),
        }
    }

    getBy(state) {
        const attr = this.attr;
        return lookup => Object.values(state.all).filter(
            item => item[attr] == lookup
        )
    }

    findBy(state) {
        const attr = this.attr;
        return lookup => Object.values(state.all).filter(
            item => lookup(item[attr])
        )
    }

    findKeysBy(...args) {
        const find = this.findBy(...args);
        return lookup => find(lookup).map(item => item.$key)
    }
}


/**
 * Create and return a field directive (`FieldDirective`).
 */
export function Field(...args) {
    return new FieldDirective(...args);
}


/**
 * Create an index of stored elements for the provided model and field.
 *
 * Defined getters:
 * - `indexBy${field}`: the actual index of items, as array of object pk.
 * - `by${field}`: a getter of items by the given index
 */
export class IndexDirective extends FieldDirective {
    constructor({many=false, ...options}={}) {
        super(options)
        this.many = many;
    }

    get key() { return 'index' }

    getters() {
        const self = this;
        return {
            ...super.getters(this),
            indexBy: (...args) => self.getIndex(...args),
        }
    }

    /**
     * Add an item pk to the index
     */
    toIndex(index, lookup, pk) {
        if(!index[lookup])
            index[lookup] = [pk]
        else
            index[lookup].push(pk);
    }

    /**
     * Index getter
     */
    getIndex(state) {
        const self = this;
        const field = this.attr;

        return Object.keys(state.all).reduce((map, pk) => {
            let lookup = state.all[pk][self.attr];
            if(self.many)
                for(let at in lookup)
                    self.toIndex(map, at, pk);
            else
                self.toIndex(map, lookup, pk);
            return map
        }, {})
    }

    /**
     * Items getter using index
     */
    getBy(state, getters) {
        let index = getters[this.getKey('indexBy')];
        return lookup => (index[lookup] || []).map(pk => state.all[pk])
    }

    /**
     * Find items getters using index
     */
    findBy(state, getters) {
        let findKeys = this.findKeysBy(state, getters);
        return lookup => findKeys(lookup).map(pk => state.all[pk])
    }

    /**
     * Find items keys getters using index
     */
    findKeysBy(state, getters) {
        let index = getters[this.getKey('indexBy')];
        return lookup => [
            ...new Set(Object.keys(index)
                             .filter(lookup)
                             .flatMap(at => index[at]))
        ];
    }
}


export function Index(...args) {
    return new IndexDirective(...args);
}



