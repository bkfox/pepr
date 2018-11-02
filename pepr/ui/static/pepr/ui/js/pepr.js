

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



window.addEventListener('load', function() {
    $pepr.connection = new Connection(
        'ws://' + window.location.host + '/',
        $pepr.conf.requestTimeout,
        $pepr.conf.autoreconnect
    );
}, true);


window.addEventListener('load', function() {
    vueMoment.install(Vue)

    $pepr.app = new Vue({
        el: '#app',
        data: $pepr,
        delimiters: ['[[', ']]'],
    });

    window.app = $pepr.app;
}, false);



