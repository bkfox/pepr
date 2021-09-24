<template>
    <div role="dialog" :tabindex="-1"
        aria-modal="true" :aria-hidden="!isActive"
        :class="{modal: true, 'is-active': isActive}"
        @keydown.esc="hide()">
        <div class="modal-background" @click.self="hide()"></div>
        <div class="modal-content" role="document">
            <template v-if="html">
                <p-runtime-template :template="html"></p-runtime-template>
            </template>
            <template v-else>
                <slot :isActive="isActive"
                    :hide="hide" :show="show" :toggle="toggle" :load="load"></slot>
            </template>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="hide()"></button>
    </div>
</template>

<script>
/* TODO:
    - modal-card & slots for headers & footers
 */
import PRuntimeTemplate from './runtimeTemplate'

// TODO: 'loading' 'error' state & related slots
export default {
    data() {
        return {
            /// Fetch request controller
            controller: null,
            /// Html code to show
            html: '',
            isActive: false,
        }
    },

    methods: {
        hide({reset=false}={}) {
            if(reset)
                this.html = '';
            this.isActive = false;
            this.controller && this.controller.abort()
            this.controller = null;
        },

        show({reset=false}={}) {
            if(reset)
                this.html = ''
                
            this.isActive = true;

            const modal = this.$el;
            if(!modal)
                return

            modal.focus({ preventScroll: top });
            modal.scrollTop = 0;
        },

        toggle(opts) {
            if(this.isActive)
                this.hide(opts)
            else
                this.show(opts)
        },

        /**
         * Fetch url and load into modal
         */
        load(url, config={}) {
            if(this.controller)
                this.controller.abort();

            this.controller = new AbortController();
            fetch(url, config)
                .resolve(response => response.text())
                .then(text => {
                    this.html = html
                    this.controller = null
                    !this.html && this.hide()
                }, err => { this.controller = null })
        },
    },

    components: { PRuntimeTemplate },
};
</script>

