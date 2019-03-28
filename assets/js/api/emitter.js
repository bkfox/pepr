import _ from 'lodash';

import Event from './event';
import Listener from './listener';


/**
 *  Register listeners and emit events. This class is used since EventTarget
 *  does not really support registered listeners manipulation.
 */
export default class Emitter {
    /**
     * Return listeners for the given event type.
     */
    getListeners(type) {
        return (this.listeners && this.listeners[type]) || undefined;
    }

    /**
     * Clean-up listeners for the given event type: empty listeners
     * container will be removed.
     */
    cleanListeners(type) {
        var listeners = this.getListeners(type);
        if(listeners !== undefined && !listeners)
            delete this.listeners[type];
        return listeners;
    }

    /**
     * Add listener to the emitter if not present (or `force`).
     *
     * Options is an object used to store data and options, where:
     * - `self`: value of `this` on function call;
     * - `once`: execute function only once;
     *
     * @return the Listener.
     */
    on(type, func, options = {}, force = false) {
        if(!this.listeners)
            this.listeners = {};

        var listener = new Listener(func, options);
        var listeners = this.getListeners(type);
        if(listeners && !force &&
            _.findIndex(listeners, listener) != -1)
            return;

        if(listeners === undefined)
            this.listeners[type] = [];
        this.listeners[type].push(listener);
        return listener;
    }

    /**
     * Remove listener from the emitter.
     */
    off(type, listener, options={}) {
        var listeners = this.getListeners(type);
        if(!listeners)
            return;

        options.func = listener;
        var index = _.findIndex(listeners, options)
        if(index != -1)
            listeners.splice(index,1);

        this.cleanListeners(type);
    }

    /**
     * Drop all running listeners.
     * @fires Emitter#drop
     */
    drop(data={}) {
        this.emit('drop', data);
        this.listeners = [];
    }

    /**
     *  Return a promise resolving once for the given event infos.
     *  `reject` will be called when emitter drops.
     */
    promise(type, options={}, force = false) {
        var self = this;
        options.once = true;

        return new Promise(function(resolve, reject) {
            try {
                var f = {};

                // dispatch event through the promise functions
                f.onEvent = function(event) {
                    self.off('drop', f.onDrop, options);
                    return event.failure ? reject(event) : resolve(event);
                };
                // remove dispatcher on drop and call promise's `reject`
                f.onDrop = function(event) {
                    self.off(type, f.onEvent, options);
                    reject(event);
                };

                var o = self.on(type, f.onEvent, options);
                if(o)
                    self.on('drop', f.onDrop, {once: true});
            }
            catch(e) {
                console.error('error', e);
                throw e
            }
        });
    }

    /**
     *  Shorthand over {@link Reqeust#promise}'s `then()`.
     */
    then(type, onResolve, onReject, options={}, force=false) {
        return this.promise(type, options, force)
                   .then(onResolve, onReject || (()=>{}));
    }

    /**
     * Called before an event is emitted in order to prepare it.
     */
    createEvent(type, data) {
        return new Event(this, type, data);
    }

    /**
     *  Handle errors that occured while event was running
     */
    handleEventErrors(event) {
        for(var error of event.errors)
            error.log();
    }

    /**
     * Emit event with the given data. Event will be prepared by
     * {@link Emitter#prepareEvent} before being propagated.
     */
    emit(type, data=null) {
        var listeners = this.getListeners(type);
        if(!listeners)
            return

        var event = this.createEvent(type, data);
        for(var i = 0; i < listeners.length; i++) {
            if(!event.propagate)
                break;

            var listener = listeners[i];
            // not registering `this` as listener.self at init avoids bugs in
            // case of `this.listeners` copy whatever, and also less code update
            // in case of refactoring whatever.
            listener.call(this, event);

            if(listener.once) {
                listeners.splice(i, 1);
                i--;
            }
        }

        this.cleanListeners(type);
        this.handleEventErrors(event);
    }
}


