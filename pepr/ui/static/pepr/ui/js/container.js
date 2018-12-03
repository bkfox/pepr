/**
 * Collection that is synchronized to the server with API requests.
 */
class Container extends Collection {
    /**
     *  Return connection used to send requests.
     */
    get_connection(connection) {
        return connection || this.connection || $pepr.connection;
    }

    /**
     *  Load items from the given url.
     *
     *  @param {Connection} connection
     *  @param {String} itemsUrl url to load items
     *  @param {Object} payload send this payload
     *  @param {Boolean} reset reset container before loading (does not reset \
     *      observer)
     *  @return {Request} the sent request.
     *
     */
    load(itemsUrl, payload=null, reset=false, connection=null) {
        connection = this.get_connection(connection);
        var payload = payload || {};
        var req = connection.send(itemsUrl, payload);
        var collection = this.collection;
        req.on('success', function(event) {
            if(reset)
                this.reset(false);

            for(var item of event.message.data.results)
                this.update(item);
        }, this);
        return req;
    }

    /**
     * Bind to a specific server resource if not yet bound.
     *
     * @param {String} collectionUrl API base url of the collection object;
     * @param {String} itemsUrl API base url to get items;
     * @param {Boolean} observe observe the distant collection (sync to list changes)
     * @param {Boolean} force;
     */
    bind(collectionUrl, itemsUrl, observe=true, force=false, connection=null) {
        connection = this.get_connection(connection);

        var path = collectionUrl + 'observer/';
        if(this.observer) {
            if(!force || this.observer.path == path)
                return;
            this.observer.off('message', this.onmessage, this);
            this.observer = null;
        }

        this.connection = connection;
        this.collectionUrl = collectionUrl;
        this.itemsUrl = itemsUrl;

        if(observe) {
            this.observer = this.connection.observe(path);
            this.observer.on('success', this.onObservation, this);
        }
    }

    /**
     * Handle a pubsub message and update collection accordingly.
     */
    onObservation(event) {
        var message = event.message;
        var item = message.data;
        switch(message.method) {
            case 'POST': this.add(item);
                           break;
            case 'PUT': this.update(item);
                           break;
            case 'DELETE': this.remove(item);
                           break;
            default:
                break;
        }
    }

    reset(observer=true) {
        super.reset();
        if(observer && this.observer) {
            this.observer.off('message', this.onObservation, this);
            delete this.observer;
        }
    }
}


// TODO: rename slots
$pepr.comps.Container = Vue.component('pepr-bound-collection', {
    extends: $pepr.comps.Collection,
    template: `
        <div>
            <slot name="prepend" :parent="this" :collection="collection"></slot>
            ${$pepr.comps.Collection.options.template}
            <slot name="append" :parent="this" :collection="collection"></slot>
        </div>
    `,
    props: {
        collectionUrl: { type: String },
        itemsUrl: { type: String },
        limit: { type: Number, default: 20 },
        limitParam: { type: String, default: 'limit' },
        offsetInit: { type: Number, default: 0 },
        offsetParam: { type: String, default: 'offset' },
        observe: { type: Boolean, default: false },
        maxItems: { type: Number, default: 200 },
    },
    data() {
        return {
            connection: undefined,
            collection: new Container(this.idAttr, this.sortAttr),
            offset: this.offsetInit,
            loadReq: null,
        }
    },
    methods: {
        /**
         *  Load more of the list from server.
         */
        load(payload=null, reset=false, filter_offset=true) {
            var payload = payload || { query: {} };
            if(!payload.query)
                payload.query = {};

            if(filter_offset) {
                payload.query[this.limitParam] = this.limit;
                payload.query[this.offsetParam] = this.offset;
            }

            var req = this.collection.load(this.itemsUrl, payload.query, reset);
            req.on('success', function(event) {
                this.offset += event.message.data.results.length;

                var items = this.collection.items;
                if(items.length > this.maxItems)
                    items.splice(0, items.length - this.maxItems)
            }, this);
            return req;
        }
    },
    mounted() {
        if(this.observe)
            this.collection.bind(this.collectionUrl, this.itemsUrl);
    }
});


$pepr.comps.Typeahead = Vue.component('pepr-typeahead', {
    extends: $pepr.comps.Container,
    template: `
        <div>
            <div :class="inputClass">
                <div v-if="$slots.inputPrepend || inputPrepend" class="input-group-prepend">
                    <slot name="input-prepend">{{ inputPrepend }}</slot>
                </div>

                <slot name="input" :parent="this" :collection="collection">
                    <input ref="input" :type="inputType" :class="controlClass"
                        :placeholder="placeholder"
                        :aria-label="placeholder"
                        @focus="isFocus=true"
                        @blur="isFocus=false"
                        @input="oninput"
                        />
                </slot>

                <input type="hidden" :name="inputName" :value="selection" />

                <div v-if="$slots.inputAppend || inputAppend" class="input-group-append">
                    <slot name="input-append">{{ inputAppend }}</slot>
                </div>
            </div>
            <div class="">
                ${$pepr.comps.Container.options.template}
            </div>
        </div>
    `,

    props: {
        'idAttr': { type: String, default: 'pk' },
        'sortAttr': { type: String, default: 'pk' },
        'collectionUrl': { type: String },

        'inputName': { type: String },
        'inputValue': { type: String },
        'inputType': { type: String, default: 'search' },
        'inputClass': { type: String },
        'inputAppend': { type: String },
        'inputPrepend': { type: String },
        'controlClass': { type: String },
        'placeholder': { type: String },

        'lookupParam': { type: String, default: 'q' },

        'listStyle': { type: String },
        'maxItems': { type: Number, default: 10 },
    },

    data() {
        return {
            lookup: '',
            selection: '',
            isFocus: false,
        }
    },

    methods: {
        oninput(event) {
            var payload = { query: {} };
            payload.query[this.lookupParam] = event.target.value;
            this.load(payload, true, false);
        }
    }

});

