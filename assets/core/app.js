import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import VuexORMAxios from '@vuex-orm/plugin-axios'


export const defaultConfig = {
    el: '#app',
    delimiters: ['[[', ']]'],
}


//! Application class for used in Pepr.
//!
//! Provides:
//! - Vue application config and load with promises
//! - Load remote page and reload application, handling history
//! - Vuex store and Vuex-ORM models
//
export default class App {
    constructor(config={}, {storeConfig=null,models={}}={} ) {
        this.title = null;
        this.app = null;

        this.config = config;
        this.storeConfig = storeConfig;
        this.models = models;
    }

    get config() {
        return this._config;
    }

    set config(config) {
        for(var k of new Set([...Object.keys(config || {}), ...Object.keys(defaultConfig)])) {
            if(config[k] === undefined && defaultConfig[k])
                config[k] = defaultConfig[k]
            else if(config[k] instanceof Object)
                config[k] = {...defaultConfig[k], ...config[k]}
        }

        var self = this;
        config['computed'] = {
            app() { return self },
            ...config['computed'],
        }
        this._config = value;
    }

    /// Add Vuex Store to config if required (when store config is null)
    addStore(config) {
        if(this.storeConfig!==null || Object.keys(this.models).length) {
            // ensure Vue uses Vuex
            Vue.use(Vuex);

            let storeConfig = { ...this.storeConfig };
            if(self.models) {
                // use VuexOrm and VuexORMAxios: add database to store
                VuexORM.use(VuexORMAxios, { axios })

                const database = new VuexORM.Database()
                const computed = { ...config.computed }
                for(let modelName in self.models) {
                    var model = self.models[modelName]
                    database.register(model)
                    if(!computed[model.name])
                        computed[model.name] = function() {
                            return this.$store.$db.model(model.entity)
                        }
                }
                config.computed = computed
                storeConfig.plugins = [ ...storeConfig.plugins, VuexORM.install(database) ]
            }
            config.store = VuexStore(storeConfig);
        }
        return config
    }

    /// Destroy application
    destroy() {
        self.app && self.app.$destroy();
        self.app = null;
    }

    /// Fetch application from server and load.
    /// TODO/FIXME: handling new application config and models etc.
    fetch(url, {el='app', ...options}={}) {
        return fetch(url, options).then(response => response.text())
            .then(content => {
                let doc = new DOMParser().parseFromString(content, 'text/html');
                let app = doc.getElementById('app');
                content = app ? app.innerHTML : content;
                return this.load({sync: true, content, title: doc.title, url })
            })
    }

    /// Load Vue application, updating page title and content.
    /// Return promise resolving to Vue application.
    load({async=false,content=null,title=null,el='app'}={}) {
        var self = this;
        return new Promise((resolve, reject) => {
            let func = () => {
                try {
                    let config = self.config;
                    this.addStore(config);

                    const el = document.querySelector(config.el);
                    if(!el)
                        return reject(`Error: can't get element ${config.el}`)

                    if(content)
                        el.innerHTML = content
                    if(title)
                        document.title = title;
                    this.app = new Vue(config);
                    window.scroll(0, 0);
                    resolve(self.app)
                } catch(error) {
                    self.destroy();
                    reject(error)
                }};
            async ? window.addEventListener('load', func) : func();
        });
    }

    /// Save application state into browser history
    historySave(url,replace=false) {
        const el = document.querySelector(this.config.el);
        const state = {
            // TODO: el: this.config.el,
            content: el.innerHTML,
            title: document.title,
        };

        if(replace)
            history.replaceState(state, '', url)
        else
            history.pushState(state, '', url)
    }

    /// Load application from browser history's state
    historyLoad(state) {
        return this.load({ content: state.content, title: state.title });
    }
}


