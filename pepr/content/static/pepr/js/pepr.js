

class Emitter {
    /// Add listener to the emitter
    on(type, listener, force = false) {
        if(!this.listeners)
            this.listeners = {};

        if(!(type in this.listeners)) {
            this.listeners[type] = [listener];
            return;
        }

        var listeners = this.listeners[type];
        if(force || listeners.indexOf(listener) == -1)
            this.listeners[type].append(listener);
    }

    /// Remove listener from the emitter
    off(type, listener) {
        if(!(type in this.listeners))
            return;

        var listeners = this.listeners[type];
        var index = listeners.indexOf(listener);
        listeners.splice(index,1);

        if(!listeners)
            delete this.listeners[type];
        if(!this.listeners)
            delete this.listeners;
    }

    /// Return number of listeners for this event
    listeners_count(type) {
        if(!this.listeners || !(type in this.listeners))
            return 0;
        return this.listeners[type].length;
    }

    /// Emit event with the given data
    emit(type, data) {
        if(!this.listeners || !(type in this.listeners))
            return;

        var listeners = this.listeners[type];
        for(var i in listeners)
            listeners[i](this, data);
    }
}


/// A Request sent over WebSocket. It can be kept alive in order to
/// receive more than one message before closing, and it emits
/// different events in order to allow users to add handlers (such as
/// in Pubsub)
class Request extends Emitter {
    constructor(stream, payload, keep_alive = false) {
        super();
        this.stanza = {
            'stream': stream,
            'payload': payload,
        };
        this.stream = stream;
        this.payload = payload;
        this.air_time = null;
        this.keep_alive = keep_alive;
    }

    get id() { return this.payload.request_id; }
    set id(value) { this.payload.request_id = value; }
    get action() { return this.stanza.action; }

    /// Return request as a sendable stanza
    serialize() {
        return JSON.stringify({
            'stream': this.stream,
            'payload': this.payload,
        });
    }

    /// Return a new request object that use this request infos.
    reply(payload) {
        payload.request_id = this.id;
        return new Request(this.stream, payload);
    }

    /// Called when a got a message back for this request. By default
    /// dispatch it to onsuccess/onerror
    onmessage(connection, data) {
        data._connection = connection;
        data._success = (data.response_status == 200);
        this.emit('message', data)
    }

    /// Called when request has been closed/stopped.
    onclose(connection) {
        this.emit('close', { _connection: connection });
    }
}


class Connection {
    constructor(url, timeout = null, autoreconnect = 0) {
        this._last_id = 0;
        this.autoreconnect = autoreconnect;
        this.requests = {};

        if(timeout)
            this.start_timeout(timeout);
        this.connect(url);
    }


    get is_open() {
        return this.ws !== undefined ||
               this.ws && this.ws.readyState == WebSocket.OPEN;
    }
    get timeout() { return this._timeout && this._timeout[0]; }


    /// Get a unique id
    acquire_id() {
        return this._last_id++;
    }


    /// Start request timeout handler
    start_timeout(timeout) {
        // timeout is internally stored as a tuple of (timeout, request_id),
        // where request_id is the current one at the call of start_timeout.
        // this allows to keep track over multiple call of start_timeout
        var timeout_id = this.acquire_id();
        this._timeout = [timeout, timeout_id];
        this.ontimeout(this._timeout);
    }

    /// Stop request timeout handler
    stop_timeout() {
        this.timeout = null;
    }

    ontimeout(timeout) {
        if(this._timeout != timeout)
            // another timeout handler is running, so just leave
            return;

        if(this.is_open)
            this.remove_old(timeout[0]);

        var self = this;
        window.setTimeout(function(e) { self.ontimeout(timeout); }, timeout[0]);
    }


    /// Open connection
    connect(url, force = false) {
        if(!force && this.is_open)
            return;

        var self = this;
        var ws = new WebSocket(url);
        ws.onopen = function(e) { return self.onopen(e); };
        ws.onclose = function(e) { return self.onclose(e); };
        ws.onerror = function(e) { return self.onerror(e); };
        ws.onmessage = function(e) { return self.onmessage(e); };
        this.ws = ws;
    }

