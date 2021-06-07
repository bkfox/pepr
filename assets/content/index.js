
import { addGlobals, createApp } from 'pepr/core'

import App from './app'
import components from './components'
import models from './models'

export { components, models }


addGlobals('content', {
    createApp(props) {
        props.models = [...Object.values(models), ...(props.models || [])]
        return createApp(App, props)
    }
})


