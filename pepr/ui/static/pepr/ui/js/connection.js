// TODO: handle disconnect event from the webbrower/computer and better
//       heuristic for autoreconnect


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
class Connection extends Emitter {
    /**
     * Creates a new Connection.
     * @param {String} url server url to connect to
     * @param {Number} timeout request timeout in milliseconds
     * @param {Number} autoreconnect if > 0, reconnect to server when
     *     connection is closed.
     */
    constructor(url, timeout = null, autoreconnect = 0)
    {
        super();

        this._lastId = 0;
        this.autoreconnect = autoreconnect;
        this.requests = {};

        if(timeout)
            this.startTimeout(timeout);
        this.connect(url);
    }

    /**
     * Is connection open
     */
    get isOpen() {
        return this.ws !== undefined ||
               this.ws && this.ws.readyState == WebSocket.OPEN;
    }

    /**
     * Requests timeout
     */
    get timeout() { return this._timeout && this._timeout[0]; }


    /**
     * Get a unique id
     */
    acquireId() {
        return this._lastId++;
    }

    /**
     * Start request timeout handler
     */
    startTimeout(timeout) {
        // timeout is internally stored as a tuple of (timeout, requestId),
        // where requestId is the current one at the call of startTimeout.
        // this allows to keep track over multiple call of startTimeout
        var timeoutId = this.acquireId();
        this._timeout = [timeout, timeoutId];
        this.ontimeout(this._timeout);
    }

    /**
     * Stop request timeout handler
     */
    stopTimeout() {
        this.timeout = null;
    }

    /**
     *  Callback handling requests timeout
     */
    ontimeout(timeout) {
        if(this._timeout != timeout)
            // another timeout handler is running, so just leave
            return;

        if(this.isOpen)
            this.removeOld(timeout[0]);

        var self = this;
        window.setTimeout(function(e) { self.ontimeout(timeout); }, timeout[0]);
    }

    /**
     * Open connection to server if not yet connected.
     * @param {String} url websocket connection's url;
     * @param {Boolean} force close previous connection if opened;
     */
    connect(url, force = false) {
        if(this.ws && this.ws.readyState != WebSocket.CLOSED) {
            if(force)
                this.ws.close();
            else
                return;
        }

        var self = this;
        var ws = new WebSocket(url);
        ws.onopen = function(e) { return self.onopen(e); };
        ws.onclose = function(e) { return self.onclose(e); };
        ws.onerror = function(e) { return self.onerror(e); };
        ws.onmessage = function(e) { return self.onmessage(e); };
        this.ws = ws;
    }

    /**
     *  Callback for WebSocket's `open` event
     */
    onopen(event) {
        if(this.autoreconnect)
            // send previously sent awaiting requests again: it avoids
            // to loose handlers on requests.
            for(var i in this.requests)
                this.sendRequest(this.requests[i]);
        this.emit('open', {}, event );
    }

    /**
     *  Callback for Websocket's `error` event.
     */
    onerror(event) {
        this.emit('error', {});
    }

    /**
     *  Callback for Websocket's `close` event, handles clean-up, autoreconnect,
     *  etc.
     */
    onclose(event) {
        if(!this.autoreconnect) {
            this.reset();
            return;
        }

        var self = this;
        var url = this.ws.url;
        window.setTimeout(
            function() { self.connect(url, true); },
            this.autoreconnect
        )
        this.emit('close', {'code': event.code, 'reason': event.reason});
    }

    /**
     * Callback for Websocket's `message` event, that handle message
     * dispatching to corresponding requests.
     */
    onmessage(event) {
        console.debug('conn <<< ', event.data);

        event = { message: JSON.parse(event.data), };

        var requestId = event.message.request_id;
        if(requestId in this.requests) {
            var request = this.requests[requestId];
            this.prepareEvent('message', event);
            request.onmessage(event);
            if(!request.keepAlive)
                this.remove(request);
            return;
        }
        this.emit('message', event);
    }


