<template>
<p-modal ref="modal">
    <p-form ref="form" v-bind="$props" v-on="$listeners"
            :class="formClass" @done="hide()" @success="hide()">
        <template v-slot:default="formProps">
                <slot v-bind="formProps" :hide="hide" :show="show" :modal="$refs.modal" :form="$refs.form"/>
        </template>
    </p-form>
</p-modal>

</template>
<script>
import PModal from './modal'
import PForm from './form'

export default {
    props: {
        ...PForm.props,
        formClass:String
    },
    emits: [...PForm.emits],
    methods: {
        show({data=null, ...opts}={}) {
            data && this.$refs.form.reset(data)
            this.$refs.modal.show(opts)
        },

        hide(opts={}) {
            this.$refs.modal.hide(opts)
        },
    },
    components: { PModal, PForm }
}
</script>
