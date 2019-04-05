<template>
    <div ref="modal" role="dialog" :tabindex="-1"
        aria-modal="true" :aria-hidden="!visible"
        class="modal fade" :class="{show: visible}"
        :style="modalStyle"
        @click.self="hide()" @keydown.esc="hide()"
        >
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content shadow p-2" ref="content"
                    tabindex="0">
                <nav>
                    <button type="button" class="close sticky-top float-right"
                        @click="hide()"
                        >
                        <span aria-hidden="true">×</span>
                    </button>
                </nav>
                <template v-if="html">
                    <v-runtime-template :template="html"></v-runtime-template>
                </template>
                <template v-else>
                    <slot :html="html" :request="request">
                        <header class="modal-header">
                            <slot name="header">
                                <h5 class="modal-title">
                                    <slot name="title"></slot>
                                </h5>
                            </slot>
                        </header>
                        <div class="modal-body" v-if="$slots.body">
                            <slot name="body"></slot>
                        </div>
                        <footer class="modal-footer">
                            <slot name="footer"></slot>
                        </footer>
                    </slot>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
/* TODO:
    - ok, cancel button
    - fire events
 */
import VRuntimeTemplate from 'v-runtime-template';

// TODO: 'loading' 'error' state & related slots
export default {
    data() {
        return {
            request: null,
            html: '',
            visible: false,
        }
    },

    props: {
        bgColor: { type: String, default: 'rgba(0,0,0,0.3)' },
    },

    computed: {
        modalStyle() {
            return {
                display: this.visible ? 'block' : 'none',
                backgroundColor: this.bgColor,
            }
        },
    },

    methods: {
        hide(reset=false) {
            if(reset) this.html = '';
            this.visible = false;
        },

        show(reset=false) {
            if(reset) this.html = ''
            this.visible = true;

            const modal = this.$refs.modal;
            if(!modal)
                return

            modal.focus({ preventScroll: top });
            this.$refs.content.click();
            modal.scrollTop = 0;
        },

        toggle(reset=false) {
            if(reset) this.html = ''
            this.visible = !this.visible;
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

