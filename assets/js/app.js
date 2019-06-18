import _ from 'lodash';

import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import VRuntimeTemplate from "../vue/v-runtime-template";

Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';

import conf from './conf';
import store from './store';

import Action, * as actions from './api/action';
import Connection from './api/connection';
import User from './pepr/user';

import '../css/pepr.css';
import '../css/noscript.css';


var AppComp = Vue.extend({
/*    props: {
        'contextEndpoint': { type: String },
        'contextKey': { type: String },
    },*/ // -> does not work for root app
})


export const appConf = {
    el: '#app',
    // TODO/FIXME: remove?
    delimiters: ['[[', ']]'],
    store,
    data: {
        connection: undefined,
        user: undefined,
        actions: {
            fetch: Action,
            request: actions.RequestAction,
            resource: actions.ResourceAction,
            save: actions.SaveAction,
            destroy: actions.DeleteAction,
        },
    },

    computed: {
    },

    created() {
        this.connection = new Connection({...conf.connection, store: this.$store});
        this.connection.connect();
        this.user = new User(this.connection);
    },

    methods: {
        action(event) {
            let action = this.actions[event.action];
            if(!action)
                throw `action "${event.action}" not found`;
            action = new action(this);
            return action.call(event.handler, event);
        },

        onSubmit(event) {
            var target = event.target;
            var dataset = target.dataset;

            if(!dataset.actionPath)
                return;

            event.preventDefault()
            event.stopPropagation()

            return this.action({
                action: 'fetch',
                path: dataset.actionPath,
                method: dataset.actionMethod || target.getAttribute('method'),
                data: new FormData(target),
                handler: dataset.actionHandler
            })
        },

        load_modal(event) {
            var modal = this.$refs.modal;
            modal.load(event);
        }
    },

    // TODO: add our vue component here instead
    components: {
        VRuntimeTemplate,
    }
}


//
// Application initialization
//
var app = null;

window.addEventListener('load', function() {
    app = new AppComp(appConf);
}, true);


export default app;

