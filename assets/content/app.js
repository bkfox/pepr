import * as core from 'pepr/core'
import components from './components'
import models from './models'


export default {
    extends: core.App,
    components: {...components, ...core.components},
}


