import Vue from 'vue';

import Shared from '../utils/shared';
import { fetch_api, fetch_json } from './connection';


/**
 * A Resource is wrapper that is used to load and edit data on the server.
 * It uses HyperLinked identifiers in order to interact with the distant
 * server: Resource's id is an url to the loaded data.
 */
export default class Resource extends Shared {
    constructor(data=null, {path=null, ...options}={}) {
        console.log('new resource', data, path, options)
        super(data, options);
        if(path) {
            if(this.data === null)
                this.data = {};
            this.data.id = path;
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
    static load(path, options={}, initArgs={}) {
        const resource = new this(null, {...initArgs, path});
        return resource.fetch(options);
    }

    /**
     * Fetch multiple resources and return a Promise resolving to them.
     */
    static loadList(path, options={}, initArgs={}) {
        const self = this;
        return fetch_json(path, options).then(
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
        const resource = new this(null, initArgs);
        return resource.save(data, endpoint);
    }

    /**
     *  Fetch resource from server and update itself.
     *  @return a Promise completing to self once updated.
     */
    fetch(options={}) {
        const self = this;
        return fetch_json(this.path, options)
            .then(data => { self.data = data; return self },
                  data => { self.data = null; return Promise.reject(data) })
    }

    /**
     *  Run an action for this resource. Resource's path is concatenated with
     *  given `path`.
     */
    api(path='', ...fetchArgs) {
        return fetch_json(this.path + path, ...fetchArgs);
    }

    /**
     *  Save resource to the server. If `data` is given update
     *  resource's data for the given fields.
     *
     *  Return promise resolving to the updated Resource instance.
     */
    save(data={}, endpoint=null) {
        const [path, method] = this.key ? [this.path, 'PUT'] : [endpoint, 'POST'];
        if(!path)
            throw "No endpoint found for this resource";

        const self = this;
        const body = Object.assign(this.data, data);
        return fetch_json(path, { method: method, body: body })
            .then(data => { self.data = data; return self; });
    }

    /**
     * Delete item from the server. Return promise resolving to the removed
     * resource if a request has been made to the server.
     */
    delete() {
        if(this.key) {
            const self = this;
            return fetch_json(this.path, { method: 'DELETE' }, false)
                .then(response => { self.drop(); return self; });
        }
        else self.drop();
    }

    /**
     * Return edit form for this resource.
     */
    get_form() {
        const self = this;
        return fetch_api(this.path + 'form');
    }
}

