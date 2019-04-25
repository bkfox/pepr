<template>
</template>


<script>
import Vue from 'vue';
import Resource from '../js/api/resource.js';

export default {
    props: {
        endpoint: { type: String },
        id: { type: String },
        fetchOptions: { type: Object, default: null },
    },

    data() {
        return {
            resource: null,
        };
    },

    methods: {
        fetch(endpoint=null, key=null, options=null) {
            const self = this;

            endpoint = endpoint || this.endpoint;
            key = key || this.id;
            options = options || this.fetchOptions || {};
            return Resource.load(endpoint, key, options)
                .then((item) => { Vue.set(self, 'resource', item) });
        }
    },

    mounted() {
        this.fetch();
    },

    watch: {
        endpoint(val) { this.fetch(val); },
        id(val) { this.fetch(null, val); },
        options(val) { this.fetch(null, null, null, val); },
    },
}
</script>
