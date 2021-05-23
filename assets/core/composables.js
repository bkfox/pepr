import { computed, inject, provide, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'

import { submit, Model, Context } from './models'


/**
 * Return function used to add properties related to a composable to a
 * component, as `function(override) -> {...props}`.
 *
 * Where `override` is a dict of properties default values/overriding object.
 *
 */
export function makeProps(source) {
    function func(override={}) {
        var props = {}
        for(var key in source) {
            var oitem = override[key]
            if(oitem instanceof Object)
                props[key] = {...source[key], ...oitem}
            else
                props[key] = oitem
        }
        return props
    }
    return func
}


/**
 *  Provide model class using component's store
 */
export function useModel({entity=null, item=null}=null) {
    const model = computed(() =>
        (entity && entity.value) ? userStore().$db().model(entity.value)
                                 : item && item.value.constructor || null)
    return { model }
}


/**
 * Get model instance by id. If not present, fetch from remote server.
 */
export function getObject(id, entity) {
    const model = computed(() => entity.value && userStore().$db().model(entity.value))
    const object = computed(() => model.value && model.value.find(id.value))
    return { model, object }
}

/**
 * Get model instance by id. If not present, fetch from remote server.
 */
export function getOrFetch(id, entity) {
    const { model, object } = getObject(id, entity)

    function fetch(id) {
        var obj = model.value && model.value.find(id.value)
        if(obj == null || obj.value == null)
            model.value.fetch(id).then(r => {
                // model.insertOrUpdate({data: r.response.data })
                // return r
            })
    }
    watch(id, fetch)

    return { model, object }
}


/**
 *  Add context's information to component.
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
export function useContext(context) {
    const role = computed(() => context.value && context.value.role)
    const roles = inject('roles')
    const subscription = computed(() => context.value && context.value.subscription)

    provide('context', context)
    provide('role', role)
    provide('subscription', subscription)

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



/**
 * Composable handling form, handling both Model and regular objects.
 * It sends data using XmlHttpRequest.
 *
 * Provides: 'errors' (errors returned by the server)
 *
 * @param {Ref({})} initial         initial data of form's fields
 * @param {Ref({})} defaults        default values of form's fields
 * @param bool      commit          use Model.save and commit changes to store
 * @param {}        submitConfig    extra config to pass to submit method
 *
 * @fires form#success
 * @fires form#error
 * @fires form#reset
 *
 */
export function form({initial: initial_, defaults = null,
                      constructor: constructor_ = null, commit=false,
                      submitConfig={}}, { emit })
{
    const initial = computed(() => initial_.value || defaults && defaults.value || {})
    const constructor = computed(() =>
        constructor.value ? typeof(constructor.value) == 'string'
                          ? useStore().$db().model(constructor.value)
                          : constructor.value
                          : initial.value.constructor
    )
    const data = reactive(new constructor.value({...initial.value}))
    const errors = reactive({})
    provide('errors', errors)


    function reset(value=null) {
        for(var k in data)
            delete data[k]

        resetErrors()

        Object.assign(data, value || initial.value)
        emit('reset', data)
    }

    function resetErrors(value=null) {
        for(var k in errors)
            delete errors[k]

        if(value) {
            Object.assign(errors, value)
            emit('error', r.data)
        }
    }

    function submitForm(ev, form=null) {
        if(ev) {
            ev.preventDefault()
            ev.stopPropagation()
        }

        form = form || ev.target
        url = form.getAttribute('action')
        method = form.getAttribute('method')

        const res = (commit && data.value instanceof Model) ?
            data.value.save({form, url, method, ...submitConfig}) :
            submit({form, url, method, ...submitConfig})


        return res.then(r => {
            if(200 <= r.status < 300) {
                reset(r.data)
                emit('success', r.data)
            }
            else if(r.errors)
                resetErrors(r.data)
            return r
        })
    }

    reset()
    watch(initial, reset)
    watch(constructor, reset)
    return { initial, data, errors, reset, resetErrora,
             constructor: constructor,
             submit: submitForm }
}

/**
 * Return components' props for form
 */
form.props = makeProps({
    constructor: { type: [Function,String], default: null },
    initial: { type: Object, default: null },
    commit: { type: Boolean, default: false },
})


/**
 * Select item
 */
export function singleSelect(props, emit) {
    const selected = ref(props.default)
    function select(value=null) {
        value = value === null ? props.default : value
        if(value != selected.value) {
            selected.value = value
            emit('select', selected.value)
        }
    }
    return { selected, select }
}

