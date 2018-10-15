
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


