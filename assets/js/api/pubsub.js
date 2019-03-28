
// TODO: filter & lookup => setter in order to update subscribeing if observing
/**
 *  Handles publish-subscribe to the server. Only one subscription per
 *  class instance is allowed. It uses PubSub API of Pepr and dispatches
 *  notification received by the server to different functions.
 */
export default class Pubsub {
    constructor(connection, path=null, filter=null, lookup=null) {
        /**
         *  Connection used to create the subscription to the
         *  @type {Connection}
         */
        this.connection = connection;
        /**
         *  Path to Pepr's API endpoint for Pubsub (path of actions excluded)
         *  @type {String}
         */
        this.path = path;
        /**
         *  Filter name to use for filtering pubsub notifications (API dependant)
         *  @type {String}
         */
        this.filter = filter;
        /**
         *  Filter value to use for filtering.
         *  @type {String}
         */
        this.lookup = lookup;
        /**
         *  Request used to establish connection to the server and from which
         *  server's notifications are received.
         *  @type {Request}
         */
        this.subscription = null;
    }

    drop() {
        this.unsubscribe();
    }

    /**
     *  Is true if there is a subscription active.
     *  @type {Boolean}
     */
    get isSubscribed() {
        return this.subscription != null;
    }

    /**
     * Subscribe to the server for the given resources matching given
     * filter's lookup.
     */
    subscribe(path=null, filter=null, lookup=null) {
        if(this.isSubscribed)
            this.unsubscribe();

        this.filter = filter || this.filter;
        this.lookup = lookup || this.lookup;
        this.path = path || this.path;

        var data = {filter: this.filter, lookup: this.lookup};
        var [req, is_new] = this.connection.requestOnce(
            this.path + 'subscription/', {method:'POST', data: data}
        );

        req.on('message', this.onNotification, { self: this })

        if(is_new)
            req.on('drop', function() {
                if(this.connection.isOpen)
                    this.connection.request(path, {method:'DELETE', data: data});
            }, { self: this });

        this.subscription = req;
        return req;
    }

    /**
     * Unsubscribe from the server
     */
    unsubscribe() {
        if(!this.isSubscribed)
            return;

        this.subscription.off('message', this.onNotification, { self: this })
        this.subscription = null;
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
     *  handler for `this.subscription` Request).
     */
    onNotification(event) {
        console.log('on noticiation', this, event);
        if(event.failure)
            return;

        var message = event.data;
        //TODO: custom item class
        var item = message.data;
        switch(message.method) {
            case 'POST': this.onCreate(event, item); break;
            case 'PUT': this.onUpdate(event, item); break;
            case 'DELETE': this.onDelete(event, item); break;
            default:
                break;
        }
    }
}


