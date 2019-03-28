<script>
import _ from 'lodash';
import Vue from 'vue';

/**
 * Container that can receive vue template as content. It handles loading from
 * the server.
 *
 * FIXME: include slot method along with html & elm in preRender
 */
export default {
    data() {
        return {};
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
    },

    methods: {
        /**
         * Load content using given url from the give connection.
         */
        // TODO: redo
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
        },

        preRender(html, elm) {
            console.log('prerender', html, elm);
            html = html || this.html;

            if(html) {
                this.$forceUpdate();
                if(this.elm && this.elm != elm && this.elm.parentNode == this.$el)
                    this.$el.removeChild(this.elm);
            }
            else if(elm)
                this.$el.appendChild(newValue)
        }
    },

    mounted() {
        if(this.elm && !this.html)
            this.$el.appendChild(this.elm);

        // we need to watch `elm` and keep it synchronized (e.g.
        // item deletion in list may not delete this, but change
        // bound data instead)
        this.$watch('elm', function(newValue, oldValue) {
            if(oldValue && this.$el == oldValue.parentNode)
                oldValue.parentNode.removeChild(oldValue);
            this.preRender(this.html, newValue);
        });

        this.$watch('html', function(newValue, oldValue) {
            this.preRender(newValue, this.elm);
        });

        // this.$options.staticRenderFns => per instance
        // this.$options = _.assign({}, this.$options);
    },

    render(h) {
        var template = Vue.compile(this.html ? this.html : '<div><slot></slot></div>');
        this.$options.staticRenderFns = template.staticRenderFns;
        return template.render.call(this, h);
    }
}
</script>
