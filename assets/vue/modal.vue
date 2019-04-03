<template>
    <b-modal ref="modal">
        <p-content :html="html">
            <slot :html="html" :request="request"></slot>
        </p-content>
    </b-modal>
</template>

<script>
export default {
    data() {
        return {
            request: null,
            html: '',
        }
    },

    methods: {
        hide() {
            this.$refs.modal.hide();
        },

        show(reset) {
            if(reset)
                // TODO: 'loading' state
                this.html = ''
            this.$refs.modal.show();
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
            request.then(
                function({ data }) {
                    self.html = data.content;
                    if(!self.html)
                        self.hide();
                    return 
                },
                function({ data }) {
                    // TODO: handle error
                    self.html = '-- error --'
                }
            );

            this.request = request;
            return request;
        },
    },

    render(h) {
        var html = this.$options.template.replace('${html}', this.html || '');
        var template = Vue.compile(html);
        this.$options.staticRenderFns = template.staticRenderFns;
        return template.render.call(this, h);
    },
};
</script>

