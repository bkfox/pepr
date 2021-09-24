import './styles.scss';
import '@mdi/font/fonts/materialdesignicons-webfont.ttf';

import Action from './action'
import App, {createApp, getScriptData} from './app'
import * as components from './components'
import models, {importDatabase} from './models'
import { modelsPlugin } from './plugins'
import Role from './role'


export {
    Action, App, createApp, getScriptData, components,
    models, importDatabase, Role, modelsPlugin
}


/**
 *  Add items into `window.pepr[namespace]` object.
 */
export function addGlobals(namespace, globals) {
    if(!window.pepr)
        window.pepr = {}
    window.pepr[namespace] = { ...(window.pepr[namespace] || {}), ...globals }
}

addGlobals('core', {
    createApp(props) {
        return createApp(App, props)
    },
    getScriptData, importDatabase
})


