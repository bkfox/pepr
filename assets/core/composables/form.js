import { computed, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import Cookies from 'js-cookie'


/**
 * Model form
 * @fires ModelForm#done
 * @fires ModelForm#error
 *
 */
export function modelForm(defaultItem, props, { emit }) {
    const initial = computed(() => props.initial || defaultItem.value)
    const itemModel = computed(() => initial.constructor)
    const item = reactive(new itemModel.value())

    const method = computed(() => initial.value.$id ? 'PUT' : 'POST')
    const url = computed(() => initial.value.$url)
    const context = computed(() => initial.value.context)
    const role = computed(() => context.value.role)

    function reset(value=null, form=null) {
        for(var k in item) delete item[k]
        Object.assign(item, value || initial.value)
    }

    reset()
    watch(initial, reset, {deep: true})

    function submit(ev, form=null) {
        if(ev) {
            ev.preventDefault()
            ev.stopPropagation()
        }

        form = form || ev.target
        return initial.value.save({form}).then(
            r => {
                reset()
                form && form.reset()
                emit('done', r);
                return r
            },
            r => emit('error', r)
        )
    }

    return {
        initial, item, context, role, method, url, reset, submit,
        model: itemModel,
    }
}

