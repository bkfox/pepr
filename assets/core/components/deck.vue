<script>
// TODO:
// - history stack of deck
import { getCurrentInstance, h, ref, watch } from 'vue'
import { singleSelect } from '../composables'

export default {
    emits: singleSelect.emits,
    props: singleSelect.props(),

    setup(props, { emit }) {
        // const instance = getCurrentInstance()
        const selectComp = singleSelect(props, emit)
        // watch(selectComp.selected, () => instance.ctx.$forceUpdate())
        return selectComp
    },

    render() {
        return (this.selected &&
                this.$slots[this.selected] && this.$slots[this.selected]()) ||
                h('div')
    },
}

</script>
