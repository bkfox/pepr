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
 */
export default class Request extends Emitter {
    constructor(connection, path, payload={})
    {
        super();

        // FIXME: remove this.connection
        /**
         *  @member {Connection}
         */
        this.connection = connection;
        /**
         *  Path to ressource (equivalent to HTTP's path
         *  @member {String}
         */
        this.path = path;
        /**
         *  Request payload.
         *  @member {object}
         */
        this.payload = payload;

        /**
         *  Request id
         *  @member {Number}
         */
        this.id = payload.request_id || connection.acquireId();
        /**
         *  Last time a message has been sent or received.
         *  @member {Date}
         */
        this.lastTime = null;
    }

    /**
     * Return `true` if request is espected to receive more than just one
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

    cleanListeners(...args) {
        // Ensures request is dropped when there are no more message listeners.
        // TODO: remove from connection
        var listeners = super.cleanListeners(...args);
        if(!this.listeners || !this.listeners['message'])
            this.drop();
    }

    createEvent(type, data) {
        var event = super.createEvent(type, data);
        event.failure = data.status > 300;
        return event;
    }
}



