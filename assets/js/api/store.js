import Vue from 'vue';

import Resource from './resource';


/**
 * Commit and acquire owner for the given resource. Return the stored
 * resource.
 */
function handleResourceData(context, resource, owner=null) {
    context.commit('set', resource)
    resource = context.state.resources[resource.id];
    owner && resource.acquire(owner);
    return resource;
}


export default {
    namespaced: true,

    state: {
        resources: {},
    },

    getters: {
        get(state) {
            return id => state.resources[id];
        },

        resources(state) {
            return state.resources;
        },

        getByIds(state) {
            return ids => ids.map(id => state.resources[id])
                             .filter(item => Boolean(item));
        },

        getOf(state) {
            return owner => Object.values(state.resources)
                                  .filter(item => item.hasOwner(owner))
        },
    },

    mutations: {
        /**
         * Add or update resource data into store.
         */
        set(state, resource) {
            console.log('resource set', resource)
            if(!resource.key)
                throw "resource must have been saved on the server";

            const current = state.resources[resource.id];
            if(!current)
                Vue.set(state.resources, resource.id, resource);
            else
                Vue.set(current, 'data', resource.data);
        },

        /**
         * Remove resource from store (without dropping)
         */
        remove(state, id) {
            delete state.resources[id];
        },

        /**
         * Drop resource from store
         */
        drop(state, id) {
            const resource = state.resources[id];
            if(resource) {
                resource.drop();
                Vue.delete(state.resources, id);
            }
        },
    },

    actions: {
        /**
         * Acquire multiple resources at once and ensure provided resources
         * are stored.
         */
        acquire({commit, state}, {owner, resources}) {
            for(const item of resources) {
                commit('set', item);
                const resource = state.resources[item.id];
                resource.acquire(owner);
            }
        },

        /**
         * Release all resources from the given owner. If `ids` is provided,
         * release only thoses of the given ids.
         */
        release({state}, {owner, ids=null}) {
            const resources = ids == null ? state.resources
                                          : ids.map(id => state.resources[id])
            for(var id in resources) {
                const item = resources[id];
                if(item && item.hasOwner(owner))
                    item.release(owner);
            }
        },

        /**
         * Load resource and return a promise resolving to the stored resource.
         *
         * @param {Boolean} once - if yet present, do not fetch.
         */
        load(context, {path, owner=null, once=false, classe=Resource, options={}}={}) {
            const resource = once && context.state.resources[path];
            if(resource)
                return Promise.resolve(resource);
            return classe.load(path, options, {owner: owner}).then(
                resource => handleResourceData(context, resource),
                resource => { context.commit('drop', resource.id);
                              return Promise.reject(resource); },
            )
        },

        /**
         * Load multiple resources and return a promise resolving to the stored
         * resources.
         */
        loadList(context, {path, owner=null, classe=Resource, options={}}) {
            return classe.loadList(path, options, {owner: owner}).then(
                data => {
                    data.results = data.results.map(resource => {
                        context.commit('set', resource);
                        return context.state.resources[resource.id];
                    })
                    return data;
                }
            )
        },

        /**
         * Create a new resource on server and store result.
         */
        create(context, {endpoint, data, classe=Resource, ...initArgs}) {
            return classe.create(endpoint, data, initArgs)
                .then(resource => handleResourceData(context, resource))
        },

        /**
         * Save the given resource and update the store. Return a promise resolving
         * to the stored resource.
         */
        save(context, {resource, owner=null, data=null}) {
            return resource.save(data).then(
                resource => handleResourceData(context, resource, owner)
            )
        },

        /**
         * Destroy the given resource and update the store. Return a promise resolving
         * to the removed resource.
         */
        delete(context, {resource, data=null}) {
            return resource.delete(data).then(
                resource => context.commit('drop', resource.id)
            )
        },
    },
}

