import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import {Content, Context, Subscription} from './models';
import {Database} from './orm';


const database = new Database('/api/');
database.register(Content);
database.register(Context);
database.register(Subscription);

const store = new Vuex.Store(database.store)

export default store;


