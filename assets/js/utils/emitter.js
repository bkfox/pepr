import _ from 'lodash';

import Event from './event';
import Listener from './listener';

import Shared from './shared';

/**
 * Future version of emitter exploiting Shared functionalities.
 * TODO:
 * - promise & then
 * - on/off are replaced by acquire & release
 * - listener.on => handlers
 * - drop is no more needed due to shared
 */
export default class Emitter extends Shared {
    /**
     * Current emitter listeners (owners).
     */
    get listeners() {
        return this.owners;
    }

    /**
     * Add listener to emitter.
     *
     * @param {Object|Listener} listener - the listener or its init payload.
     */
    acquire(listener) {
        if(!(listener instanceof Listener))
            listener = new Listener(listener)
        return super.acquire(listener);
    }

    /**
     * Emit an event among listeners.
     */
    emit(type, data=null, options={}) {
        if(!this.owners)
            return;

        const event = this.createEvent(type, data, options);
        for(const listener of this.listeners) {
            if(!event.propagate)
                break;
            if(listener)
                listener.call(event);
        }

        this.onEventErrors(event);
    }

    /**
     * Called before an event is emitted in order to prepare it.
     */
    createEvent(type, data=null, options={}) {
        return new Event(this, type, data, options);
    }

    /**
     * Handle errors occuring while event ran.
     */
    onEventErrors(event) {
        for(var error of event.errors)
            console.error(error);
    }

    /**
     * Return a promise resolving once for the given event infos.
     * `reject` will be called when emitter is dropped.
     *
     * Registered listener object is set on `listener` attribute.
     */
    promise(type, options={}, force = false) {
        const listener = new Listener({ ...options, once: true});
        const promise = new Promise(function(resolve, reject) {
            listener.on.drop = event => { reject(event); },
            listener.on[type] = event => {
                event.failure ? reject(event) : resolve(event)
            };
        });
        promise.listener = this.acquire(listener);
        return promise;
    }

    /**
     * Shorthand over {@link Reqeust#promise}'s `then()`.
     *
     * Registered listener object is set on `listener` attribute.
     */
    then(type, onResolve, onReject=null, options={}, force=false) {
        let promise = this.promise(type, option, force);
        let promise_ = promise.then(onResolve, onReject)
        promise_.listener = promise.listener;
        return promise_;
    }

    /**
     * Drop Emitter and emit a "drop" event.
     */
    drop() {
        this.emit('drop');
        super.drop();
    }
}


