/** @module orm/directives/reference **/
import Vue from 'vue';
import Directive from './directive';

import {iterable} from '../utils';


/**
 * Create a property on Model used to retrieve related target(s), whose
 * keys are retrieved from Model's `attr`. Items not present in store are
 * fetched from the server.
 *
 * This directive uses the same store for both models.
 *
 * @extends module:orm/directives/directive.Directive
 */
export default class ReferenceDirective extends Directive /** @lends ReferenceDirective **/ {
    /**
     * @param options
     * @param {Model} options.target - target model class of Reference
     * @param {Boolean} options.reverse - reverse Reference
     */
    constructor(attr, target, {reverse=false,fetch=false}={}) {
        super(attr);
        this.target = target;
        this.reverse = reverse;
        this.fetch = fetch;
    }

    asProperty() {
        const target = this.target;
        const attr = this.attr;
        return {
            get() {
                const keys = this[attr];
                if(!keys)
                    return null;
                return iterable(keys) ? target.getter('getList')(keys)[0]
                                      : target.getter('get', keys);
            },

            set(items) {
                this[attr] = iterable(keys)
                    ? [...items].map(item => item.$key).filter(key => key)
                    : items.$key;
            },
        }
    }

    /**
     * @method
     * @param {Database} database
     * @param {Model} model
     * @param {String} field
     * @return {module:orm/directives/reference.ReferenceDirective.ModelPrototype}
     */
    modelPrototype(database, model, field) {
        const prototype = super.modelPrototype(database, model, field);
        if(field === null)
            return prototype;

        const target = this.target;

        /**
         * @namespace ModelPrototype
         * @memberof module:orm/directives/reference.ReferenceDirective
         */
        return /** @lends module:orm/directives/reference.ReferenceDirective.ModelPrototype **/ {
            ...prototype,

            /**
             * Return a Promise resolving to item's references or null. Fetches missing items when required, and items' order is not guaranteed to follows keys' ones.
             * @param {String} field - field's name
             */
            $ref(field) {
                if(!(target instanceof Record))
                    throw "reference's target must be a Record";

                const keys = this[field];
                if(!keys)
                    return Promise.resolve(null);

                // We don't keep items can be sorted upstream, this avoids more complex code
                // and can be handled upstream (and avoids case of results being sort twice
                // if upstream need to sort again).
                if(keys instanceof Array || keys instanceof Set) {
                    let [items, keys] = target.getter('getList')(keys);
                    return target.fetchList({keys, store: item.$tore})
                                 .then(missings => [...items, ...missings]);
                }
                return target.dispatch(item.$store, 'fetch')
            }
        }
    }
}


