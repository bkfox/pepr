/**
 * This class is used by Connection in order to keep track of sent
 * requests awaiting one or more responses.
 *
 * @fires Request#message
 * @fires Request#close
 */
class Request extends Emitter {
    constructor(connection, path, payload, keepAlive=false,
                reportError=false)
    {
        super();
        /**
         *  @type {Connection}
         */
        this.connection = connection;
        /**
         *  @type {Number}
         */
        this.id = connection.acquireId();

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
         *  @type {Date}
         */
        this.airTime = null;
        /**
         *  @type {bool}
         */
        this.keepAlive = keepAlive;

        /**
         *  @type {bool}
         */
        this.reportError = reportError;
    }

    /**
     * Serialize request into sendable object
     */
    serialize() {
        var obj = Object.assign({}, this.payload);
        obj.path = this.path;
        obj.request_id = this.id;
        return JSON.stringify(obj);
    }

    /**
     *  Create and return a new request with information from this
     *  instance.
     */
    create(payload, keepAlive=undefined) {
        return new Request(
            this.connection, this.path, payload,
            keepAlive === undefined ? this.keepAlive : keepAlive
        );
    }

    /**
     * Send or resend request
     */
    send() {
        this.connection.sendRequest(this);
    }

    /**
     * Close request and remove it from connection.
     */
    close() {
        this.connection.remove(this);
    }

    /**
     * Called when a got a message back for this request. By default
     * fires the 'message' event.
     */
    onmessage(event) {
        /**
         *  A WebSocket MessageEvent has been received as response for this
         *  request from the connection.
         *  @event Request#message
         */
        console.log('request msg', event, this.reportError)
        if(this.reportError &&
               (event.message.status < 200 || event.message.status >= 400))
            $pepr.alerts.add('danger',event.message.data.detail)
        this.emit('message', event);
    }

    /// Called when request has been closed/stopped. By default, emit
    /// 'close' event.
    onclose(event) {
        /**
         *  Request is being removed from {@link Connection#requests} and
         *  is closing.
         *  @event Request#close
         */
        this.emit('close', event);
    }
}



