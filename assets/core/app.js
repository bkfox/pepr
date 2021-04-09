import { createApp, ref, reactive } from 'vue'
import { createStore } from 'vuex'

import * as components from './components'
import { loadStore } from './models'
import { ormPlugin } from './plugins'


/// Base Pepr's Vue applications
const App = {
    delimiters: ['[[', ']]'],
    components,

    provide() {
        return {
            baseURL: this.baseURL,
            roles: this.roles,
            context: this.context,
        }
    },

    props: {
        roles: Object,
        // FIXME: should be updatable -> setup?
        contextId: String,
        baseURL: String,
        /// User's identity's pk if any
        identity: String,
    },

    computed: {
        /// Current Context
        context() {
            let model = this.$store.$db().model('context')
            return this.contextId && model.query().with('subscription').find(this.contextId)
        },

        /// User's subscription
        subscription() {
            return this.identity &&
                this.$root.Subscription.query().where('owner_id', this.identity)
                    .first()
        }
    },
}

export default App;

function inPromise(func, onLoad) {
    return new Promise((resolve, reject) => {
        let wrapper = () => {
            try {
                func(resolve, reject)
            }
            catch(error) {
                reject(error)
            }
        }

        if(onLoad)
            window.addEventListener('load', wrapper, { once: true })
        else
            wrapper()
    })
}

/**
 * Load application config from json script element (using querySelector).
 * Return a promise resolving to the config object.
 *
 * If `async` is true, resolve on document `load` event.
 */
export function loadProps(el, {onLoad=true}={}) {
    return inPromise((resolve, reject) => {
        let elm = document.querySelector(el)
        if(elm.text) {
            const data = JSON.parse(elm.text)
            if(data)
                return resolve(data)
        }
        reject(null)
    }, onLoad)
}


/**
 * Load application config on load 
 */
export function loadApp(app, {el='#app',propsEl='#app-props',props=null,models=null,onLoad=true}={}) {
    function init(props) {
        app = createApp(app, props)
        app.use(ormPlugin, {baseURL: props.baseURL || '/api', models})
        return [app, app.mount(el)]
    }

    if(props !== null)
        return inPromise((resolve, reject) => {
            resolve(init(props))
        }, onLoad)
    else
        return loadProps(propsEl, {onLoad}).then(props => {
            let store = props.store
            delete props.store
            let [app, vm] = init(props);
            store && loadStore(vm.$store, store)
            return [app, vm]
        })
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


