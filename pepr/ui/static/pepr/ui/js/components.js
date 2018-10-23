
/**
 * A component that can render either a DOM element or template string.
 * The DOM element will be set only if there is no `html`.
 */
$pepr.comps.Dynamic = Vue.component('pepr-dynamic', {
    template: `<div></div>`,
    props: {
        elm: { type: Element },
        html: { type: String },
        data: {},
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
    render(h){
        var template = this.html ? this.html : this.$options.template;
        return Vue.compile(template).render.call(this, h);
    }
});


/**
 *  Form that sends data through api
 */
$pepr.comps.Form = Vue.component('pepr-form', {
    template: `
        <form @submit.prevent="handle_submit" :action="action" :method="method">
            <slot></slot>
        </form>
    `,
    props: ['action','method'],
    data: function() {
        return {
            connection: undefined,
        }
    },
    methods: {
        handle_submit(event) {
            var data = {};
            var form_data = new FormData(event.currentTarget);
            form_data.forEach(function(value, key) {
                data[key] = value;
            });

            var connection = this.connection || $pepr.connection;
            connection.send(this.action, {
                method: this.method,
                data: data,
            }).onmessage = function(connection, data) {
                console.log(connection, data);
            };
        },
    }
});


