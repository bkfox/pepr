import _ from 'lodash';

import Observer from './observer';


export default class Resources {
    constructor(connection, path, key, items=[], query={})
    {
        this.connection = connection;
        this.path = path;
        this.key = key;
        this.items = items;
        this.query = query;
        this.nextUrl = null;
        this.previousUrl = null;
        this.observer = null;
    }

    /**
     * Return item's index in collection or -1.
     */
    indexOf(item) {
        return this.items.findIndex(function(a) {
            return a[attr] == item[attr];
        });
    }

    /**
     * Return True if item is saved on the server; this is done by checking
     * existence of item's key (no request is made to the server).
     */
    isSaved(item) {
        return item[key] !== null && item[key] !== undefined;
    }

    /**
     *  Get items from the given address
     */
    get(path, payload=null, reset=false) {
        payload = payload || {};
        payload.query = payload.query || {};

        // TODO: payload setdefault || \E lodash setdefault ???
        //       -> requests.set(Payload|Query)Default
        var req = this.connection.request(path, payload);

        var self = this;
        req.then(function(message) {
            var data = message.data;
            self.nextUrl = data.next;
            self.previousUrl = data.previous;
            self.items.push(...data.results);
        })

        return req;
    }

    /**
     *  Load items from server
     */
    load(payload=null, ...args) {
        payload = _.merge({ query: this.query }, payload || {});
        return this.get(this.path, payload, ...args)
    }

    /**
     *  Load next items from server
     */
    next(...args) {
        if(this.nextUrl)
            return this.get(this.nextUrl, payload, ...args);
    }

    /**
     *  Load previous items from server
     */
    previous(...args) {
        if(this.previousUrl)
            return this.get(this.previousUrl, ...args);
    }

    /**
     * Send item to the server.
     */
    submit(payload, item=null) {
        var path = this.path + '/' + item[this.key];
        if(item)
            payload.data = item;
        return this.connection.request(path, payload);
    }

    /**
     *  Synchronize item to the server (create, update, delete). Request
     *  method is adapted to wether item is saved or not.
     */
    sync(item, remove=false) {
        payload = {
            method: (remove && 'DELETE') ||
                    (this.isSaved(item) && 'PUT') || 'POST'
        }
        return this.submit(payload, item);
    }

    /**
     *  Insert item into list at given index, ensure uniqueness and server
     *  synchronization.
     *
     *  @param {Object} item   object to insert to resources
     *  @param {Number} index  position
     */
    insert(index, item, sync=false) {
        var currentIndex = this.indexOf(item);
        if(currentIndex != -1) {
            this.items.splice(currentIndex, 1);
            index = index > currentIndex ? index-1 : index;
        }
        this.items.splice(index, 0, item);

        if(sync)
            this.sync(item);
    }

    /**
     * Replace item if present or insert it.
     */
    update(item, sync=false) {
        var currentIndex = this.indexOf(item);
        this.items.splice(currentIndex,
                          currentIndex == -1 ? 0 : 1,
                          item);

        if(sync)
            this.sync(item);
    }

    /**
     * Delete an item from collection
     */
    remove(item, sync=false) {
        var index = this.indexOf(item);
        if(index != -1)
            this.items.splice(index, 1);

        if(sync)
            this.sync(item, true);
    }

    /**
     * Bind to a specific server resource if not yet bound.
     *
     * @param {String} collectionUrl API base url of the collection object;
     * @param {Boolean} observe observe the distant collection (sync to list changes)
     * @param {Boolean} force;
     */
    observe(path, force=false) {
        if(this.observer) {
            if(!force || this.observer.path == path)
                return;
            this.observer.off('message', this.onObservation, {self: this});
            this.observer = null;
        }

        if(observe) {
            this.observer = this.connection.observe(path);
            this.observer.on('message', this.onObservation, {self: this});
        }
    }

    /**
     * Handle a pubsub message and update collection accordingly.
     */
    onObservation(event) {
        if(!event.requestOk)
            return;

        var message = event.message;
        var item = message.data;
        switch(message.method) {
            case 'POST':
            case 'PUT': this.update(item); break;
            case 'DELETE': this.remove(item); break;
            default:
                break;
        }
    }

    /**
     * Reset binding to server
     */
    resetObserver() {
        if(!this.observer)
            return;
        this.observer.off('message', this.onObservation, {self: this});
    }

    /**
     * Clean up the entire collection.
     */
    reset() {
        this.items.splice(0, this.items.length);
        this.resetObserver();
    }
}

