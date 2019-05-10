import Vue from 'vue';

import { fetch_api, fetch_json } from './connection';


/**
 * Handles CRUD operations over data and api.
 */
export default class Resource {
    constructor(endpoint, key, data={}, resources=null) {
        /**
         * @member {String} endpoint
         * Resource's endpoint (without key)
         */
        this.endpoint = endpoint;
        /**
         * @member {String} key
         * Resource key
         */
        this.key= key;
        /**
         * @member {Resources} resources
         * (Optional) parent Resource manager
         */
        this.resources = resources;
        Vue.set(this, 'data', data);
    }

    /**
     *  @property {String} resource's url. When resource is not saved on
     *  the server (has no key), set to endpoint
     */
    get path() {
        if(this.key)
            return this.endpoint + this.key + '/';
        return this.endpoint;
    }

    /**
     *  @property {String} human readable object type.
     */
    get type() {
        return this.data && this.data.object_type;
    }

    /**
     * Drop me
     */
    drop() {
        if(this.data.drop)
            this.data.drop();
    }

    /**
     *  Fetch a resource from the server and return a Promise resolving to the
     *  new Resource instance.
     */
    static load(endpoint, key, options={}) {
        const resource = new Resource(endpoint, key);
        return resource.fetch(options);
    }

    /**
     *  Save a resource to the server and return a Promise resolving to the new
     *  Resource instance.
     */
    static create(endpoint, data, options={}) {
        const resource = new Resource(endpoint, null, data)
        return resource.save();
    }

    /**
     *  Fetch resource from server and update itself.
     *  @return a Promise completing to self once updated.
     */
    fetch(options={}) {
        const self = this;
        return fetch_json(this.path, options)
            .then(response => response.json())
            .then(function(data) {
                Vue.set(self, 'data', data)
                return self;
            });
    }

    /**
     *  Run an action for this resource. Resource's path is concatenated with
     *  given `path`.
     */
    api(path='', ...initArgs) {
        return fetch_json(this.path + path, ...initArgs);
    }

    /**
     *  Save resource to the server. If `data` is given update
     *  resource's data for the given fields.
     *
     *  Return promise resolving to the updated Resource instance.
     */
    save(data={}) {
        const self = this;
        return fetch_json(this.path,
                          { method: this.key ? 'PUT' : 'POST',
                            body: Object.assign({}, this.data, data) })
            .then(response => response.json())
            .then(function(data) {
                // TODO: test success
                Vue.set(self, 'key', data.pk)
                Vue.set(self, 'data', data)
                if(self.resources)
                    self.resources.update(data);
                return self;
            });
    }

    /**
     * Delete item from the server. Return promise resolving to the removed
     * resource if a request has been made to the server.
     */
    delete() {
        if(this.key) {
            const self = this;
            return fetch_json(this.path, { method: 'DELETE' }, false)
                .then(function(response) {
                    // TODO: test success
                    if(self.resources)
                        return self.resources.remove(self);
                    self.data = null;
                    return self
                });
        }
        else if(self.resources)
            self.resources.remove(self)
    }

    /**
     * Return edit form for this resource.
     */
    get_form() {
        const self = this;
        return fetch_api(this.path + 'form');
    }
}

