import { ref } from 'vue'
import { createStore } from 'vuex'

import axios from 'axios'
import VuexORM from '@vuex-orm/core'
import VuexORMAxios from '@vuex-orm/plugin-axios'

/**
 * Create Vuex ORM database using provided models. Add model getters to
 * application global properties.
 */
export const modelsPlugin = {
    install(app, {models={}, baseURL='', storeConfig={}}={}) {
        VuexORM.use(VuexORMAxios, { axios, baseURL })

        // store
        const database = new VuexORM.Database()
        for(let model of models)
            database.register(model)

        storeConfig.plugins = [ ...(storeConfig.plugins || []), VuexORM.install(database) ]
        const store = createStore(storeConfig)
        store['baseURL'] = baseURL.toString()
        app.use(store)

        // getters
        const target = app.config.globalProperties;
        for(let key in models) {
            let model = models[key]
            if(!target[model.name])
                target[model.name] = target.$store.$db().model(model.entity)
        }
    }
}

