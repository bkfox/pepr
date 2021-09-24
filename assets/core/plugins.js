import { ref } from 'vue'
import { createStore } from 'vuex'

import axios from 'axios'
import VuexORM from '@vuex-orm/core'
import VuexORMAxios from '@vuex-orm/plugin-axios'

import { Context } from './models'
import Api from './api'


/**
 * VuexORM plugin to add api related methods (using 'api.Api'
 */
export const apiPlugin = {
    install(components, options) {
        components.Model.api = function() {
            return new Api(this, options)
        }
    }
}

/**
 * Create Vuex ORM database using provided models. Add model getters to
 * application global properties.
 */
export const modelsPlugin = {
    install(app, {models={}, baseURL='', getters=true, storeConfig={}}={}) {
        VuexORM.use(apiPlugin, { baseURL })

        // store
        const database = new VuexORM.Database()
        for(let model of models)
            database.register(model)

        storeConfig.plugins = [ ...(storeConfig.plugins || []), VuexORM.install(database) ]
        const store = createStore(storeConfig)
        store['baseURL'] = baseURL.toString()
        app.use(store)

        getters && this.installGetters(app, models)
    },

    installGetters(app, models) {
        const target = app.config.globalProperties;
        for(let key in models) {
            let model = models[key]
            if(!target[model.name])
                target[model.name] = target.$store.$db().model(model.entity)
        }
    }


}


/**
 * Perform initialization of provided models
 */
export const initModelsPlugin = {
    install(app, {models={}, tasks=[]}) {
        const target = app.config.globalProperties
        for(let model of models) {
            model = target.$store.$db().model(model.entity)
            if(!model)
                throw `model '${model.entity}' is not declared on app`
            if(model.prototype instanceof Context)
                tasks.push(model.fetchRoles())
        }
    }
}

