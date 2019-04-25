import _ from 'lodash';
import Vue from 'vue';

import Pubsub from './pubsub';
import Resource from './resource';
import {fetch_json} from './connection';


export class ResourcesInfo {
    constructor(connection, path, keyAttr) {
        this.connection = connection;
        this.path = path;
        this.keyAttr = keyAttr;
    }
}


class Resources extends ResourcesInfo {
    constructor(connection, path, keyAttr, items=[], query={})
    {
        super(connection, path, keyAttr)
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

    asResource(item) {
        return item instanceof Resource ? item
            : new Resource(this.path, item[this.keyAttr], item, this);
    }

    /**
     * Return item's index in collection or -1.
     */
    indexOf(item) {
        var value = this.asResource(item).key;
        return this.items.findIndex(obj => obj.key == value);
    }

    /**
     * Return current item corresponding to the given one
     */
    find(item) {
        var value = this.asResource(item).key;
        return this.items.find(obj => obj.key == value);
    }

    /**
     * Insert item into list at given index, ensure uniqueness.
     *
     * @param {Number} index position (if -1, insert at the end of array)
     * @param {Object} item  object to insert to resources
     * @return the resource for the inserted item
     */
    insert(index, item) {
        // TODO: check if reactivity works without currentIndex branching
        //          => only using items' splices
        item = this.asResource(item);
        var currentIndex = this.indexOf(item);
        if(currentIndex != -1) {
            const old = this.items.splice(currentIndex, 1)[0];
            Vue.set(old, 'data', item.data);
            item = old;

            if(index > currentIndex)
                // move index to the left if item has been removed before
                index = Math.max(0, index-1);
        }

        this.items.splice(index, 0, item);
        return item;
    }

    /**
     * Replace item if present or insert it.
     * @return the resource for this item
     */
    update(item) {
        item = this.asResource(item);
        const resource = this.find(item);
        if(!resource)
            return this.items.push(item);
        Vue.set(resource, 'data', item.data)
        return resource;
    }

    /**
     * Delete an item from collection.
     * @return the removed item
     */
    remove(item, drop=true) {
        var index = this.indexOf(item);
        if(index == -1)
            return;

        drop && this.items[index].drop();
        return this.items.splice(index, 1)[0];
    }

    /**
     * Clean up the entire collection and unsubscribe.
     * @return the removed items
     */
    reset(drop=true) {
        this.unsubscribe();
        if(drop)
            for(var item of this.items)
                item.drop();
        return this.items.splice(0, this.items.length);
    }

    /**
     *  Get items from the given address and add them to resources.
     *  Options is passed down to `fetch_json` method.
     *
     *  Extra `options` values:
     *  - reset: reset items and list before loading.
     */
    get(path, options={}, reset=false) {
        options = options || {};
        options.query = options.query || {};

        if(options.reset)
            this.reset();

        // TODO: payload setdefault || \E lodash setdefault ???
        //       -> requests.set(Payload|Query)Default
        var req = fetch_json(path, options);

        var self = this;
        req.then(function(response) {
            return response.json()
        }).then(function(data) {
            self.nextUrl = data.next;
            self.previousUrl = data.previous;
            for(var resource of data.results)
                self.update(resource);
        })
        return req;
    }

    /**
     *  Load items from the server.
     */
    load(options={}, ...args) {
        options = _.merge({ query: this.query }, options);
        return this.get(this.path, options, ...args)
    }

    /**
     *  Load next items from server
     */
    next(...args) {
        if(this.nextUrl)
            return this.get(this.nextUrl, ...args);
    }

    /**
     *  Load previous items from server
     */
    previous(...args) {
        if(this.previousUrl)
            return this.get(this.previousUrl, ...args);
    }

    /**
     *  PubSub subscribe to the server for the given resource and filter.
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
     *  Pubsub unsubscribe from the server.
     */
    unsubscribe() {
        if(this.pubsub)
            this.pubsub.unsubscribe();
    }
}


export default Resources;

