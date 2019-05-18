import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import ApiStore from './api/store';


export default new Vuex.Store({
    modules: {
        api: ApiStore,
    }
});


