import _ from 'lodash';
import Emitter from '../utils/emitter';

/**
 *  Container class for Request instances. It also includes various 
 *  feature regarding requests, such as timeout.
 */
export default class Requests extends Emitter {
    constructor({requests={}, timer=null, timeout=null, ...options}={}) {
        super(null, options);

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
     * Return request by id
     */
    get(id) {
        return this.requests[id];
    }

    /**
     * Find request with following informations. Match over `data` if
     * defined.
     */
    find(path, data = undefined) {
        const predicate = { path: path };
        if(data !== undefined)
            predicate.data = data;
        return _.find(this.requests, predicate);
    }

    /**
     * Return true if request of given id is present in this requests
     */
    has(id) {
        return request.id in this.requests;
    }

    /**
     * Ensure a request is handled, and return a Request to listen to.
     * The request's `lastTime` attribute will be update to now.
     */
    handle(request) {
        if(!this.requests[request.id])
            this.requests[request.id] = request
        return this.requests[request.id];
    }

    /**
     * Remove a request for the given id and drop it if required.
     * @return the removed request.
     */
    remove(id, drop=true) {
        if(!this.requests[id])
            return;

        const req = this.requests[id];
        delete this.requests[id];
        drop && req.drop();
        return req;
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


