
/**
 *  Register listeners and emit events. This class is used since EventTarget
 *  is quiete new.
 */
class Emitter {
    /**
     * Add listener to the emitter. If `self` is given, use it as `this`
     * on listener's call.
     */
    on(type, listener, self=null, force = false) {
        if(!this.listeners)
            this.listeners = {};

        listener = {func: listener, self: self};
        if(!(type in this.listeners)) {
            this.listeners[type] = [listener];
            return;
        }

        var listeners = this.listeners[type];
        if(force || !listeners.some(function(e) { return e == listener; }))
            this.listeners[type].push(listener);
    }

    /**
     * Remove listener from the emitter.
     */
    off(type, listener, self=null) {
        if(!(type in this.listeners))
            return;

        listener = {func: listener, self: self};
        var listeners = this.listeners[type];
        var index = _.findIndex(listener);
        listeners.splice(index,1);

        if(!listeners)
            delete this.listeners[type];
        if(!this.listeners)
            delete this.listeners;
    }

    /**
     * Return number of listeners for this event.
     */
    countListeners(type) {
        if(!this.listeners || !(type in this.listeners))
            return 0;
        return this.listeners[type].length;
    }

    /**
     * Add informations to event before it can be propagated.
     */
    prepareEvent(type, event) {
        // TODO: document thoses
        event.type = type;
        event.target = event.target == undefined ? this : event.target;
        event.currentTarget = this;
        event.propagate = true;
    }

    /**
     * Emit event with the given data. Event will be prepared by
     * {@link Emitter#prepareEvent} before being propagated.
     */
    emit(type, event={}) {
        if(!this.listeners || !(type in this.listeners))
            return;

        this.prepareEvent(type, event);

        var listeners = this.listeners[type];
        for(var listener of listeners) {
            if(!event.propagate)
                break;
            // not registering `this` as listener.self at init avoids bugs in
            // case of `this.listeners` copy whatever, and also less code update
            // in case of refactoring whatever.
            listener.func.call(listener.self || this, event);
        }
    }
}


