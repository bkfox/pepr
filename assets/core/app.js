import { createApp as vCreateApp, provide, ref, reactive, toRefs } from 'vue'
import { createStore } from 'vuex'

import * as components from './components'
import * as composables from './composables'
import { importDatabase } from './models'
import { modelsPlugin } from './plugins'


/**
 * Base Pepr's application configuration.
 *
 * Context:
 * - useContext
 *
 * Provide:
 * - baseUrl
 * - roles
 */
export default {
    // Django already uses "{{" and "}}" delimiters for template rendering
    delimiters: ['[[', ']]'],
    components,

    props: {
        ...composables.useContextById.props,
    },

    setup(props) {
        const propsRefs = toRefs(props)
        const contextComp = composables.useContextById(propsRefs.contextId, propsRefs.contextEntity)
        return {...contextComp}
    },
}


/**
 * Create application setting up plugins etc.
 */
export function createApp(app, {baseURL='/api', models=null, storeConfig={}}={}) {
    app = vCreateApp(app)
    if(models !== null)
        app.use(modelsPlugin, {baseURL, models, storeConfig})
    return app
}

/**
 * Load data from JSON <script> element, matching provided querySelector.
 * Return a promise resolving to the config object.
 *
 * If `async` is true, resolve on document `load` event.
 */
export function getScriptData(el) {
    let elm = document.querySelector(el)
    if(elm.text) {
        const data = JSON.parse(elm.text)
        if(data)
            return data
    }
}



/**
    /// Fetch application from server and load.
    /// TODO/FIXME: handling new application config and models etc.
    fetch(url, {el='app', ...options}={}) {
        return fetch(url, options).then(response => response.text())
            .then(content => {
                let doc = new DOMParser().parseFromString(content, 'text/html')
                let app = doc.getElementById('app')
                content = app ? app.innerHTML : content
                return this.load({sync: true, content, title: doc.title, url })
            })
    }

    /// Save application state into browser history
    historySave(url,replace=false) {
        const el = document.querySelector(this.config.el)
        const state = {
            // TODO: el: this.config.el,
            content: el.innerHTML,
            title: document.title,
        }

        if(replace)
            history.replaceState(state, '', url)
        else
            history.pushState(state, '', url)
    }

    /// Load application from browser history's state
    historyLoad(state) {
        return this.load({ content: state.content, title: state.title })
    }
*/


