import * as core from 'pepr/core'
import components from './components'
import models from './models'


const config = {
    extends: core.App,
    components: {...components, ...core.components},
}

var app = null;
export default app
export var vm = null

core.loadApp(config, {models: {...core.models, ...models}}).then((result) => {
    app = result[0];
    vm = result[1]
})


