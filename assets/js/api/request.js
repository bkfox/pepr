import {acquireId} from 'pepr/utils/id';
import Emitter from 'pepr/utils/emitter';

/**
 * This class handles a request (to be) sent to the server through the
 * given Connection, in order to keep track of response(s).
 *
 * A Request is considered active while there are listeners. When a request
 * is no more active, it is dropped.
 *
 * @fires Request#message
 */
export default class Request extends Emitter {
    constructor(path, data=null, {connection, classe=Object, ...args})
    {
        data = {request_id: acquireId(),
                path: path,
                ...data};
        super(data, args);

        /**
         * Constructor for `message.data`.
         * @member {class}
         */
        this.classe = classe;
        // FIXME: remove this.connection
        /**
         *  Connection used to send request
         *  @member {Connection}
         */
        this.connection = connection;
        /**
         *  Last time a message has been sent or received.
         *  @member {Date}
         */
        this.lastTime = null;
    }

    /**
     * Request id.
     */
    get id() { return this.data.request_id; }

    /**
     * Path to ressource (equivalent to HTTP's path.
     * @member {String}
     */
    get path() { return this.data.path; }

    /**
     * Return `true` if request is espected to receive more than just one
     * response before it is completed. This depends on listeners.
     */
    get keepAlive() {
        return this.listeners.findIndex(
            item => item.once = false && item.on.message
        ) != -1
    }

    drop() {
        if(this.connection.get(this.id) == this)
            this.connection.remove(this.id, false);
        super.drop();
    }

    /**
     * When a listener is added, ensure the connection handles the request.
     */
    acquire(owner) {
        const req = this.connection.handle(this);
        if(req !== this)
            throw "acquire allowed to requests in `connection.requests` only.";
        return super.acquire(owner);
    }

    /**
     * When a listener is released from owner, ensure this is the original request.
     */
    release(owner) {
        const req = this.connection.get(this.id);
        if(req !== this)
            throw "release allowed to requests in `connection.requests` only.";

        dropped = super.release(owner);
        if(dropped)
            return this;

        // Ensures request is dropped when there are no more message listeners.
        if(!dropped) {
            const index = this.listeners.findIndex(item => item.on.message);
            if(index == -1) {
                this.drop();
                return this;
            }
        }
        return dropped;
    }

    createEvent(type, data, options) {
        const event = super.createEvent(type, data, {
            failure: data.status > 300,
            ...options,
        });

        // TODO: document
        if(type == 'message' && this.classe && data && data.data)
            event.item = new this.classe(data.data);
        return event;
    }
}



