
/**
 * An alert displayed to user
 */
$pepr.comps.Alerts = Vue.component('pepr-alerts', {
    template: `<div>
        <div v-for="alert in items"
             v-if="alert.text">
            <b-alert fade dismissible
                :show='alert.countDown'
                :key='alert.id'
                :variant="alert.variant"
            >
                <span :class="alert.icon"></span>
                {{ alert.text }}
                <slot></slot>
            </b-alert>
        </div>
    </div>
    `,

    props: {
        'max': { type: Number, default: 6 },
        'countDown': { type: Number, default: 10 },
    },

    data() {
        return {
            lastId: 0,
            items: [],
        }
    },

    methods: {
        add(variant, text, icon='fa-exclamation-circle fas') {
            var alert = {
                id: this.lastId++,
                countDown: this.countDown,
                variant: variant,
                text: text,
                icon: icon + ' icon mr-2',

                decrementCountDown(countDown) {
                    this.countDown = countDown;
                }
            };
            this.items.splice(0, 0, alert);

            if(this.items.length > this.max)
                this.items.splice(this.max);
            return alert;
        },

        remove(alert) {
            var index = this.items.indexOf(this);
            if(index != -1)
                this.list.splice(index,1);
        },
    },
})



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
        var template = Vue.compile(this.html ? this.html : this.$options.template);
        this.$options.staticRenderFns = template.staticRenderFns
        return template.render.call(this, h);
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
            message: {
                variant: 'danger',
                text: null,
                icon: 'fas fa-exclamation-circle'
            },
        }
    },
    methods: {
        handle_submit(event) {
            var form = event.currentTarget;
            this.message.text = null;

            var data = {};
            var form_data = new FormData(form);
            form_data.forEach(function(value, key) {
                data[key] = value;
            });

            var self = this;
            var connection = this.connection || $pepr.connection;
            connection.send(this.action, {
                method: this.method,
                data: data,
            }).onmessage = function(event) {
                var message = event.message;
                if(message.status >= 200 && message.status < 299) {
                    form.reset();
                    return;
                }

                self.message.text = message.data.detail;
            };
        },
    }
});


