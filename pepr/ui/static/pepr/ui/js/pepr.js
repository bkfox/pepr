

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
    comps: [],

    get alerts() {
        if($pepr.app)
            return $pepr.app.$refs.alerts;
    }
}


/**
 *  Configuration for the Vue application
 */
$pepr.conf.app = {
    el: '#app',
    data: $pepr,
    delimiters: ['[[', ']]'],

    methods: {

        /**
         * Send a request using given target of event to get path and
         * construct payload, and return the request.
         *
         * Target of an object can have the following attributes:
         * - data-action-url: request path
         * - data-action-method: method used to send request
         *
         */
        submit(event, payload) {
            event.preventDefault();
            event.stopPropagation()

            var target = event.target;
            var dataset = target.dataset
            var path = dataset.actionUrl;

            payload = payload || {};
            payload.method = payload.method || dataset.actionMethod || 'GET';
            payload.data = payload.data || {};

            var req = this.connection.send(path, payload, false, true);

            var container = target.closest('.remote');
            if(container)
                req.on('success', function(event) {
                    if(event.message.data.html) {
                        // TODO: generic remote container that can either
                        // have modal or whatever
                        // TODO: handle load conflict
                        container.html = event.message.data.html
                    }
                    else
                        container.hidden = true;
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

            if(!dataset.actionMethod)
                dataset.actionMethod = target.getAttribute('method');

            var payload = { data: {} };
            var f_data = new FormData(target);
            f_data.forEach(function(v, k) { payload.data[k] = v; });

            var req = this.submit(event, payload);
            req.on('success', function(event) { target.reset() });
            return req;
        },

        load_modal(event) {
            var modal = this.$refs['global-modal'];
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


