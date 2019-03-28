
/**
 *  Listener object executing the provided function when an event
 *  occurs.
 */
export default class Listener {
    constructor(func, kwargs) {
        /**
         *  Listener function to execute
         *  @type {Function(event)}
         */
        this.func = func;
        /**
         *  `this` object to use to call `func`.
         *  @type {Object}
         */
        this.self = kwargs.self;
        /**
         *  Execute this listener only once.
         *  @type {Boolean}
         */
        this.once = false;

        _.assign(this, kwargs);
    }

    /**
     *  Call listener with the given event.
     */
    call(emitter, event) {
        try {
            this.func.call(this.self || emitter, event);
        }
        catch(error) {
            if(error instanceof Error) {
                event.errors.push(error);
                error.log();
            }
            else
                throw error;
        }
    }
}


