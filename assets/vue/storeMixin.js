import { acquireId } from 'pepr/utils/id';

/**
 * @module vue/storeMixin
 * @vue-prop {String} model - context class (can't be changed)
 * @vue-data {Model} _model - context class
 * @vue-data cid - collection id
 */
export default {
    data() {
        const cid = acquireId();
        return {
            model: this.modelClass,

            /**
             * Component's collection id.
             */
            get cid() {
                return cid;
            },
        }
    },

    props: {
        modelClass: {type: Function, default: null}
    },

    methods: {
        /**
         * Getter from to model class' store.
         * @param {String} name
         */
        getter(name) {
            return this.model.getter(name, this.$store);
        },

        /**
         * Commit to model class' store.
         * @param {String} type
         * @param payload
         */
        commit(type, payload) {
            return this.model.commit(type, payload, this.$store);
        },

        /**
         * Dispatch to model class' store.
         * @param {String} type
         * @param payload
         */
        dispatch(type, payload) {
            return this.model.dispatch(type, payload, this.$store);
        },

        /**
         * Fetch and acquire a list of items.
         * @param {Object} options - fetch options
         * @see {orm:Record.fetchList}
         */
        fetchList(options) {
            return this.dispatch('fetchList', {collection: this.cid, ...options});
        },
    },

    destroy() {
        this.model.commit('release', {collection: this.cid});
    },
}


