

class Request {
    constructor(stream, payload) {
        this.stanza = {
            'stream': stream,
            'payload': payload,
        };
        console.log(this.stanza, this.stanza.payload);
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

    /// Called when a got a message back for this request. By default
    /// dispatch it to onsuccess/onerror
    onmessage(socket, data) {
        return data.response_status == 200 ?
            this.onsuccess(socket, data) :
            this.onerror(socket, data)
        ;
    }

    /// Called when request was a success.
    onsuccess(socket, data) {
        console.log('success', socket, data);
    }

    /// Called when request has failed.
    onerror(socket, data) {
        console.log('error', socket, data);
    }

    /// Called when request has been closed/stopped.
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
        this.connect(url);
    }

    get is_open() { return this.ws !== undefined; }
    get timeout() { return this._timeout && this._timeout[0]; }

    acquire_id() {
        return this._request_id++;
    }

    _ontimeout(timeout) {
        if(this.timeout != timeout)
            return;

        if(this.is_open)
            this.timeout(timeout[0]);

        var self = this;
        window.setTimeout(function(e) { self._ontimeout(timeout); }, timeout[0]);
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
        if(!force && this.is_open)
            return;

        var self = this;
        var ws = new WebSocket(url);
        ws.onopen = function(e) { return self._onopen(e); };
        ws.onclose = function(e) { return self._onclose(e); };
        ws.onerror = function(e) { return self._onerror(e); };
        ws.onmessage = function(e) { return self._onmessage(e); };
        this.ws = ws;
    }

    /// close connection
    close() {
        this.ws.close();
    }

    _onopen(event) {
        if(this.onopen !== undefined)
            return this.onopen(event);
    }

    _onclose(event) {
        console.log(event);
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

    _onmessage(event) {
        var data = JSON.parse(event.data);
        var request_id = data.payload.request_id;
        if(request_id in this.requests) {
            var request = this.requests[request_id];
            var r = request.onmessage(this, data.payload);
            if(!r)
                this.remove(request, false);
        }
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
        this.ws.send(JSON.stringify(request.stanza))
    }

    /// Remove a request from the running requests
    remove(request, trigger = true) {
        if(trigger)
            request.onclose(this);
        delete this.requests[request.id];
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


class Collection {
    constructor(connection, stream) {
        this.connection = connection;
        this.stream = stream;
        this.items = [];
        /// subscription request
        this.subscription = null;
    }

    _reset() {
        this.subscription = undefined;
        this.target = undefined;
    }

    subscribe(pk) {
        if(this.subscription)
            return;

        var self = this;
        var req = new Request('pepr_container', {
            action: 'subscribe',
            pk: this.context_id
        });
        req.onsuccess = function(c, d) {
            self.target = pk;
            req.onsuccess = function(c, d) { self.dispatch(c, d); };
            return true;
        };
        req.onerror = function(c, d) { return self._reset(); };

        this.subscription = req;
        this.connection.send(req)
    }

    unsubscribe() {
        if(this.subscription == undefined)
            return

        var req = this.subscription.reply({
            action: 'unsubscribe', pk: this.target
        });
        this.connection.send(req);
        this._reset();
    }

    /// get item index
    _index_of(d) {
        return this.items.findIndex(function(item) {
            return item.pk == d.data.pk ||
                   item.id == d.data.id;
        });
    }

    /// handle a pubsub message
    dispatch(c, d) {
        switch(d.action) {
            case 'create':
                self.items.append(d.data);
                break;
            case 'update':
                this.items[this._index_of(d)] = d.data;
                break;
            case 'delete':
                delete this.items[this._index_of(d)];
                break;
        }
    }

}


con = new Connection("ws://127.0.0.1:8000", autoreconnect = true);
con.onopen = function(e) {
    var req = new Request("pepr_content", { action: "retrieve", pk: "b58ac358-478e-4acf-b53f-239ecddf8785" });
    con.send(req);

    req = new Request('pepr_container', { action: 'subscribe', pk: 'a140c301-3616-4c13-9902-82d2f57eb2ba' });
    req.onmessage = function(c, m) {
        console.log('pubsub', m);
        return true;
    }
    con.send(req);
}




