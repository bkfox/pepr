// TODO:
// - filter & lookup => setter in order to update subscribeing if observing
// - filter: on notification, check against filters (in Resources class)
import Request from './request';


/**
 * Pubsub event types by response method.
 */
export const PUBSUB_EVENT_TYPES = {
    'POST': 'create',
    'PUT': 'update',
    'DELETE': 'delete',
};

/**
 *  Request handling pubsub notifications from the server. Send this request
 *  create a pubsub subscription to the server, drop it will unsubscribe.
 *
 *  Incoming messages are dispatched using different event types:
 *  - 'create': new item has been created on the server
 *  - 'update': existing item has been updated on the server
 *  - 'delete': existing item has been deleted
 *  - 'message': other messages.
 */
export default class Pubsub extends Request {
    constructor(path, data=null, {filter, lookup, ...args}) {
        data = {method: 'POST', data: {}, ...data}
        data.data = {...data.data, filter: filter, lookup: lookup};
        super(path, data, args)
    }

    drop() {
        if(this.connection.get(this.id) == this)
            this.connection.request(path, {method:'DELETE', data: this.data.data});
        super.drop();
    }

    createEvent(type, data=null, options={}) {
        const event = super.createEvent(type, data, options);
        if(event.type == 'message')
            event.type = PUBSUB_EVENT_TYPES[event.data.method] || event.type;
        return event;
    }
}


