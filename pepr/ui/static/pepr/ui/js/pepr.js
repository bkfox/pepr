

/**
 *  Root object in which we store information about running client and
 *  application.
 */
$pepr = {
    /**
     * Client Configuration
     */
    conf: {
        requestTimeout: 1000,
        autoreconnect: 5000,
    },

    /**
     * websockect Connnection
     */
    connection: undefined,

    /**
     * VueJs application
     */
    app: undefined,

    /**
     *  VueJS available components
     */
    comps: {},

    get alerts() {
        if($pepr.app)
            return $pepr.app.$refs.alerts;
    }
}

$pepr.$pepr = $pepr;

/**
 *  Configuration for the Vue application
 */
$pepr.conf.app = {
    el: '#app',
    data: $pepr,
    delimiters: ['[[', ']]'],

    methods: {
        /**
         *  Return payload for given submit event.
         */
        _get_submit_payload(event, payload) {
            var dataset = event.target.dataset;

            payload = payload || {};
            payload.method = payload.method || dataset.actionMethod || 'GET';
            payload.data = payload.data || {};

            var path = dataset.actionUrl;

            // lookup
            if(dataset.actionLookup) {
                var lookup = encodeURIComponent(dataset.actionLookup) + '=' +
                             encodeURIComponent(event.target.value);
                path = path + (path.indexOf('?') != 1 ? '?' : '&') + lookup;
            }
            return payload;
        },

        /**
         * Send a request using given target of event to get path and
         * construct payload, and return the request.
         *
         * Target of an object can have the following attributes:
         * - data-action-url: request path
         * - data-action-method: method used to send request
         * - data-action-lookup: request `GET` parameter to assign to
         *      event's `target.value`
         *
         */
        submit(event, payload) {
            event.preventDefault();
            event.stopPropagation()

            var target = event.target;
            var dataset = target.dataset

            var req = this.connection.send(
                dataset.actionUrl,
                this._get_submit_payload(event, payload),
                false, true
            );

            var container = target.closest('.remote');
            var container = container && container.__vue__;

            // `action_target` => get from dataset's action target. By default,
            // use container (if it is remote)
            var action_target = dataset.actionTarget &&
                                $pepr.app.$refs[dataset.actionTarget];
            var action_target = action_target || container;

            if(action_target)
                action_target.show(true)

            req.on('success', function(event) {
                if(action_target && event.message.content) {
                    // TODO: handle load conflict
                    action_target.html = event.message.content.replace('&#39;', "'");
                    action_target.show && action_target.show();
                }
                else if(container)
                    container.hide()
            })
            return req;
        },

        /**
         *  Send form over API using `connection.submit`.
         */
        submit_form(event) {
            var target = event.target;
            var dataset = target.dataset;

            if(!dataset.actionUrl)
                return;

            var payload = {
                method: dataset.actionMethod ||
                        target.getAttribute('method'),
                data: {}
            };
            var f_data = new FormData(target);
            f_data.forEach(function(v, k) { payload.data[k] = v; });

            var req = this.submit(event, payload);
            req.on('success', function(event) { target.reset() });
            return req;
        },

        load_modal(event) {
            var modal = this.$refs.modal;
            modal.load(event);
        }
    }
}


window.addEventListener('load', function() {
    $pepr.connection = new Connection(
        'ws://' + window.location.host + '/',
        $pepr.conf.requestTimeout,
        $pepr.conf.autoreconnect
    );
}, true);


window.addEventListener('load', function() {
    vueMoment.install(Vue);

    $pepr.app = new Vue($pepr.conf.app);
    window.app = $pepr.app;
}, false);


