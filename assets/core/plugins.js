import { ref } from 'vue'
import { createStore } from 'vuex'

import axios from 'axios'
import VuexORM from '@vuex-orm/core'
import VuexORMAxios from '@vuex-orm/plugin-axios'

/**
 * Create Vuex database using provided models, and use created store for app.
 */
export const ormPlugin = {
    install(app, {models={}, baseURL='', storeConfig={}}={}) {
        VuexORM.use(VuexORMAxios, { axios, baseURL })

        // store
        const database = new VuexORM.Database()
        for(let key in models)
            database.register(models[key])

        storeConfig.plugins = [ ...(storeConfig.plugins || []), VuexORM.install(database) ]
        app.use(createStore(storeConfig))

        // getters
        const target = app.config.globalProperties;
        for(let key in models) {
            let model = models[key]
            if(!target[model.name])
                target[model.name] = target.$store.$db().model(model.entity)
        }
    }
}

