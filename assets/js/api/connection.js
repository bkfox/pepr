// TODO: handle disconnect event from the webbrowser/computer and better
//       heuristic for reconnect
import _ from 'lodash';
import Cookies from 'js-cookie';

import Pubsub from './pubsub';
import Request from './request';
import Requests from './requests';


/**
 * Call `fetch` with various initialization in order to ease our lifes.
 * Return a promise resolving or rejecting wether request is a success or not.
 *
 * @param {String} url: url passed to `fetch()`
 * @param {Object} options: options passed to `fetch()`
 *
 * Options extra arguments:
 * - query: extra URLSearchParams
 *
 */
export function fetch_api(url, options={}) {
    if(options.query) {
        var query = new URLSearchParams(options.query);
        url += '?' + query.toString();
    }

    const headers = options.headers || {};
    if(headers['X-CSRFToken'] === undefined)
        headers['X-CSRFToken'] = Cookies.get('csrftoken')
    if(headers['Accept'] === undefined)
        headers['Accept'] = 'application/json'
    options.headers = headers;

    return fetch(url, options).then(
        (response) => response.status < 400 ? response : Promise.reject(response)
    )
}

/**
 *  Call `fetch` for sending JSON data.
 *
 *  Option values:
 *  - ``body``: will be stringified if it is not a string
 */
export function fetch_json(url, options, json=true) {
    options.headers = options.headers || {};
    options.headers['Content-Type'] = 'application/json';
    // TODO: support for sending files => binary, blobs etc.
    //       in a different function? => might be a problem for actions
    //       or we have to create different actions.
    if(options.body && typeof options.body != 'string')
        options.body = JSON.stringify(options.body)

    const p = fetch_api(url, options);
    return json ? p.then(response => response.json(),
                         response => Promise.reject(response.json()))
                : p;
}


/**
 * Manage websocket connection to the server and request multiplexing. It
 * provides multiple features, such as reconnecting (and re-requesting),
 * request timeout management.
 *
 *  Events
 *  ------
 *  - open: connection has been opened
 *  - error: an error occured
 *  - close: connection has been closed
 *  - message: a message was received and was not passed to a request
 **/
export default class Connection extends Requests {
    /**
     * Creates a new Connection.
     */
    constructor({reconnect=null, url=null, ...options})
    {
        super(options);

        this.url = url;
        this.reconnect = reconnect;
    }

    drop(data={}) {
        for(var i in this.requests)
            this.requests[i].drop(data);
        this.requests = {};
    }

    /**
     * Is connection open
     */
    get isOpen() {
        return this.ws && this.ws.readyState == WebSocket.OPEN;
    }

    /**
     * Open connection to server if not yet connected.
     * @param {String} url websocket connection's url;
     * @param {Boolean} force close previous connection if opened;
     */
    connect(url = null, force = false) {
        if(this.ws && this.ws.readyState != WebSocket.CLOSED) {
            if(force)
                this.ws.close();
            else
                return;
        }

        this.url = url || this.url;

        var self = this;
        var ws = new WebSocket(this.url);
        ws.onopen = ev => self.onOpen(ev);
        ws.onclose = ev => self.onClose(ev);
        ws.onerror = ev => self.onError(ev);
        ws.onmessage = ev => self.onMessage(ev);
        this.ws = ws;
    }

    /**
     *  Callback for WebSocket's `open` event
     *  @fires Connection#open
     */
    onOpen(event) {
        if(this.reconnect && this.ws.readyState == WebSocket.OPEN)
            // send previously sent awaiting requests again: it avoids
            // to loose handlers on requests.
            for(var i in this.requests)
                this.send(this.requests[i]);
        this.emit('open');
    }

    /**
     *  Callback for Websocket's `error` event.
     *  @fires Connection#error
     */
    onError(event) {
        this.emit('error');
    }

    /**
     * Callback for Websocket's `close` event handling various tasks.
     * @fires Connection#close
     * @fires Connection#drop
     */
    onClose(event) {
        var reconnect = this.reconnect > 0;
        if(reconnect) {
            var self = this;
            var url = this.ws.url;
            window.setTimeout(
                function() { self.connect(url, true); },
                this.reconnect
            )
        }
        else
            this.drop();

        this.emit('close', {'code': event.code, 'reason': event.reason,
                            'reconnect': reconnect });
    }

    /**
     * Callback for Websocket's `message` event, that handle message
     * dispatching to corresponding requests.
     * @fires Connection#message
     */
    onMessage(event) {
        var message = JSON.parse(event.data);
        var requestId = message.request_id;
        var request = this.requests[requestId];
        if(request)
            request.emit('message', message);
        else
            this.emit('message', message);
    }

    /**
     * Send `data` to the server and return it. It can either be a string,
     * an object or request to serialize.
     *
     * When `data` is a `Request` instance, it will return the request to
     * register events to. The request is registered only when a listener is
     * added to the request.
     *
     * @return a request if `data` is a request, else the original data.
     */
    send(data) {
        let req = null;
        if(data instanceof Request) {
            req = this.requests[data.id] || data;
            req.lastTime = Date.now();
            // FIXME: data is not handled if req != data (req exists yet)
            if(!this.isOpen)
                return data;
            data = data.data;
        }

        this.ws.send(typeof data == 'string' ? data : JSON.stringify(data));
        console.debug('conn >>> ', data);
        return req || data;
    }

    /**
     * Create and send a Request, that is returned (if success). Given arguments
     * will be passed as is to the constructor of Request.
     *
     * Options:
     * - classe: request classe class
     * - once: send request only once for `path` and `data`: if already sent, just
     *   return the handling request.
     */
    request(path, data, {classe=Request, once=false, ...args}) {
        const req = new classe(path, data, {...args, connection:this});
        if(once && this.find(path, data))
            return this.requests[req.id];
        return this.send(req);
    }

    /**
     * Create a GET request
     */
    GET(path, data = {}) {
        data.method = 'GET';
        return this.request(path, data);
    }

    /**
     * Create a POST request
     */
    POST(path, data) {
        data.method = 'POST';
        return this.request(path, data);
    }

    /**
     * Create a PATCH request
     */
    PATCH(path, data) {
        data.method = 'PATCH';
        return this.request(path, data);
    }

    /**
     * Create a DELETE request
     */
    DELETE(path, data) {
        data.method = 'DELETE';
        return this.request(path, data);
    }

    /**
     * Pubsub subscribe to the server and return the subscription request.
     */
    subscribe(path, filter, lookup) {
        return this.request(path, null, {filter, lookup, once: true, classe: Pubsub})
    }
}


