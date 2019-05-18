import { fetch_api, fetch_json } from './connection';
import Resource from './resource';

/**
 * Actions are functions that can be executed to provide interaction with the
 * API. Request can be handled in order to display result to the user.
 *
 * The behaviour for the Action base class is to fetch data from the server.
 */
export default class Action {
    constructor(app, args={}) {
        this.app = app;
        this.args = args;
    }

    /**
     * Run the action, handle result and return the request.
     *
     * Handler can be a component, in such case this component must provide an
     * `handleRequest` to pass down the request. The component can be referenced
     * using its DOM id.
     *
     * @param {Method|Object|String} handler request handler.
     * @param {Object} args override default actions' arguments
     */
    call(handler=null, args={}) {
        args = Object.assign(this.args, args);
        if(args.ask && !confirm(args.ask))
            return;
        return this.handleRequest(handler, this.run(args), args)
    }

    /**
     * Execute the actual action.
     */
    run({ path, method='GET', data=null, options={}, json=false}) {
        options.method = options.method || method;
        options.body = options.body || data;
        return (json ? fetch_json : fetch_api)(path, options);
    }

    /**
     * Handle the request
     */
    handleRequest(handler, req, args) {
        if(typeof handler == 'function')
            return handler(req, args);
        if(typeof handler == 'string')
            handler = this.app.$refs[handler] ||
                      document.getElementById(handler).__vue__;
        return handler ? handler.handleRequest(req, args) : req;
    }
}


/**
 * Send a request over WebSockets using by default application's `Connection`.
 */
export class RequestAction extends Action {
    run({ path, data=null, payload={}, connection=null }) {
        payload.method = payload.method || 'GET';
        payload.data = data === null ? payload.data : data;

        connection = connection || this.app.connection;
        // TODO: request must resolve to same kind of values than fetch_api
        return connection.request(path, payload, handler);
    }
}

/**
 * Call `resource.api()`
 */
export class ResourceAction extends Action {
    run({item, path='', options={}}) {
        return item.api(path, options);
    }
}

/**
 * Save a resource
 */
export class SaveAction extends Action {
    run({item=null, path=null, data={}}) {
        return item ? item.save(data) : Resource.create(path, data);
    }
}

/**
 * Delete a resource
 */
export class DeleteAction extends Action {
    run({item}) {
        return item.delete();
    }
}


