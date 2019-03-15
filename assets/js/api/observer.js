
// TODO: filter & lookup => setter in order to update binding if observing
export default class Observer {
    constructor(connection) {
        this.connection = connection;
        this.path = null;
        this.filter = null;
        this.lookup = null;
        this.observer = null;
    }

    /**
     *  @type {Boolean} isBound true if there is a subscription.
     */
    get isBound() {
        return this.observer != null;
    }

    /**
     * Subscribe to the server for the given resources matching given
     * filter's lookup.
     */
    bind(path, filter, lookup) {
        if(this.isBound)
            this.unbind();

        this.filter = filter;
        this.lookup = lookup;

        var data = {filter: filter, lookup: lookup};
        var { req, is_new } = this.connection.requestOnce(
            path, {method:'POST', data: data}
        );

        req.on('message', this.onNotification, { self: this })

        if(is_new)
            req.on('close', function() {
                if(this.connection.isOpen)
                    this.connection.request(this.path, {method:'DELETE', data: data});
            }, { self: this });

        this.observer = req;
        return req;
    }

    /**
     * Unsubscribe from the server
     */
    unbind() {
        if(!this.isBound)
            return;

        this.observer.off('message', this.onNotification, { self: this })
        this.observer = null;
    }

    /**
     *  Called when a new item has been created on the server.
     */
    onCreate(event, item) {
        return this.onUpdate(event, item)
    }

    /**
     *  Called when an item has been updated on the server.
     */
    onUpdate(event, item) {}

    /**
     *  Called when an item has been deleted from the server.
     */
    onDelete(event, item) {}

    /**
     *  Dispatch pubsub event to the correct callback (used as message
     *  handler for `this.observer` Request).
     */
    onNotification(event) {
        if(!event.requestOk)
            return;

        var message = event.message;
        var item = message.data;
        switch(message.method) {
            case 'POST': this.onCreate(event, item); break;
            case 'PUT': this.onUpdate(event; item); break;
            case 'DELETE': this.onDelete(event, item); break;
            default:
                break;
        }
    }


}


