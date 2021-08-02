import { createApp } from 'vue'
import { App, loadApp, components, models } from './index'


var app = null;
export default app
export var vm = null

loadApp(App, {models}).then((result) => {
    app = result[0];
    vm = result[1]
})


