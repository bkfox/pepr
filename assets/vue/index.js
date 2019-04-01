import Vue from 'vue';

import Action from './action.vue';
import Alerts from './alerts.vue';
import Content from './content.vue';
import ListItem from './listItem.vue';
import List from './list.vue';
import Modal from './modal.vue';

Vue.component('p-action', Action);
Vue.component('p-alerts', Alerts);
Vue.component('p-content', Content);
Vue.component('p-list-item', ListItem);
Vue.component('p-list', List);
Vue.component('p-modal', Modal);

// TODO: ensure export components instead
export {Action, Alerts, Content, ListItem, List, Modal};


