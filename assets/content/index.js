import App from 'pepr/core/app'
import * as coreComponents from 'pepr/core/components'
import * as components from './components'
import * as models from './models'


const app = new App({}, {
    models,
    components: { ...coreComponents, ...components },
});
const props = {
    appData: '#app-data',
}

app.load({async:true, props});
export default app;

