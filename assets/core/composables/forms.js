import { computed, nextTick, onMounted, provide, reactive, ref, watch } from 'vue'

import Api from '../api'
import { makeProps } from './utils'

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
                      model = null, commit=false,
                      submitConfig={}, ...ctx}, { emit })
{
    // TODO: include usage of optional 'action' props
    const initial = computed(() => initial_.value || (defaults && defaults.value) || {})
    const data = reactive({...initial.value})
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
            emit('error', value)
        }
    }

    function submitForm({form, event=null, ...config}={}) {
        const res = (commit.value && model && model.value) ?
            model.value.fetch({method: 'POST', form, id: data.$id, commit: true, ...config}) :
            new Api(null, {store: useStore()}).fetch({form, ...config})

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

    watch(initial, reset)
    return { ...ctx, initial, data, errors, model, reset, resetErrors,
             submit: submitForm }
}

form.emits = ['success', 'done', 'error', 'reset']

/**
 * Return components' props for form
 */
form.props = makeProps({
    action: { type: String, default: '' },
    initial: { type: Object, default: null },
    commit: { type: Boolean, default: true },
})


/**
 * Select item
 */
export function singleSelect(props, emit) {
    function getValue(value) {
        return value === null || value === undefined ?
            props.initial || 'default' : value
    }

    const selected = ref(getValue(props.initial))

    function select(value=null) {
        value = getValue(value)
        if(value != selected.value) {
            selected.value = value
            emit('select', selected.value)
        }
    }
    return { selected, select }
}

singleSelect.emits = ['select']
singleSelect.props = makeProps({
    initial: { type: String, default: 'default' },
})

