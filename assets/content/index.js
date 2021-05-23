
import { addGlobals, createApp } from 'pepr/core'

import App from './app'
import components from './components'
import models from './models'

export { components, models }


addGlobals('content', {
    createApp(props) {
        props.models = [...models, ...(props.models || [])]
        return createApp(App, props)
    }
})


