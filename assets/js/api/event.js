import _ from 'lodash';


/**
 *  Event passed by an Emitter to a listener.
 */
export default class Event {
    constructor(emitter, type, data, kwargs={}) {
        /**
         *  Emitter object from which event has been `emit`ed.
         *  @type {Emitter}
         */
        this.emitter = emitter;
        /**
         *  Source of the event
         *  @type {Object}
         */
        this.target = emitter;
        /**
         *  Event type
         *  @type {string}
         */
        this.type = type;
        /**
         *  Continue event propagation
         *  @type {Boolean}
         */
        this.propagate = true;
        /**
         *  Errors that occured thorough listeners' calls
         *  @type {EventError[]}
         */
        this.errors = [];
        /**
         *  Arbitrary data passed along with the event.
         *  @type {Object}
         */
        this.data = data;

        /**
         *  Event indicates a failure.
         *  @type {Boolean}
         */
        this.failure = true;

        _.assign(this, kwargs);
    }

    /**
     *  Stop event propagation.
     */
    stopPropagation() {
        this.propagate = false;
    }

    /**
     *  @return true if this event is caused by Emitter's `drop()`
     */
    isDropEvent() {
        return this.type == 'drop'
    }

    /**
     * Create a new error related to this event, and return it. Event will be
     * added to the event's list of errors.
     */
    error(...initArgs) {
        var error = new Error(...initArgs);
        this.errors.push(error);
        return error;
    }
}

