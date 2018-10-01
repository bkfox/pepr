
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


