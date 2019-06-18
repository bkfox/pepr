/** @module orm/record **/
import merge from 'lodash/merge';
import kebabCase from 'lodash/kebabCase';

import Model from './model';
import RecordModule from './recordModule';


/**
 * A Record is a Model that can be fetched and edited on the server.
 * It exposes various methods, which can be used with or without store.
 *
 * @extends module:orm/model.Model
 */
export default class Record extends Model {
    /**
     * Return API url for the provided primary key.
     * @param {ModelKey|null} key - primary key
     */
    static url(key=null) {
        return key ? this.endpoint + key + '/' : this.endpoint;
    }

    /**
     * Return options used for all fetch calls
     */
    static get fetchOptions() {
        // FIXME: support form multipart ContentType
        return { headers: { Accept: 'application/json',
                            'Content-Type': 'application/json' } }
    }

    /**
     * Return a list of items' data from the given server response. Default
     * implementation returns `data.results`.
     * @param {Object} data - data received from server
     */
    static getFetchResults(data) {
        return data.results;
    }

    /**
     * Fetch an item from the server using provided object key and fetch options.
     * @param {Object} options - options of javascript's `fetch()`
     * @param {String} options.url - overrides url generated for `options.key`
     * @param options.key - key of the object to fetch
     * @param {Vuex.Store} [options.store=] - if provided, data is stored, and promise resolves to the stored item.
     *
     * @return a Promise resolving the item data or rejecting the response.
     */
    static fetch({url=null, key=null, store=null, collection=null, ...options}) {
        url = url ? url : this.url(key);
        options = merge(this.fetchOptions, options);

        const self = this;
        var promise = fetch(url, options).then(
            response => response.status > 399 ? Promise.reject(response)
                                              : response.json()
        );
        return store ? promise.then(
            data => this.dispatch('update', {collection, data}, store)
        ) : promise;
    }

    /**
     * Fetch a list of items for the given url and resolve to the list of
     * retrieved item data (or updated stored items if store is provided).
     *
     * When `keys` is provided, fetch items with this keys only (in such case, when
     * no url is provided, fetch them separately).
     *
     * @param {Object} options - see `fetch()` options
     * @param {ModelKey[]} options.keys - items' keys
     */
    static fetchList({url=null, keys=null, store=null, collection=null, ...options}) {
        if(keys)
            keys = new Set(keys);

        var promise = keys && !url ?
            Promise.all(...[...keys].map(key => this.fetch({...options, key}))) :
            this.fetch({...options, url}).then(data => this.getFetchResults(data));

        if(keys && url)
            promise = promise.then(items => items.filter(item => keys.has(item.$key)))

        return store ? promise.then(
            datas => this.dispatch('updateList', {collection, datas})
        ) : promise;
    }

    static modelize(database) {
        super.modelize(database)
        if(!this.endpoint)
            /**
             * Server endpoint for this record.
             * @member {String} Record.endpoint
             * @memberof Record
             * @static
             */
            this.endpoint = database.endpoint + kebabCase(this.name.toLowerCase());
    }

    /**
     * Return API url for this instance object.
     */
    get $url() {
        return this.$key & this.$.url(this.$key);
    }

    /**
     * Return a version of model that is sent to the server.
     */
    $serialize() {
        return this;
    }

    /**
     * Call an API action on this record's endpoint
     */
    $fetch(action, options) {
        if(!this.$key)
            throw "$fetch can be called only on saved record instances";
        options.url = this.$url + action;
        options.store = this.$store;
        return this.$.fetch(options);
    }

    /**
     * Save item to the server and resolve to its updated version.
     * Object instance value is updated only if it is not stored.
     *
     * @param {Object} options - `fetch()` options
     * @param {Boolean} updateMe - if true, udpate this instance with retrieved data.
     */
    $post(options={}, updateMe=true) {
        var promise = this.fetch({ ...options,
            method: options.method || this.$key ? 'PUT' : 'POST',
            url: options.url || this.$key ? this.$url() : this.$.endpoint,
            body: this.$serialize(),
        })
        return promise.then(data => this.$update(data))
    }

    /**
     * Delete item from the server.
     * @method
     * @return Promise from fetch result.
     */
    $delete() {
        if(!this.$key)
            throw "record is not saved - no way to delete it."

        var promise = this.$.fetch({key: this.$key, method: 'DELETE',
                                    asRecord: false});
        return this.$store ? promise.then(
            item => this.dispatch('remove', {key: this.key(item)})
        ) : promise;
    }
}

Record.module = RecordModule;

