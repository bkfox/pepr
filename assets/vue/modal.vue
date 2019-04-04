<template>
    <b-modal ref="modal" :hide-footer="true">
        <v-runtime-template :template="html"></v-runtime-template>
        <slot :html="html" :request="request"></slot>
    </b-modal>
</template>

<script>
import VRuntimeTemplate from 'v-runtime-template';

// TODO: 'loading' 'error' state & related slots
export default {
    data() {
        return {
            request: null,
            html: '',
        }
    },

    methods: {
        hide() {
            this.$refs.modal.hide()
        },

        show(reset) {
            if(reset)
                this.html = ''
            this.$refs.modal.show()
        },

        toggle() {
            this.$refs.modal.toggle();
        },

        /**
         * Handle a given request whose resulting content will be displayed in
         * this component.
         */
        handleRequest(request) {
            if(this.request) {
                this.request.drop && this.request.drop();
            }
            this.show();

            var self = this;
            // TODO: handle error
            request.then(response => response.text())
                   .then(text => {
                        self.html = text;
                        if(!self.html)
                            self.hide();
                        return 
                    });
            this.request = request;
            return request;
        },
    },

    components: {
        VRuntimeTemplate,
    },
};
</script>

