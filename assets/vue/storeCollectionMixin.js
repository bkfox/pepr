import { mapMutations, mapActions } from 'vuex';

import { acquireId } from 'pepr/utils/id';



/**
 * Map actions for components. The mapped actions will have their "collection"
 * set to this component, and are namespaced using component's function.
 */
function actionsMap(names) {
    const actions = names.reduce((o, name) => {
        o[name] = function(dispatch, args={}, namespace=null) {
            args = {...args, collection: this.cid };
            return dispatch(this.namespaced(name, namespace), args);
        }
        return o;
    }, {})
    return mapActions(actions);
}


export default {
    data() {
        const cid = acquireId();
        return {
            /**
             * Component's collection id.
             */
            get cid() {
                return cid;
            },
        }
    },

    props: {
        /**
         * Store namespace (used to prefix actions, mutations, etc.)
         */
        storeNamespace: { type: String, default: 'resources' }
    },

    methods: {
        /**
         * Return name namespaced to components' default namespace or the given
         * one. If the namespace is an empty string, targets a root action.
         */
        namespaced(name, namespace=null) {
            namespace = namespace === null ? this.storeNamespace : namespace;
            if(!namespace)
                return name;
            return `${namespace}/${name}`;
        },

        drop(id, namespace=null) {
            this.$store.commit(this.namespaced('drop', namespace), id);
        },

        ...actionsMap(['acquire', 'acquireList', 'release', 'releaseList',
                       'load', 'loadList', 'create']),
    },

    destroy() {
        this.release({}, '');
    },
}


