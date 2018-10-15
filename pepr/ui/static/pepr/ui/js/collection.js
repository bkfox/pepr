
/**
 *  Store and manage items objects.
 */
class Collection {
    constructor(idAttr, sortAttr=null, items=null) {
        /**
         *  Item's attribute to use as object unique identifier.
         *  @type {String}
         */
        this.idAttr = idAttr;
        /**
         *  Item's attribute to use to sort items
         *  @type {String}
         */
        this.sortAttr = sortAttr;
        /**
         *  The actual list of items
         *  @type {Array}
         */
        this.items = items || [];
    }

    /**
     * Add a given item in the collection
     */
    add(item) {
        this.items.push(item);
        this.sort();
    }

    /**
     * Update an item in collection.
     */
    update(item) {
        var index = this.index_of(item);
        if(index == -1)
            return this.add(item);

        this.items.splice(index, 1, item);
        this.sort();
    }

    /**
     * Delete an item from collection
     */
    remove(item) {
        var index = this.index_of(item);
        if(index != -1)
            this.items.splice(index, 1);
    }

    /**
     * Clean up the entire collection.
     */
    reset() {
        this.items = {};
    }

    /**
     * Return item's index in collection
     */
    index_of(item) {
        var attr = this.idAttr;
        return this.items.findIndex(function(a) {
            return a[attr] == item[attr];
        });
    }

    /**
     * Sort items array
     */
    sort() {
        var attr = this.sortAttr;
        this.items.sort(function(a,b) {
            return (attr && a[attr] < b[attr]) || a < b;
        });
    }

    /**
     * Extract an item from DOM element. Item attributes will be set to
     * dataset values. Skip if the id attribute is not present.
     */
    extract(elm) {
        var index = elm && elm.dataset && elm.dataset[this.idAttr];
        if(!index)
            return;

        var item = elm.dataset;
        item.html = elm.innerHTML;
        this.add(item);
        return item;
    }

}


/**
 *  VueJS Component that handles a collection.
 */
$pepr.comps.Collection = Vue.component('pepr-collection', {
        template: `
            <div>
                <slot></slot>
                <div v-for="item in collection.items" v-html="item.html"></div>
                <slot name="bottom"></slot>
            </div>
        `,
        props: {
            /**
             * Collection's idAttr.
             */
            'idAttr': { type: String, default: 'pk', },
            /**
             * Collection's sortAttr
             */
            'sortAttr': { type: String, default: 'modBy', },
        },
        data: function() {
            return {
                collection: new Collection(this.idAttr, this.sortAttr),
            };
        },
        methods: {
            /**
             * Extract items from slot using `Collection.extract`.
             */
            to_collection(slot) {
                if(slot.length == 0)
                    return;

                for(var i in slot) {
                    var elm = slot[i];
                    elm = elm.elm;
                    if(this.collection.extract(elm))
                        elm.parentNode.removeChild(elm);
                }
            }
        },
        mounted: function() {
            this.to_collection(this.$slots.default);
            // this.coll.init($pepr.connection, this.stream, this.context);
        },
        beforeDestroy: function() {
            this.coll.unsubscribe();
        },
    });