    /**
     * Just send data to socket if opened.
     * Returns 0 if success, -1 if socket was not opened
     */
    sendRaw(data) {
        if(this.ws.readyState != WebSocket.OPEN)
            return -1;

        console.debug('conn >>> ', data);
        this.ws.send(data);
        return 0;
    }

    /**
     * Send a Request and keep it `requests` list.
     */
    sendRequest(req) {
        req.updateTime = Date.now();
        this.requests[req.id] = req;
        this.sendRaw(req.serialize());
    }

    /**
     * Create a request, send and return it.
     */
    send(path, payload, keepAlive = false, reportError=false) {
        var req = new Request(this, path, payload, keepAlive, reportError);
        this.sendRequest(req);
        return req;
    }

    /**
     * Send a request using given target of event to get path and
     * construct payload, and return the request.
     *
     * Target of an object can have the following attributes:
     * - data-action-url: request path
     * - data-action-method: method used to send request
     *
     * If event target is a form, it fills payload's `data` with it. It uses
     * forms `action` and `method` attribute as default values for `data-*`
     * attributes.
     */
    // TODO: specify a target (p-content)
    submit(event, payload) {
        event.preventDefault();
        event.stopPropagation()

        var target = event.target;
        var dataset = target.dataset
        var path = dataset.actionUrl;

        payload = payload || {};
        payload.method = payload.method || dataset.actionMethod || 'GET';
        payload.data = payload.data || {};

        return this.send(path, payload, false, true);
    }

    /**
     * Create a GET request
     */
    GET(path, payload, keepAlive = false) {
        payload.method = 'GET';
        return this.send(path, payload, keepAlive);
    }

    /**
     * Create a POST request
     */
    POST(path, payload, keepAlive = false) {
        payload.method = 'POST';
        return this.send(path, payload, keepAlive);
    }

    /**
     * Create a PATCH request
     */
    PATCH(path, payload, keepAlive = false) {
        payload.method = 'PATCH';
        return this.send(path, payload, keepAlive);
    }

    /**
     * Create a DELETE request
     */
    DELETE(path, payload, keepAlive = false) {
        payload.method = 'DELETE';
        return this.send(path, payload, keepAlive);
    }

    /**
     * Find request with following informations. Match over `payload` or
     * `keepAlive` if they are defined only.
     */
    find(path, payload = undefined, keepAlive = undefined) {
        predicate = { path: path };
        if(payload !== undefined)
            predicate.payload = payload;
        if(keepAlive !== undefined)
            predicate.keepAlive = keepAlive;

        return _.find(this.requests, predicate);
    }

    /**
     * Send a request only once and return it: when a request is not yet
     * present, it creates a new one and send it; otherwise return the
     * existing one.
     *
     * @return [Request, Boolean] the request, and a boolean indicating if it
     *      has been created in this call.
     */
    sendOnce(path, payload, keepAlive = false) {
        var req = _.find(
            this.requests,
            { path: path, payload: payload, keepAlive: keepAlive }
        );
        if(req)
            return [req, false];

        return [this.send(path, payload, keepAlive), true]
    }

    /**
     * Cleanup running requests
     */
    reset(trigger = true) {
        for(var id in this.requests)
            this.remove(this.requests[id], trigger)
    }

    /**
     * Remove a specific request from the running requests.
     */
    remove(request, trigger = true) {
        if(trigger)
            request.onclose({});
        delete this.requests[request.id];
    }

    /**
     * Remove all request older than given timeout (in milliseconds).
     */
    removeOld(delta) {
        var min = Date.now() - delta;
        for(var id in this.requests) {
            var req = this.requests[id];
            if(!req.keepAlive && req.updateTime < min)
                this.remove(req);
        }
    }

    /**
     *  Send a request to observe data using the given `path`. When
     *  request will be closed, a request is made to remove observer
     *  from server.
     */
    observe(path) {
        var req = this.sendOnce(path, {'method': 'POST'}, true);
        if(req[1])
            req[0].on('close', function() {
                if(!this.connection.isOpen)
                    return;
                this.create({'method':'DELETE'}, false).send();
            });
        return req[0];
    }
}


