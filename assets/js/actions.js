// FIXME: what is the promise result => may be a resource
// TODO: - subscribe, unsubscribe from context
import { fetch_api } from './api/connection';
import Resource from './api/resource';

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
     * Send a request over WebSockets using application's `Connection`.
     * Return the 
     */
    request(app, { path, data=null, payload={}, handler=null }) {
        payload.method = payload.method || 'GET';
        payload.data = data === null ? payload.data : data;

        const req = app.connection.request(path, payload, handler);
        return handle(app, handler, req);
    },

    /**
     * Send an XmlHttpRequest request using `fetch_api`.
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
    'resource:api'(app, {item, path='', options={}, handler=null}) {
        const req = item.api(path, options);
        return handle(app, handler, req);
    },

    /**
     * Save a resource
     */
    'resource:save'(app, {item=null, path=null, data={}, handler=null}) {
        const req = item ? item.save(data) : Resource.create(path, data);
        return handle(app, handler, req);
    },

    /**
     * Delete a resource
     */
    'resource:delete'(app, {item, handler=null}) {
        const req = item.delete();
        return handle(app, handler, req);
    },

    /**
     * Get a resource form from server for the given item.
     */
    // TODO: remove and use api instead
    'resource:form'(app, {item=null, handler=null}) {
        const req = item.get_form();
        return handle(app, handler, req);
    },
}