    onopen(event) {
        if(this.autoreconnect)
            // send previously sent awaiting requests again: it avoids
            // to loose handlers on requests.
            for(var i in this.requests)
                this.send_request(this.requests[i]);
    }

    onerror(event) {}

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
    }

    onmessage(event) {
        var data = JSON.parse(event.data);
        var request_id = data.payload.request_id;
        if(!(request_id in this.requests))
            return;

        var request = this.requests[request_id];
        request.onmessage(this, data.payload);
        if(!request.keep_alive)
            this.remove(request);
    }

    /// Send a Request
    send_request(req) {
        req.air_time = Date.now();
        this.requests[req.id] = req;
        this.ws.send(req.serialize());
    }

    /// Create a request, send and return it.
    send(stream, payload, keep_alive = false) {
        payload.request_id = this.acquire_id();
        var req = new Request(stream, payload, keep_alive);
        this.send_request(req);
        return req;
    }

    /// Find request
    find(stream, payload, keep_alive) {
        return Object.values(this.requests).find(function(req) {
            return req.stream == stream && req.payload == payload &&
                   req.keep_alive == keep_alive;
        });
    }

    /// Find a request; if not present, send a new request before
    /// returning it.
    find_or_send(stream, payload, keep_alive = false) {
        return this.find(stream, payload, keep_alive) ||
               this.send(stream, payload, keep_alive);
    }

    /// Cleanup running requests
    reset(trigger = true) {
        for(var id in this.requests)
            this.remove(this.requests[id], trigger)
    }

    /// Remove a request from the running requests
    remove(request, trigger = true) {
        if(trigger)
            request.onclose(this);
        delete this.requests[request.id];
    }

    /// Remove all request older than given timeout (in milliseconds).
    remove_old(delta) {
        var min = Date.now() - delta;
        for(var id in this.requests) {
            var req = this.requests[id];
            if(!req.keep_alive && req.air_time < min)
                this.remove(req);
        }
    }


    /// Subscribe to given object on stream, and add listener to it.
    subscribe(stream, pk, listener) {
        var req = this.find_or_send(stream, { action: 'subscribe', pk: pk },
                                    true);
        req.on('message', listener);
        return req;
    }

    /// Unsubscribe given listener from object on stream
    unsubscribe(stream, pk, listener) {
        var req = this.find(stream, { action: 'subscribe', pk: pk }, true);
        req.off('message', listener);

        if(req.listeners_count('message'))
            return;

        // no more listeners: close & unsubscribe
        this.remove(req);
        this.send(stream, { action: 'unsubscribe', pk: pk });
    }
}


/// Collection built around a pubsub
class Collection {
    constructor(items = null) {
        this.subscription = null;
        this.items = items || {};
    }

    subscribe(stream, pk) {
        if(this.subscription)
            throw "Yet subscribed";

        var self = this;
        this.subscription = [stream, pk, function(req, data) {
            self.onmessage(req, data);
        }];
        this.connection.subscribe(this.subscription[0], this.subscription[1],
                                  this.subscription[2]);
    }

    unsubscribe(stream, pk) {
        this.connection.unsubscribe(this.subscription[0], this.subscription[1],
                                    this.subscription[2]);
    }

    /// Return true if item should be kept in collection
    /// (used in pubsub events from the server)
    keep_item(item, deleled = false) {
        return !deleted;
    }

    /// Handle a pubsub message and update collection accordingly
    onmessage(req, d) {
        item = d.data;
        switch(d.action) {
            case 'create':
                if(this.keep_item(item))
                    this.items.append(d.data);
                break;
            case 'update':
                if(this.keep_item(item))
                    this.items[item.pk] = item;
                else
                    delete this.items[item.pk];
                break;
            case 'delete':
                if(!this.keep_item(item, true))
                    delete this.items[item.id];
                break;
        }
    }
}


con = new Connection("ws://127.0.0.1:8000", null, 5000);
con.onopen = function(e) {
    var pk = 'a140c301-3616-4c13-9902-82d2f57eb2ba';
    var req = con.subscribe('pepr_container', pk, function(req, data) {
        console.log('pubsub: ', data);
    });
}




