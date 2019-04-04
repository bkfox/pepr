import { fetch_api, fetch_json } from './connection';


export default class Resource {
    constructor(resources, data) {
        this.resources = resources;
        this.data = data;
    }

    get key() {
        return this.data[this.resources.key];
    }

    get path() {
        if(this.key)
            return this.resources.path + this.key + '/';
        return '';
    }

    get connection() {
        return this.resources.connection;
    }

    drop() {
        if(this.data.drop)
            this.data.drop();
    }

    /**
     *  Run an action for this resource. Resource's path is concatenated with
     *  given `path`.
     */
    api(path='', ...initArgs) {
        return this.connection.request(this.path + path, ...initArgs);
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
                return self.resources.update(response.json());
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
                    return self.resources.remove(self);
                });
        }
        else
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

