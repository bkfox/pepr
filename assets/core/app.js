import { createApp, reactive } from 'vue'
import { createStore } from 'vuex'
import axios from 'axios'
import VuexORM from '@vuex-orm/core'
import VuexORMAxios from '@vuex-orm/plugin-axios'

import { Context } from './models'


/// Mixin for applications components
export const appMixin = {
    data() {
        return {
            // Consts
            consts: {},
            // API root url
            apiRoot: null,
            // Current context id
            contextId: null,
        }
    },

    provide() {
        return {
            // FIXME: not reactive
            apiRoot: this.apiRoot,
            consts: this.consts,
            context: this.context,
        }
    },

    props: {
        /// loadData from JSON <scripts> data once `mounted()`
        /// For more information, see ``loadData()``.
        appData: String,
        /// Context model's entity
        contextModel: {type: Function, default: Context},
        /// User's identity's pk if any
        identity: String,
        /// Initial context id if any
        initContextId: String,
    },

    computed: {
        /// Current Context
        context() {
            return this.contextId && this.contextModel.query().find(this.contextId)
        },

        /// User's subscription
        subscription() {
            return this.identity &&
                this.$root.Subscription.query().where('owner_id', this.identity)
                    .first()
        }
    },

    methods: {
        /// Load data from elements matching provided selector under
        /// application's DOM node.
        loadAppData(selector) {
            for(const el of document.querySelectorAll(selector)) {
                if(el.text)
                    try {
                        const data = JSON.parse(el.text)
                        if(data)
                            this.loadData(data)
                    }
                    catch(e) { console.error(e); }
            }
        },

        /// Load data into application.
        ///
        /// Data is an object with:
        /// - 'models': list of models' data, by model entity;
        /// - 'consts': application consts
        loadData(data) {
            if(data.store)
                for(let entity in data.store) {
                    let model = this.$store.$db().model(entity)
                    model ? model.insertOrUpdate({ data: data.store[entity] })
                          : console.warn(`model ${entity} is not a registered model`)
                }

            if(data.api_root)
                this.apiRoot = data.api_root
            if(data.consts)
                Object.assign(this.consts, data.consts)
            if(data.context)
                this.contextId = data.context
        },
    },

    mounted() {
        if(this.appData)
            this.loadAppData(this.appData)
    },
}

export const defaultConfig = {
    el: '#app',
    delimiters: ['[[', ']]'],
    ...appMixin
}


//! Application class used in Pepr.
//!
//! Provides:
//! - Vue application config and load with promises
//! - Add components
//! - Load remote page and reload application, handling history
//! - Vuex store and Vuex-ORM models
//
export default class App {
    constructor(config={}, {components={},models={},storeConfig=null,uses=[]}={} ) {
        this.title = null
        this.app = null

        this.config = config
        this.components = components
        this.models = models
        this.storeConfig = storeConfig
        this.uses = uses
    }

    get defaultConfig() {
        return defaultConfig
    }

    get config() {
        return this._config
    }

    set config(config) {
        let defaultConfig = this.defaultConfig
        for(var k of new Set([...Object.keys(config || {}), ...Object.keys(defaultConfig)])) {
            if(config[k] === undefined && defaultConfig[k])
                config[k] = defaultConfig[k]
            else if(Array.isArray(config[k]))
                config[k] = [...defaultConfig[k], ...config[k]]
            else if(config[k] instanceof Object)
                config[k] = {...defaultConfig[k], ...config[k]}
        }

        var self = this
        config['computed'] = {
            app() { return self },
            ...config['computed'],
        }
        this._config = config
    }

    /// Destroy application
    destroy() {
        // TODO/FIXME: adapt to Vue3 new app/vm lifecycle
        this.app && this.app.unmount()
        this.vm = null
    }

    mount() {
        el = el || this.config.el
        this.vm = el
    }

    /// Load Vue application, updating page title and content.
    /// Return promise resolving to Vue's vm.
    load({async=false,content=null,title=null,el='',mount=true,props={}}={}) {
        return new Promise((resolve, reject) => {
            let func = () => {
                try {
                    const config = this.config
                    if(mount || content) {
                        el = el || config.el
                        let elm = document.querySelector(el)
                        if(!elm)
                            return reject(`Error: can't get element ${el}`)

                        // update content
                        if(content)
                            elm.innerHTML = content
                    }

                    // update title
                    if(title)
                        document.title = title

                    window.scroll(0, 0)

                    let app = this.app = this.createApp(config, props)
                    if(mount) {
                        let vm = app.mount(el)
                        resolve([app, vm])
                    }
                    else
                        resolve(app)
                } catch(error) {
                    console.error(error)
                    reject(error)
                }}
            async ? window.addEventListener('load', func) : func()
        })
    }

    /// Create application using provided config
    createApp(config, props) {
        let store = this._createStore(config, this.storeConfig)
        let app = createApp(config, props)

        // store
        store && app.use(store)
        // use
        for(let use of this.uses)
            app.use(use[0], use[1])
        // components
        this.components && this._addComponents(app, this.components)
        return app
    }

    /// Return Vuex Store config if required (when store config is provided).
    ///
    /// `app_config.computed` will be updated with property to access each model
    /// of the store (by class name).
    _createStore(appConfig, storeConfig) {
        storeConfig = { plugins: [], ...storeConfig }
        if(this.models) {
            // use VuexOrm and VuexORMAxios: add database to store
            VuexORM.use(VuexORMAxios, { axios })

            const database = new VuexORM.Database()
            const computed = { ...appConfig.computed }
            for(let modelName in this.models) {
                var model = this.models[modelName]
                database.register(model)
                if(!computed[model.name])
                    computed[model.name] = function() {
                        return this.$store.$db().model(model.entity)
                    }
            }
            appConfig.computed = computed
            storeConfig.plugins = [ ...storeConfig.plugins, VuexORM.install(database) ]
        }
        return storeConfig && createStore(storeConfig) || null
    }

    /// Add default components and provided ones (if any) to app.
    _addComponents(app, components={}) {
        for(var key in components)
            app.component(key, components[key])
    }

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
}


