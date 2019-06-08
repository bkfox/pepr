import Vue from 'vue';

import Drop from 'pepr/utils/drop';
import { fetch_api, fetch_json } from './connection';

/**
 * A Resource is wrapper that is used to load and edit data on the server.
 * It uses HyperLinked identifiers in order to interact with the distant
 * server: Resource's id is an url to the loaded data.
 */
export default class Resource extends Drop {
    constructor(data=null, {id=null, ...options}={}) {
        super();

        this.data = data;
        if(id) {
            if(this.data === null)
                this.data = {};
            this.data.id = id;
        }
    }

    /**
     *  @property {String} id - resource's unique id (based on object key and type).
     */
    get id() { return this.attr("id"); }

    /**
     *  @property {String} path - resource's url.
     */
    get path() { return this.id; }

    /**
     *  @property {String|...} key - resource's actual key
     */
    get key() { return this.attr("pk"); }

    /**
     *  @property {String} type - human readable object type.
     */
    get type() { return this.attr("_type"); }

    /**
     *  @property {[String]} actions - array of available api action for this
     *  resource.
     */
    get actions() { return this.attr("_actions"); }

    /**
     * Get data attribute if any, or undefined.
     */
    attr(name) {
        return this.data ? this.data[name] || undefined : undefined;
    }


    /**
     * Fetch a resource from the server and return a Promise resolving to it.
     */
    static load(id, options={}, initArgs={}) {
        const resource = new this(null, {...initArgs});
        return resource.fetch({id, ...options});
    }

    /**
     * Fetch multiple resources and return a Promise resolving to them.
     */
    static loadList(endpoint, options={}, initArgs={}) {
        const self = this;
        return fetch_json(endpoint, options).then(
            data => {
                const items = data.results.map(item => new self(item, initArgs))
                data.results = items;
                return data;
            }
        );
    }

    /**
     *  Save a resource to the server and return a Promise resolving to the new
     *  Resource instance.
     */
    static create(endpoint, data, initArgs={}) {
        const resource = new this(data, initArgs);
        return resource.save(null, endpoint);
    }

    /**
     *  Fetch resource from server and update itself.
     *  @param {String} id - fetch using this resource id
     *  @param {Boolean} list - take the first item of the expected result list
     *  @param {Object} options - fetch options
     *  @return a Promise completing to self once updated.
     */
    fetch({id=null, list=false, ...options}={}) {
        const self = this;
        return fetch_json(id || this.id, options).then(
            list ? data => { Vue.set(self, 'data', results[0] || null); return self }
                 : data => { Vue.set(self, 'data', data); return self },
            data => { Vue.set(self, 'data', null); return Promise.reject(data) })
    }

    /**
     *  Run an action for this resource. Resource's id is concatenated with
     *  given `path`.
     */
    api(path='', ...fetchArgs) {
        return fetch_json(this.id + path, ...fetchArgs);
    }

    /**
     *  Save resource to the server. If `data` is given use it instead of
     *  resource's data.
     *
     *  Return promise resolving to the updated Resource instance.
     */
    save(data=null, endpoint=null) {
        const [id, method] = this.key ? [this.id, 'PUT'] : [endpoint, 'POST'];
        if(!id)
            throw "No endpoint found for this resource";

        const self = this;
        return fetch_json(id, { method: method, body: data || this.data })
            .then(data => { self.data = data; return self; });
    }

    /**
     * Delete item from the server. Return promise resolving to the removed
     * resource if a request has been made to the server.
     */
    delete() {
        if(this.key) {
            const self = this;
            return fetch_json(this.id, { method: 'DELETE' }, false)
                .then(response => { self.drop(); return self; });
        }
        else self.drop();
    }

    /**
     * Return edit form for this resource.
     */
    get_form() {
        const self = this;
        return fetch_api(this.id + 'form');
    }
}

