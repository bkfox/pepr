import Vue from 'vue';

import Alerts from './alerts.vue';
import Content from './content.vue';
import ListItem from './listItem.vue';
import List from './list.vue';

Vue.component('p-alerts', Alerts);
Vue.component('p-content', Content);
Vue.component('p-list-item', ListItem);
Vue.component('p-list', List);

export {Alerts, Content, ListItem, List};


