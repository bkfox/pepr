import { computed, inject, provide, readonly, watch } from 'vue'
import { useStore } from 'vuex'

import { makeProps } from './utils'

/**
 *  Provide model class using component's store
 */
export function useModel({entity=null, item=null}={}) {
    const model = computed(() =>
        (entity && entity.value) ? useStore().$db().model(entity.value)
                                 : item && item.value
                                 ? item.value.constructor : null)
    return { model, entity }
}

useModel.props = makeProps({
    entity: { type: String, default: null }
})

/**
 * Get model instance by id. If not present, fetch from remote server.
 */
export function getObject(id, entity) {
    const model = computed(() => entity.value && useStore().$db().model(entity.value))
    const object = computed(() => model.value && model.value.find(id.value))
    return { model, object }
}

/**
 * Get model instance by id. If not present, fetch from remote server.
 */
export function getOrFetch(id, entity) {
    const { model, object } = getObject(id, entity)

    function fetch(id) {
        if(!id.value || !model.value)
            return
        var obj = model.value.find(id.value)
        if(obj == null || obj.value == null)
            model.value.fetch({id: id.value})
    }
    watch(id, fetch)
    fetch(id)

    return { model, object }
}


/**
 *  Add context's information to component. Use injected values when no
 *  context reference is provided.
 *
 *  Context:
 *  - context: current context
 *  - role: user's role
 *  - roles: available roles (injected from App)
 *
 *  Provide:
 *  - context: current context
 *  - role: current role
 *
 *  @param {Ref(Model)} context
 */
export function useContext(context=null) {
    let do_provide = context != null
    if(context==null) {
        console.log('inject context')
        context = inject('context')
        watch(context, (v) => console.log(context, v))
    }

    const role = computed(() => context.value && context.value.role)
    const roles = computed(() => context.value && context.value.roles)
    const subscription = computed(() => context.value && context.value.subscription)

    if(do_provide) {
        provide('context', readonly(context))
        provide('roles', readonly(roles))
        provide('role', readonly(role))
        provide('subscription', readonly(subscription))
    }

    return { context, role, roles, subscription }
}

useContext.props = makeProps({
    context: { type: Object, required: true },
})


/**
 * Use context by id.
 */
export function useContextById({contextId: id, contextEntity: entity, fetch=false}) {
    const { object: context } = fetch ? getOrFetch(id, entity) : getObject(id, entity)
    return useContext(context)
}

useContextById.props = makeProps({
    contextId: { type: String, default: null },
    contextEntity: { type: String, default: 'context' },
})

/**
 *  Use context of an Accessible instance
 */
export function useParentContext(item) {
    const context = computed(() => item.value && item.value.context)
    return useContext(context)
}


