/** @module orm/directives/index_ **/
import Indexer from '../indexer';
import Directive from './directive';

/**
 * Create an index of stored elements for the provided model and field.
 *
 * @extends module:orm/directives/directive.Directive
 * @see module:orm/indexer.Indexer
 */
export default class IndexDirective extends Directive {
    /**
     * @param options
     * @param [options.lookup=this.attr] - function or attribute name used as lookup.
     * @param {String=} options.index - Index name (by default model's field)
     */
    constructor(attr, {key=null, index=null, ...options}={}) {
        super(attr)
        /**
         * @member key
         * @see {Indexer.key}
         */
        this.key = key;
        this.index = index;
    }

    plugin(store, model, field=null) {
        if(!field && !this.index)
            throw "`index` name must be provided to IndexDirective when it " +
                  "is not used as model's fields";

        this.index = this.index || field;
        this.indexer = new Indexer(this.key !== null ? this.key : this.attr);
        model.commit(store, 'indexer', {index: this.index, indexer: this.indexer});
    }
}




