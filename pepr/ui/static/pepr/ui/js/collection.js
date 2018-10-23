
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
     * Add a given item in the collection.
     */
    add(item, sort=true) {
        this.items.push(item);
        if(sort)
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
        var v = this.items.findIndex(function(a) {
            return a[attr] == item[attr];
        });
        return v;
    }

    /**
     * Sort items array
     */
    sort() {
        var attr = this.sortAttr;
        this.items.sort(function(a,b) {
            return attr ? a[attr] < b[attr] : a < b;
        });
    }
}

/**
 *  VueJS Component that handles a collection.
 */
$pepr.comps.Collection = Vue.component('pepr-collection', {
    template: `
        <div>
            <slot></slot>
            <pepr-dynamic v-for="item in collection.items"
                :html="item.html" :elm="item.elm"
                :key="this.idAttr" :data="item">
                <i>{{ item.pk }}: {{ item.text }}</i>
            </pepr-dynamic>
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
        'sortAttr': { type: String, default: 'modDate', },
    },
    data: function() {
        return {
            collection: new Collection(this.idAttr, this.sortAttr),
        };
    },
    methods: {
        /**
         * Extract items from slot
         */
        to_collection(slot) {
            if(slot.length == 0)
                return;

            for(var i in slot) {
                var elm = slot[i].elm;
                var id = elm && elm.dataset && elm.dataset.id;
                if(!id)
                    continue;

                var data = elm.querySelector(`script[id="${id}"]`);
                try {
                    data = JSON.parse(data.textContent);
                    data.elm = elm;
                    data.created_date = Date.parse(data.created_date);
                    data.mod_date = Date.parse(data.mod_date);

                    this.collection.add(data, false);
                }
                catch {}

                elm.parentNode.removeChild(elm);
            }

            this.collection.sort();
        }
    },
    mounted: function() {
        this.to_collection(this.$slots.default);
    },
    beforeDestroy: function() {
        this.coll.unsubscribe();
    },
});


