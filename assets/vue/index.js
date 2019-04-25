import Vue from 'vue';

import VRuntimeTemplate from 'v-runtime-template';

import Action from './action.vue';
import Alerts from './alerts.vue';
import ListItem from './listItem.vue';
import List from './list.vue';
import Modal from './modal.vue';
import Resource from './resource.vue';
import Table from './table.vue';

Vue.component('v-runtime-template', VRuntimeTemplate);

Vue.component('p-action', Action);
Vue.component('p-alerts', Alerts);
Vue.component('p-list-item', ListItem);
Vue.component('p-list', List);
Vue.component('p-modal', Modal);
Vue.component('p-resource', Resource);
Vue.component('p-table', Table);

export {Action, Alerts, ListItem, List, Modal, Resource, Table};


