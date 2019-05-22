import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import ApiStore from './api/store';

import Resource from './api/resource';
import {Subscription, Context} from './api/perms';


const store = new Vuex.Store({
    // TODO: release from here?
    modules: {
        resources: ApiStore,
        context: ApiStore,
        subscription: ApiStore,
        content: ApiStore,
    },

    actions: {
        /**
         * Release all acquired items for a given collection
         */
        release({state, dispatch}, collection) {
            for(var name in state)
                try {
                    dispatch(name + '/release', { collection: collection })
                }
                catch(e) {}
        },
    },
});

// TODO move into app and make it configurable
store.commit('context/path', '/api/context/');
store.commit('context/class', Context);
store.commit('subscription/path', '/api/subscription/');
store.commit('subscription/class', Subscription);
store.commit('content/path', '/api/content/')

export default store;


