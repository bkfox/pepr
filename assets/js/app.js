import _ from 'lodash';

import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)

import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';

import Connection from './api/connection';
import User from './pepr/user';
import conf from './conf';

import '../css/pepr.css';
import '../css/noscript.css';


export var appConf = {
    el: '#app',
    data: {
        connection: undefined,
        user: undefined,
    },
    delimiters: ['[[', ']]'],

    created() {
        try {
            this.connection = new Connection(conf.connection);
            this.connection.connect();

            this.user = new User(this.connection);
        }
        catch(e){
            console.error(e);
        }
    },

    methods: {
        /**
         *  Return payload for given submit event.
         */
        _get_submit_payload(event, payload) {
            var dataset = event.target.dataset;

            payload = payload || {};
            payload.method = payload.method || dataset.actionMethod || 'GET';
            payload.data = payload.data || {};

            var path = dataset.actionUrl;

            // lookup
            if(dataset.actionLookup) {
                var lookup = encodeURIComponent(dataset.actionLookup) + '=' +
                             encodeURIComponent(event.target.value);
                path = path + (path.indexOf('?') != 1 ? '?' : '&') + lookup;
            }
            return payload;
        },

        /**
         * Send a request using given target of event to get path and
         * construct payload, and return the request.
         *
         * Target of an object can have the following attributes:
         * - data-action-url: request path
         * - data-action-method: method used to send request
         * - data-action-lookup: request `GET` parameter to assign to
         *      event target's `value` (e.g. of a submit button).
         */
        submit(event, payload) {
            event.preventDefault();
            event.stopPropagation()

            var dataset = event.target.dataset;
            var req = this.connection.request(
                dataset.actionUrl,
                this._get_submit_payload(event, payload),
                false, true
            );

            var container = event.target.closest('.remote');
            var container = container && container.__vue__;

            // `action_target` => get from dataset's action target. By default,
            // use container (if it is remote)
            var target = dataset.actionTarget
            var target = (target && this.$refs[taret]) || container;
            if(target)
                target.show(true)

            if(target || container)
                req.then(function(message) {
                    if(target && message.content) {
                        // TODO: handle load conflict
                        target.html = message.content.replace('&#39;', "'");
                        target.show && target.show();
                    }
                    else if(container)
                        container.hide()
                });
            return req;
        },

        /**
         *  Send form over API using `connection.submit`.
         */
        submit_form(event) {
            var target = event.target;
            var dataset = target.dataset;

            if(!dataset.actionUrl)
                return;

            var payload = {
                method: dataset.actionMethod ||
                        target.getAttribute('method'),
                data: {}
            };
            var f_data = new FormData(target);
            f_data.forEach(function(v, k) { payload.data[k] = v; });

            var req = this.submit(event, payload);
            req.on('success', function(event) { target.reset() });
            return req;
        },

        load_modal(event) {
            var modal = this.$refs.modal;
            modal.load(event);
        }
    },
}


//
// Application initialization
//
var app = null;

window.addEventListener('load', function() {
    app = new Vue(appConf);
}, true);


export default app;

