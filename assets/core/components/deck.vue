<script>
// TODO:
// - history stack of deck
import { h, ref } from 'vue'
import { singleSelect } from '../composables/select'

export default {
    props: {
        default: { type: String, default: 'default' },
    },

    setup(props, { emit }) {
        return singleSelect(props, emit)
    },

    render() {
        return (this.selected &&
                this.$slots[this.selected] && this.$slots[this.selected]()) ||
                h('div')
    },
}

</script>
