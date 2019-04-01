import _ from 'lodash';
import Emitter from './emitter';

/**
 *  Container class for Request instances. It also includes various 
 *  feature regarding requests, such as timeout.
 */
export default class Requests extends Emitter {
    constructor({requests={}, timer=null, timeout=null}={}) {
        super();

        this.requests = requests;
        this.timer = timer;
        this.timeout = timeout;
        this._lastId = 0;
    }

    drop(reason=null) {
        for(var id in this.requests)
            this.remove(this.requests[id], reason)
    }

    /**
     * Acquire unique request id
     */
    acquireId() {
        return this._lastId++;
    }

    /**
     * Find request with following informations. Match over `payload` if
     * defined.
     */
    find(path, payload = undefined) {
        predicate = { path: path };
        if(payload !== undefined)
            predicate.payload = payload;
        return _.find(this.requests, predicate);
    }

    /**
     * Return true if given request is present in this requests
     */
    has(request) {
        return request.id in this.requests;
    }

    /**
     * Drop a specific request.
     */
    remove(request) {
        request.drop();
    }

    /**
     * Start requests' timeout check.
     */
    startTimeout(timeout=null) {
        if(this.timer)
            this.timer.cancel();

        var self = this;
        this.timeout = timeout || this.timeout;
        this.timer = _.throttle(function() {
            self.applyTimeout(timeout);
            window.setTimeout(() => self.timer && self.timer(), self.timeout);
        }, this.timeout);
    }

    /**
     * Stop timeout check
     */
    stopTimeout() {
        if(this.timer)
            this.timer.cancel();
        this.timer = null
    }

    /**
     * Remove requests that timed-out the given delta. Only request
     * that are not keepAlive are removed.
     */
    applyTimeout(delta) {
        var min = Date.now() - delta;
        for(var id in this.requests) {
            var request = this.requests[id];
            if(!request.keepAlive && request.lastTime <= min)
                this.remove(request, "timeout");
        }
    }
}


