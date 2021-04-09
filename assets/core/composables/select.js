import { ref } from 'vue'

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

