
$pepr = {
    /// general client configuration
    conf: {
        request_timeout: 1000,
        autoreconnect: 5000,
    },
    /// websockect Connnection
    connection: undefined,
    /// VueJs application
    app: undefined,
}


window.addEventListener('load', function() {
    $pepr.connection = new Connection(
        'ws://' + window.location.host + '/',
        $pepr.conf.request_timeout,
        $pepr.conf.autoreconnect
    );
}, true);


window.addEventListener('load', function() {
    Vue.component('ws-form', {
        template: '<form @submit.prevent="handle_submit"><slot></slot></form>',
        props: ['action','method','stream'],
        data: function() {
            return {}
        },
        methods: {
            handle_submit(event) {
                var data = {};
                var form_data = new FormData(event.currentTarget);
                form_data.forEach(function(value, key) {
                    data[key] = value;
                });

                $pepr.connection.send(this.stream, {
                    action: this.action,
                    data: data,
                }).onmessage = function(connection, data) {
                    console.log(connection, data);
                };
            },
        }
    });

    Vue.component('ws-stream', {
        template: '<div><slot></slot><div v-for="item in coll.items" v-html="item.html"></div></div>',
        props: ['stream', 'context'],
        data: function() {
            return {
                coll: new Collection([])
            }
        },
        methods: {
            /// Move item from a slot into the given collection.
            /// Items must must have "data-pk" attribute set
            to_collection(slot) {
                if(slot.length == 0)
                    return;

                for(var i in slot) {
                    var elm = slot[i];
                    elm = elm.elm;
                    if(this.coll.extract(elm))
                        elm.parentNode.removeChild(elm);
                }
            }
        },
        mounted: function() {
            this.to_collection(this.$slots.default);
            this.coll.init($pepr.connection, this.stream, this.context);
        },
        beforeDestroy: function() {
            this.coll.unsubscribe();
        },
    });

    $pepr.app = new Vue({
        el: '#app',
        data: {},
    });
}, false);



