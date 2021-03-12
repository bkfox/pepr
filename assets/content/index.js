import App from 'pepr/core/app'
import coreComponents from 'pepr/core/components'

import * as models from './models'
import components from './components'


const app = new App({}, {
    models,
    components: { ...coreComponents, ...components },
});
const props = {
    contextModel: models.Container,
}

app.load({async:true, props}).then((vm) => {
    window.contentVm = vm
})
export default app;

