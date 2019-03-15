// import _ from 'lodash';
import Emitter from './emitter';

/**
 * This class handles a request (to be) sent to the server through the
 * given Connection, in order to keep track of response(s).
 *
 * A Request is considered active while there are listeners. When a request
 * is no more active, it is closed (and removed from Connection).
 *
 * @fires Request#message
 * @fires Request#close
 */
export default class Request extends Emitter {
    constructor(connection, path, payload={}) {
        super();

        /**
         *  @type {Connection}
         */
        this.connection = connection;
        /**
         *  Path to ressource (equivalent to HTTP's path
         *  @type {String}
         */
        this.path = path;
        /**
         *  @type {object}
         */
        this.payload = payload;
        /**
         *  @type {Number}
         */
        this.id = (payload && payload.request_id) || connection.acquireId();
        /**
         *  @type {Date}
         */
        this.lastTime = null;
    }

    /**
     * Return True if request is espected to receive more than just one
     * response before it is completed. This depends on listeners.
     */
    get keepAlive() {
        var listeners = this.getListeners('message');
        return listeners && _.findIndex(listeners, { once: false }) != -1;
    }

    /**
     * Serialize request into sendable object
     */
    serialize() {
        var payload = Object.assign({}, this.payload);
        payload.path = this.path;
        payload.request_id = this.id;
        return payload;
    }

    /**
     * Send or resend this request
     */
    send() {
        this.connection.send(this);
    }

    /**
     * Close request and remove it from connection.
     */
    close(reason = undefined) {
        this.connection.remove(this, reason);
    }

    /**
     *  Return a Promise executed when a message is received, that resolves
     *  or rejects depending on message's status. Promises `value` or `reason`
     *  is the received message.
     *
     *  Note that Promise will work only for one receiving one message.
     */
    promise() {
        var self = this;
        return new Promise(function(resolve, reject) {
            self.on('message', function(event) {
                if(event.message.status < 300)
                    resolve(event.message)
                else
                    reject(event.message)
            }, { once: true });
        });
    }

    /**
     * Shorthand over {@link Request#promise}.
     */
    then(onFullfilled, onRejected = null) {
        return this.promise().then(onFullfilled, onRejected || (()=>{}));
    }

    /**
     *  Ensures request is closed when there is no more message listeners.
     */
    cleanupListeners(...args) {
        var listeners = super.cleanupListeners(...args);
        if(!this.listeners)
            this.close();
    }
}



