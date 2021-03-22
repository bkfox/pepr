import { createApp, ref, reactive } from 'vue'
import { createStore } from 'vuex'
import axios from 'axios'
import VuexORM from '@vuex-orm/core'
import VuexORMAxios from '@vuex-orm/plugin-axios'

import components from './components'
import {loadStore, Context} from './models'


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
        baseUrl: String,
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


/**
 * Load application config from json script element (using querySelector).
 * Return a promise resolving to the config object.
 *
 * If `async` is true, resolve on document `load` event.
 */
export function loadConfig(el, {async=true}={}) {
    return new Promise((resolve, reject) => {
        let func = () => {
            try {
                let elm = document.querySelector(el)
                if(elm.text) {
                    const data = JSON.parse(elm.text)
                    if(data)
                        resolve(data)
                }
                reject(null)
            } catch(error) {
                reject(error)
            }
        }
        async ? window.addEventListener('load', func, { once: true }) : func()
    })
}


/// Mount Vue application (if async, mount when document is loaded).
/// Returns a Promise resolving to vm.
export function mount(app, el, {async=true,content=null,title=null}={}) {
    return new Promise((resolve, reject) => {
        let func = () => {
            try {
                let elm = document.querySelector(el)
                if(!elm)
                    return reject(`Error: can't get element ${el}`)

                // update content
                if(content)
                    elm.innerHTML = content

                // update title
                if(title)
                    document.title = title

                window.scroll(0, 0)

                let vm = app.mount(el)
                resolve(vm)
            } catch(error) {
                reject(error)
            }
        }
        async ? window.addEventListener('load', func, { once: true }) : func()
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


