/** @module orm/directives **/
import Directive from './directive';
import CollectionDirective from './collection';
import IndexDirective from './index_';
import ReferenceDirective from './reference';


export {Directive, CollectionDirective, IndexDirective, ReferenceDirective }

/**
 * Return a new directive
 * @method
 * @see module:orm/directives/directive.Directive
 */
export function Attr(...args) {
    return new Directive(...args);
}


/**
 * Return a new Index directive.
 * @method
 * @see module:orm/directives/index_.IndexDirective
 */
export function Index(...args) {
    return new IndexDirective(...args);
}


/**
 * Return a new Reference directive.
 * @method
 * @see module:orm/directives/reference.ReferenceDirective
 */
export function Reference(...args) {
    return new ReferenceDirective(...args);
}


/**
 * Return a new Collection directive
 * @method
 * @see module:orm/directives/collection.CollectionDirective
 */
export function Collection(...args) {
    return new CollectionDirective(...args);
}


