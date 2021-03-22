import { createApp } from 'vue'
import { App, loadConfig, loadStore, ormPlugin } from 'pepr/core'
import { components as coreComponents, models as coreModels } from 'pepr/core'
import components from './components'
import models from './models'


const config = {
    extends: App,
    components: {...components, ...coreComponents},
}

var app = null;

loadConfig('#app-config').then(props => {
    let store = props.store
    delete props.store

    app = createApp(config, props)
    app.use(ormPlugin, {baseURL: '/api', models: {...models, ...coreModels}})
    let vm = app.mount("#app");
    store && loadStore(vm.$store, store)
})

export default app;

