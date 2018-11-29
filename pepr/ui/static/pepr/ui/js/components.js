

/**
 * An alert displayed to user
 */
$pepr.comps.Alerts = Vue.component('pepr-alerts', {
    template: `<div>
        <div v-for="alert in items"
             v-if="alert.text">
            <b-alert dismissible
                :show='alert.countDown'
                :key='alert.id'
                :variant="alert.variant"
                @dismissed="remove(alert)"
                @dismiss-count-down="onCountDown"
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
    },

    data() {
        return {
            lastId: 0,
            items: [],
            countDown: 10,
        }
    },

    methods: {
        onCountDown(event) {
            this.countDown = event.countDown;
        },

        add(variant, text, icon='fa-exclamation-circle fas') {
            var alert = {
                id: this.lastId++,
                countDown: this.countDown + text.length,
                variant: variant,
                text: text,
                icon: icon + ' icon mr-2',
            };
            this.items.splice(0, 0, alert);

            if(this.items.length > this.max)
                this.items.splice(this.max);
            return alert;
        },

        remove(alert) {
            var index = this.items.indexOf(alert);
            if(index != -1)
                this.items.splice(index,1);
        },
    },
})



/**
 * A component that can render either a DOM element or template string.
 * The DOM element will be set only if there is no `html`.
 */
$pepr.comps.Dynamic = Vue.component('pepr-dynamic', {
    template: `<div></div>`,
    data() {
        return $pepr;
    },
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
    render(h) {
        var template = Vue.compile(this.html ? this.html : this.$options.template);
        this.$options.staticRenderFns = template.staticRenderFns;
        return template.render.call(this, h);
    }
});



$pepr.comps.Modal = Vue.component('pepr-modal', {
    template: `
        <b-modal ref="modal">
            <pepr-dynamic :html="html"></pepr-dynamic>
        </b-modal>
    `,
    data() {
        return {
            'html': '',
        }
    },

    methods: {
        load(event) {
            var req = $pepr.connection.submit(event);
            var self = this;
            req.on('message', function(e) {
                self.html = (e.message.data.html || e.message.data.detail);
                // fix some obscure bug with single-quotes
                self.html = self.html.replace('&#39;', "'");
            });

            this.show();
        },

        hide() {
            this.$refs.modal.hide();
        },

        show() {
            this.$refs.modal.show();
        },
    },

    render(h) {
        var html = this.html ? '<b-modal size="lg" ref="modal" class="remote">' +
                               this.html + '</b-modal>' :
                               this.$options.template;
        var template = Vue.compile(html);
        this.$options.staticRenderFns = template.staticRenderFns;
        return template.render.call(this, h);
    }
});

