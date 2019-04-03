import { fetch_api } from './api/connection';

/**
 * Handle request with handler if given and found.
 * @return the request.
 */
export function handle(app, handler, request) {
    if(typeof handler == 'string')
        handler = app.$refs[handler] || document.getElementById(handler).__vue__;
    if(handler)
        handler.handleRequest(request)
    return request;
}


/**
 * Action that can be handled by the application.
 */
export default {
    /**
     * Send a request. `item` will be set to payload if given.
     */
    request(app, { path, data=null, payload={}, handler=null }) {
        payload.method = payload.method || 'GET';
        payload.data = data === null ? payload.data : data;

        const req = app.connection.request(path, payload, handler);
        return handle(app, handler, req);
    },

    /**
     * Send a request.
     */
    fetch(app, { path, method='GET', data=null, options={}, handler=null}) {
        options.method = options.method || method;
        options.body = options.body || data;
        const req = fetch_api(path, options);
        return handle(app, handler, req);
    },

    /**
     * Call `resource.api()`
     */
    'resource:api'(app, {item, path='', payload={}, handler=null}) {
        const req = item.api(path, payload);
        return handle(app, handler, req);
    },

    /**
     * Save a resource
     */
    'resource:save'(app, {item, data={}, handler=null}) {
        const req = item.save(data);
        return handle(app, handler, req);
    },

    /**
     * Delete a resource
     */
    'resource:delete'(app, {item, handler=null}) {
        const req = item.delete();
        return handle(app, handler, req);
    },
}


