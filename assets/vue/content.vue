<script>
import _ from 'lodash';
import Vue from 'vue';


const defaultTemplate = Vue.compile('<div><slot></slot></div>');


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
         * Vue template string to render inside object
         */
        html: { type: String },
    },

    render(h) {
        var template = this.html ? Vue.compile(this.html) : defaultTemplate;
        this.$options.staticRenderFns = template.staticRenderFns;
        return template.render.call(this, h, { scopedSlots: this.$scopedSlots });
    }
}
</script>
