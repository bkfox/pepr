import Vue from 'vue';

import { fetch_api, fetch_json } from './connection';


export default class Resource {
    constructor(endpoint, key, data={}, resources=null) {
        this.endpoint = endpoint;
        this.key= key;
        this.resources = resources;
        Vue.set(this, 'data', data);
    }

    static load(endpoint, key, options={}) {
        const resource = new Resource(endpoint, key);
        return resource.fetch(options);
    }

    get path() {
        if(this.endpoint && this.key)
            return this.endpoint + this.key + '/';
        return '';
    }

    get connection() {
        return this.resources.connection;
    }

    drop() {
        if(this.data.drop)
            this.data.drop();
    }

    fetch(options={}) {
        const self = this;
        return fetch_json(this.path, options)
            .then((response) => response.json())
            .then(function(data) {
                Vue.set(self, 'data', data)
                return self;
            })
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
        return fetch_json(this.path || this.resources.path,
                          { method: this.path ? 'PUT' : 'POST',
                            body: Object.assign({}, this.data, data) })
            .then(function(response) {
                Vue.set(self, 'data', item.data)
                if(self.resources)
                    self.resources.update(response.json());
            });
    }

    /**
     * Delete item from the server. Return promise resolving to the removed
     * resource if a request has been made to the server.
     */
    delete() {
        if(this.path) {
            const self = this;
            return fetch_json(this.path, { method: 'DELETE' }, false)
                .then(function(response) {
                    if(self.resources)
                        return self.resources.remove(self);
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

