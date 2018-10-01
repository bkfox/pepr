
/// Collection used to store items. It can subscribe to an object on
/// given stream in order to be kept updated.
class Collection {
    constructor(items=[]) {
        this.subscription = null;
        this.items = items || {};
    }

    init(connection, stream, pk) {
        this.connection = connection;
        // this.get(stream, pk);
        this.subscribe(stream, pk);
    }

    /// Subscribe to this object on stream. There can be only one
    /// subscription for a collection.
    subscribe(stream, pk) {
        if(this.subscription)
            throw "Yet subscribed";

        var self = this;
        this.subscription = [stream, pk, function(req, data) {
            self.onmessage(req, data);
        }];
        this.connection.subscribe(this.subscription[0], this.subscription[1],
                                  this.subscription[2]);
    }

    /// Unsubscribe from stream
    unsubscribe() {
        this.connection.unsubscribe(this.subscription[0], this.subscription[1],
                                    this.subscription[2]);
        this.subscription = null;
    }


    /// Extract item from DOM element
    extract(elm) {
        var pk = elm && elm.dataset && elm.dataset.pk;
        console.log('pk:', pk);
        if(!pk)
            return;

        var item = { html: elm.innerHTML, pk: pk };
        this.add_item(item);
        return item;
    }

    /// Sort items array
    sort() {
        this.items.sort(function(a,b) {
            return a.mod_date < b.mod_date;
        });
    }

    /// Return item's index in collection
    index_of(item) {
        return this.items.findIndex(function(a) {
            return a.pk == item.pk;
        });
    }

    /// Add a given item in the collection
    add_item(item) {
        this.items.push(item);
        this.sort();
    }

    /// Update an item in collection.
    update_item(item) {
        var index = this.index_of(item);
        if(index == -1)
            return this.add_item(item);

        this.items.splice(index, 1, item);
        this.sort();
    }

    /// Delete an item from collection
    delete_item(item) {
        var index = this.index_of(item);
        if(index != -1)
            this.items.splice(index, 1);
    }

    /// Handle a pubsub message and update collection accordingly
    onmessage(req, d) {
        console.log('message!', d);
        var item = d.data;
        switch(d.action) {
            case 'create': this.add_item(item);
                           break;
            case 'update': this.update_item(item);
                           break;
            case 'delete': this.delete_item(item);
                           break;
            // ignore:
            default:
                break;
        }
    }
}


