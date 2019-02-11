/**
 * Collection that is synchronized to the server with API requests.
 */
class BoundCollection extends Collection {
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


$pepr.comps.BoundCollectionView = Vue.component('pepr-bound-collection', {
    extends: $pepr.comps.CollectionView,

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
            collection: new BoundCollection(this.idAttr, this.sortAttr),
            connection: undefined,
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

            var req = this.collection.load(this.itemsUrl, payload, reset);
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
        // TODO: handle changes in collectionUrl && itemsUrl
        if(this.observe)
            this.collection.bind(this.collectionUrl, this.itemsUrl);
    }
});


// TODO:
// - selector hiding & show + switch with input
// - selector show: ensure it is on selectedItem
// - initial value in input
// - default list (when no result shown)
//
// - slot-scope: parent
// - item unselect/select/focus/blur => on collection: call selector.select/focus
// - initial value + list (as active & selected item)
// - follow active item
$pepr.comps.Typeahead = Vue.component('pepr-typeahead', {
    template: `
        <div class="position-relative">
            <div :class="inputClass">
                <slot name="input" :parent="this" :collection="collection"
                    :value="selectedValue" :label="selectedLabel">
                    <input ref="input" :type="inputType" :class="controlClass"
                        :placeholder="placeholder"
                        :aria-label="placeholder"
                        @blur="onInputBlur" @focus="onInputFocus"
                        @keyup="onInputUp" @keydown="onInputDown"
                        />
                </slot>
            </div>
            <pepr-selector ref="selector"
                :view="$refs.collection" :value-attr="itemValueAttr" :label-attr="itemLabelAttr"
                select-key="Enter"
                @selected="onSelect"
                >
                <template slot="selected" slot-scope="{view,value,label}">
                    <input type="hidden" :name="inputName" :value="value" />
                </template>
            </pepr-selector>
            <slot name="collection">
                <pepr-bound-collection ref="collection" selectable
                    :class="computedListClass" :max-items="maxItems"
                    :selector="$refs.selector"
                    :items-url="itemsUrl" :collection-url="collectionUrl"
                    :item-class="itemClass"
                    :hidden="!hasFocus"
                    >
                    <template slot="before" slot-scope="{parent, view}">
                        <slot name="before" :parent="parent" :view="view"></slot>
                    </template>

                    <template slot="item" slot-scope="{parent, view, item}">
                        <slot name="item" :parent="parent" :view="view" :item="item"></slot>
                    </template>

                    <template slot="after" slot-scope="{parent, view}">
                        <slot name="after" :parent="parent" :view="view"></slot>
                    </template>
                </pepr-bound-collection>
            </slot>
        </div>
    `,

    props: {
        lookupParam: { type: String, default: null },
        itemValueAttr: { type: String, default: 'value' },
        itemLabelAttr: { type: String, default: 'text' },

        inputName: { type: String },
        inputValue: { type: String },
        inputType: { type: String, default: 'search' },
        inputClass: { type: String },
        controlClass: { type: String, default: 'form-text form-control' },
        placeholder: { type: String },

        collectionUrl: { type: String },
        itemClass: { type: String, default: 'list-group-item list-group-item-action' },
        itemsUrl: { type: String },
        listClass: { type: String, default: 'list-group' },
        listFloat: { type: Boolean },
        maxItems: { type: Number, default: 10 },
    },

    data() {
        return {
            lookup: '',
            focus: null,
            collection: null,
            hasFocus: false,
        }
    },

    computed: {
        computedListClass() {
            return this.listClass + (this.listFloat ? ' position-absolute shadow' : '')
        },

        selectedValue() {
            return this.$refs.selector && this.$refs.selector.selectedValue;
        },

        selectedLabel() {
            return this.$refs.selector && this.$refs.selector.selectedLabel;
        },
    },

    methods: {
        onInputDown(event) {
            if(this.$refs.selector)
                this.$refs.selector.keyEvent(event);
            if(event.key == 'Escape')
                this.hasFocus = false;
        },

        onInputUp(event) {
            var value = event.target.value;
            if(this.lookup && (this.lookup == value || value == this.selectedLabel))
                return;

            this.lookup = event.target.value;
            var payload = { query: {} };
            payload.query[this.lookupParam] = this.lookup;
            this.$refs.collection.load(payload, true, false);
        },

        onInputFocus(event) {
            if(this.selectedValue)
                event.target.value = this.selectedLabel
            this.hasFocus = true;
        },

        onInputBlur(event) {
            this.hasFocus = false;
        },

        onLabelFocus(event) {
            this.$refs.input && this.$refs.input.focus();
        },

        onSelect(event) {
            this.$refs.input.value = event.selector.selectedLabel;
            this.$refs.input.select();
        },

        // move those event handling to selector
        onItemFocus(event) { this.$refs.selector && this.$refs.selector.focus(event.index); },
        onItemBlur(event) { this.$refs.selector && this.$refs.selector.blur(); },
        onItemSelect(event) { this.$refs.selector && this.$refs.selector.select(event.index); },
        onItemUnselect(event) { this.$refs.selector && this.$refs.selector.unselect(); },
    },

    beforeDestroy: function() {
        this.$refs.collection.unsubscribe();
    },
});

