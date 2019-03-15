import _ from 'lodash';

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
    cleanupListeners(type) {
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
     * Return the added options object or undefined.
     */
    on(type, listener, options = {}, force = false) {
        if(!this.listeners)
            this.listeners = {};

        options.func = listener;
        var listeners = this.getListeners(type);
        if(listeners && !force &&
            _.findIndex(listeners, options) != -1)
            return;

        if(listeners === undefined)
            this.listeners[type] = [];
        this.listeners[type].push(options);
        return options;
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

        this.cleanupListeners(type);
    }

    /**
     * Called before an event is emitted in order to prepare it.
     */
    beforeEmit(type, event) {
        // TODO: document thoses
        event.type = type;
        event.target = event.target === undefined ? this : event.target;
        event.emitter = this;
        event.propagate = true;
    }

    /**
     * Emit event with the given data. Event will be prepared by
     * {@link Emitter#prepareEvent} before being propagated.
     */
    emit(type, event={}) {
        var listeners = this.getListeners(type);
        if(!listeners)
            return

        this.beforeEmit(type, event);
        for(var i = 0; i < listeners.length; i++) {
            if(!event.propagate)
                break;

            var listener = listeners[i];
            try {
                // not registering `this` as listener.self at init avoids bugs in
                // case of `this.listeners` copy whatever, and also less code update
                // in case of refactoring whatever.
                listener.func.call(listener.self || this, event);
            }
            catch(e) { console.error(e); }

            if(listener.once) {
                listeners.splice(i, 1);
                i--;
            }
        }

        this.cleanupListeners(type);
    }
}


