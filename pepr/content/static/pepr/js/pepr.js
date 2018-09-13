

class Request {
    constructor(stream, payload) {
        this.stanza = {
            'stream': stream,
            'payload': payload,
        };
        this.air_time = null;
    }

    get id() { return this.stanza.payload.request_id; }
    set id(value) { this.stanza.payload.request_id = value; }
    get stream() { return this.stanza.stream; }

    /// Return a new request object that use this request infos.
    reply(payload) {
        payload.request_id = this.id;
        return new Request(this.stanza.stream, payload);
    }

    on_message(socket, message) {
        return message.response_status == 200 ?
            this.onsuccess(socket, message) :
            this.onerror(socket, message)
        ;
    }

    onsuccess(socket, message) {
        console.log('success', socket, message);
    }

    onerror(socket, message) {
        console.log('error', socket, message);
    }

    onclose(socket) {
        console.log('close', socket);
    }
}


class Connection {
    constructor(url, timeout = null, autoreconnect = false) {
        this._request_id = 0;
        this.autoreconnect = autoreconnect;
        this.requests = {};

        if(timeout)
            this.start_timeout(timeout);
        this.connect(url
    }

    get is_open() { return this.ws !== undefined; }
    get timeout() { return this._timeout && this._timeout[0]; }

    acquire_id() {
        return this._request_id++;
    }

    /// start timeout handler
    start_timeout(timeout) {
        var request_id = this.acquire_id();
        this._timeout = [timeout, request_id];
        this._ontimeout(timeout);
    }

    /// stop timeout
    stop_timeout() {
        this.timeout = null;
    }

    /// open connection
    connect(url, force = false) {
        if(!force && this.is_open())
            return;

        // force id change for timeout control
        this.acquire_id();

        var self = this;
        var ws = WebSocket(url);
        this.ws.onmessage = function(e) { return self._onmessage(e); };
        this.ws.onclose = function(e) { return self._onclose(e); };
        this.ws.onerror = function(e) { return self._onerror(e); };
    }

    /// close connection
    close() {
        this.ws.close();
    }

    _ontimeout(timeout) {
        if(this.timeout != timeout)
            return;

        if(this.is_open)
            this.timeout(timeout[0]);

        var self = this;
        window.setTimeout(function(e) { self._ontimeout(timeout); }, timeout[0]);
    }

    _onmessage(event) {
        var data = JSON.parse(event.data);
        var request_id = data.payload.request_id;

        if(request_id in this.requests) {
            var request = this.requests[request_id];
            var r = request.on_message(data);
            if(!r)
                this.remove(request, false);
        }
    }

    _onclose(event) {
        this.reset();
        if(this.onclose)
            return this.onclose(event);

        if(this.autoreconnect)
            this.connect(this.ws.url, true);
    }

    _onerror(event) {
        if(this.onclose)
            return this.onclose(event);
    }


    /// cleanup running requests
    reset(trigger = true) {
        for(var id in this.requests)
            this.remove(this.requests[id], trigger)
    }

    /// Send a Request
    send(request) {
        if(request.id === undefined)
            request.id = this.acquire_id();

        request.air_time = Date.now();
        this.requests[request.id] = request;
        this.send(JSON.stringify(request.stanza))
    }

    /// Remove a request from the running requests
    remove(request, trigger = true) {
        if(trigger)
            request.onclose(this);
        delete this.requests[request_id];
    }

    /// Remove all request older than given timeout (in milliseconds).
    timeout(delta) {
        var min = Date.now() - delta;
        for(var id in this.requests) {
            var req = this.requests[id];
            if(req.air_time < min)
                this.remove(req);
        }
    }

}


