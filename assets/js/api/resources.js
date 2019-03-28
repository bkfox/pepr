import _ from 'lodash';

import Pubsub from './pubsub';


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
        this.pubsub = null;
    }

    drop() {
        for(var item of this.items)
            item.drop && item.drop();
        this.pubsub && this.pubsub.drop();
    }

    /**
     *  Subscribe to the server to the given resource and filter.
     */
    subscribe(path, filter, lookup) {
        if(!this.pubsub) {
            var self = this;
            var pubsub = new Pubsub(this.connection)
            pubsub.onCreate = (event, item) => self.update(item);
            pubsub.onUpdate = (event, item) => self.update(item);
            pubsub.onDelete = (event, item) => self.remove(item);
            this.pubsub = pubsub;
        }
        return this.pubsub.subscribe(path, filter, lookup);
    }

    /**
     *  Unsubscribe from the server.
     */
    unsubscribe() {
        if(this.pubsub)
            this.pubsub.unsubscribe();
    }

    /**
     * Return item's index in collection or -1.
     */
    indexOf(item) {
        var predicate = {};
        predicate[this.key] = item[this.key];
        return _.findIndex(this.items, predicate);
    }

    /**
     * Return True if item is saved on the server; this is done by checking
     * existence of item's key (no request is made to the server).
     */
    isSaved(item) {
        return item[key] !== null && item[key] !== undefined;
    }

    /**
     *  Get items from the given address and add them to resources.
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
     * Close active requests
     */
    close() {
        this.unsubscribe();
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
    publish(...items) {
        var requests = [];
        for(var item of items) {
            payload = {method: this.isSaved(item) ? 'PUT' : 'POST'};
            requests.push(this.submit(payload, item));
        }
        return requests;
    }

    /**
     * Delete items from the server.
     */
    unpublish(...items) {
        // TODO: only pk/this.key in stanza
        var requests = [];
        for(var item of items) {
            payload = {method: 'DELETE'};
            return this.submit(payload, item);
        }
        return requests;
    }

    /**
     *  Insert item into list at given index, ensure uniqueness and server
     *  synchronization.
     *
     *  @param {Number} index    position
     *  @param {Object} ...items object to insert to resources
     *  @return inserted items
     */
    insert(index, item) {
        var currentIndex = this.indexOf(item);
        if(currentIndex == -1)
            return;
        this.items.splice(currentIndex, 1);
        index = index > currentIndex ? index-1 : index;
        index = Math.max(-1, index);
        this.items.splice(index, 0, item);
        return item;
    }

    /**
     * Replace item if present or insert it.
     * @return updated/inserted items
     */
    update(item) {
        var currentIndex = this.indexOf(item);
        this.items.splice(currentIndex,
                          currentIndex == -1 ? 0 : 1,
                          item);
        return item;
    }

    /**
     * Delete an item from collection.
     */
    remove(item, drop=false) {
        var index = this.indexOf(item);
        if(index != -1)
            this.items.splice(index, 1);
        drop && item.drop && item.drop();
    }

    /**
     * Clean up the entire collection.
     */
    reset() {
        this.items.splice(0, this.items.length);
        this.unsubscribe();
    }
}

