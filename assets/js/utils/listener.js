import Drop from './drop';

/**
 *  Listener object executing the provided function when an event
 *  occurs.
 */
export default class Listener extends Drop {
    constructor({on={}, self=null, once=false}={}) {
        super();

        /**
         *  Listener functions to execute by event type.
         *  @type {{eventType: Function(event)}}
         */
        this.on = on;
        /**
         *  `this` object to use to call event handlers. By default, set to
         *  the listener instance.
         *  @type {Object}
         */
        this.self = self;
        /**
         *  Execute this listener only once, whatever the handler.
         *  @type {Boolean}
         */
        this.once = once;
    }

    /**
     *  Call listener with the given event.
     */
    call(event) {
        const func = this.on[event.type];
        try {
            if(func)
                func.call(this.self || this, event);
        }
        catch(error) {
            if(error instanceof Error)
                event.errors.push(error);
            else
                throw error;
        }
        if(func && this.once)
            event.emitter.release(this);
    }
}


