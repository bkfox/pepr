// TODO: handle disconnect event from the webbrowser/computer and better
//       heuristic for reconnect
import _ from 'lodash';
import Request from './request';
import Requests from './requests';

/// This class manages requests and a connection to the server. It can
/// auto-reconnect, and also remove old hanging requests.
///
/// Events
/// ------
/// - open: connection has been opened
/// - error: an error occured
/// - close: connection has been closed
/// - message: a message was received and was not passed to a request
///
export default class Connection extends Requests {
    /**
     * Creates a new Connection.
     */
    constructor(kwargs={})
    {
        var { reconnect=false, url=null, requestTimeout=null } = kwargs;
        super(kwargs);

        this.url = url;
        this.reconnect = reconnect;
        this.requestTimeout = requestTimeout;
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
        ws.onopen = function(e) { return self.onOpen(e); };
        ws.onclose = function(e) { return self.onClose(e); };
        ws.onerror = function(e) { return self.onError(e); };
        ws.onmessage = function(e) { return self.onMessage(e); };
        this.ws = ws;
    }

    /**
     *  Callback for WebSocket's `open` event
     */
    onOpen(event) {
        if(this.reconnect)
            // send previously sent awaiting requests again: it avoids
            // to loose handlers on requests.
            for(var i in this.requests)
                this.send(this.requests[i]);
        this.emit('open');
    }

    /**
     *  Callback for Websocket's `error` event.
     */
    onError(event) {
        this.emit('error');
    }

    /**
     *  Callback for Websocket's `close` event, handles clean-up, reconnect,
     *  etc.
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
            this.reset();

        this.emit('close', {'code': event.code, 'reason': event.reason,
                            'reconnect': reconnect });
    }

    /**
     * Callback for Websocket's `message` event, that handle message
     * dispatching to corresponding requests.
     */
    onMessage(event) {
        console.debug('conn <<< ', event.data);

        var message = JSON.parse(event.data);
        var requestId = message.request_id;
        var request = this.requests[requestId];
        if(request)
            request.emit('message', message);
        else
            this.emit('message', message);
    }

    /**
     * Send `data` to the server and return it.
     *
     * Passed `Request` instances will be sent when connection is established
     * to the server if it is not yet available.
     *
     * @return `data` when it is sent (or will be). `null` if send fails.
     */
    send(data) {
        var odata = data;
        if(data instanceof Request) {
            this.requests[data.id] = this.requests[data.id] || data;
            this.requests[data.id].lastTime = Date.now();

            if(!this.isOpen)
                return odata;
            data = data.serialize();
        }
        else if(!this.isOpen)
                return null;

        this.ws.send(typeof data == 'string' ? data : JSON.stringify(data));
        console.debug('conn >>> ', data);
        return odata;
    }

    /**
     * Create and send a Request, that is returned (if success). Given arguments
     * will be passed as is to the constructor of Request.
     */
    request(...initArgs) {
        return this.send(new Request(this, ...initArgs));
    }

    /**
     * Send a request only once for the given path and return it. It will
     * only be sent if there is not yet another active request for the
     * same `path` and `payload`.
     *
     * @return [Request, Boolean] the request, and a boolean indicating if it
     *      has been created in this call.
     */
    requestOnce(path, payload, ...initArgs) {
        var req = _.find(this.requests, { path: path, payload: payload });
        if(req)
            return [req, false];
        return [this.request(path, payload, ...initArgs), true]
    }

    /**
     * Create a GET request
     */
    GET(path, payload = {}) {
        payload.method = 'GET';
        return this.request(path, payload);
    }

    /**
     * Create a POST request
     */
    POST(path, payload) {
        payload.method = 'POST';
        return this.request(path, payload);
    }

    /**
     * Create a PATCH request
     */
    PATCH(path, payload) {
        payload.method = 'PATCH';
        return this.request(path, payload);
    }

    /**
     * Create a DELETE request
     */
    DELETE(path, payload) {
        payload.method = 'DELETE';
        return this.request(path, payload);
    }
}


