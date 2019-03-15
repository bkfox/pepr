<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
/**
 * Container that can receive vue template as content. It handles loading from
 * the server.
 *
 * FIXME: bug when both elm and html are given, nothing is displayed.
 */
module.exports = {
    data() {
        return {
           /**
            *  Url used to load content from the server.
            */
            url: null,
        };
    },

    props: {
        /**
         * Attach a Vue element to display as child
         */
        elm: { type: Element },
        /**
         * Vue template string to render inside object
         */
        html: { type: String },
        /**
         *
         */
        // data: {},
    },

    methods: {
        /**
         * Load content using given url from the give connection.
         */
        load(connection, url, payload={}) {
            var self = this;
            self.url = url;

            connection.send(url, payload).then(
                function(message) {
                    self.html = message.content;
                },
                function(message) {
                    // TODO: handle error
                    self.html = '-- --'
                }
            );
        }
    },

    mounted() {
        if(this.elm && !this.html) {
            this.$el.appendChild(this.elm);

            // we need to watch `elm` and keep it synchronized (e.g.
            // item deletion in list may not delete this, but change
            // bound data instead)
            this.$watch('elm', function(newValue, oldValue) {
                if(oldValue && this.$el == oldValue.parentNode)
                    oldValue.parentNode.removeChild(oldValue);
                if(newValue)
                    this.$el.appendChild(newValue);
            });
        }
    },

    render(h) {
        var template = Vue.compile(this.html ? this.html : this.$options.template);
        this.$options.staticRenderFns = template.staticRenderFns;
        return template.render.call(this, h);
    }
}
</script>
