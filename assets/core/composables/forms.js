import { computed, provide, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'

import { submit, Model } from '../models'
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
    const constructor = computed(() => model && model.value ? model.value
                                                            : initial.value.constructor)
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
            emit('error', value)
        }
    }

    function submitForm(ev, form=null) {
        if(ev) {
            ev.preventDefault()
            ev.stopPropagation()
        }

        form = form || ev.target
        const [url, method] = [form.action, form.getAttribute('method')]
        const res = (commit.value && model && model.value) ?
            data.save({form, url, method, ...submitConfig}) :
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
    return { ...ctx, initial, data, errors, reset, resetErrors,
             constructor: constructor,
             submit: submitForm }
}

form.emits = ['success', 'error', 'reset']

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

singleSelect.emits = ['select']

