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
import actions from './actions';

import '../css/pepr.css';
import '../css/noscript.css';


export var appConf = {
    el: '#app',
    data: {
        connection: undefined,
        user: undefined,
        actions: actions,
    },
    delimiters: ['[[', ']]'],

    created() {
        this.connection = new Connection(conf.connection);
        this.connection.connect();

        this.user = new User(this.connection);
    },

    methods: {
        action(event) {
            console.log('action:', event);
            const action = actions[event.action];
            if(!action)
                throw `action ${event.action} not found`;
            return action(this, event);
        },

        onSubmit(event) {
            var target = event.target;
            var dataset = target.dataset;

            if(!dataset.actionPath)
                return;

            const data = {};
            const formData = new FormData(target);
            formData.forEach(function(v, k) { data[k] = v });

            return this.action({
                action: 'request',
                path: dataset.actionPath,
                data: data,
                payload: { method: dataset.actionMethod ||
                           target.getAttribute('method'), },
                handler: dataset.actionHandler
            })
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

