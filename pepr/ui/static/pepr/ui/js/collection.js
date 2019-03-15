
/**
 *  Collection of unique objects.
 */
class Collection extends Emitter {
    constructor(idAttr, sortAttr=null, items=null) {
        super();

        /**
         *  Item's attribute to use as object unique identifier.
         *  @type {String}
         */
        this.idAttr = idAttr;
        /**
         *  Item's attribute to use to sort items. If it starts with a
         *  dash '-', reverse order.
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
     *  Number of items in the collection.
     */
    get length() {
        return this.items.length;
    }

    /**
     * Splice collection.
     */
    splice(index, deleteCount) {
        var r = this.items.splice.apply(this.items, arguments);
        this.emit('splice', { index: index, deleteCount: deleteCount,
                              count: arguments.length-2 });
        return r;
    }

    /**
     * Add a given item in the collection.
     */
    add(item) {
        this.items.push(item);
        this.emit('splice', { index: this.items.length-1, count: 1 });
    }

    /**
     * Update an item in collection. Can be used to ensure item
     * is stays unique.
     */
    update(item) {
        var index = this.indexOf(item);
        if(index == -1)
            return this.add(item);
        this.splice(index, 1, item);
    }

    /**
     * Delete an item from collection
     */
    remove(item) {
        var index = this.indexOf(item);
        if(index != -1)
            this.splice(index, 1);
    }

    /**
     * Clean up the entire collection.
     */
    reset() {
        this.items = [];
    }

    /**
     * Return item's index in collection or -1.
     */
    indexOf(item) {
        var attr = this.idAttr;
        if(!attr)
            return this.items.indexOf(item);
        return this.items.findIndex(function(a) {
            return a[attr] == item[attr];
        });
    }

    /**
     * Sort items array
     */
    /*sort() {
        var attr = this.sortAttr;
        if(attr[0] == '-') {
            attr = attr.slice(1);
            this.items.sort(function(a,b) {
                return attr ? a[attr] > b[attr] : a > b;
            });
        }
        else
            this.items.sort(function(a,b) {
                return attr ? a[attr] < b[attr] : a < b;
            });
    }*/
}


$pepr.comps.CollectionItem = Vue.component('pepr-collection-item', {
    template: `
        <div :class="computedClass"
            @click="toggleSelect()" @mouseover="focus()">
            <slot :item="item" :list="list"
                :active="active" :selected="selected">
                <p-content :elm="item.elm" :html="item.html"></p-content>
            </slot>
        </div>
    `,

    props: {
        item: { type: Object, default: null },
        index: { type: Number },
        itemClass: { type: String, default: 'list-group' },
        activeClass: { type: String, default: 'active' },
        selectedClass: { type: String, default: 'list-group-item-primary' },
    },

    computed: {
        view() {
            return this.$parent;
        },

        selector() {
            return this.view && this.view.selector;
        },

        computedClass() {
            var extra = this.active ? ' ' + this.activeClass :
                        this.selected ? ' ' + this.selectedClass: '';
            return this.itemClass + extra;
        },

        active() {
            return this.selector && this.index == this.selector.active.index
        },

        selected() {
            return this.selector && this.index == this.selector.selected.index
        },
    },

    methods: {
        toggleSelect() {
            this.selected ? this.unselect() : this.select();
        },

        select() { this.selector && this.selector.select(this.index); },
        unselect() { this.selector && this.selector.unselect(this.index); },
        focus() { this.selector && this.selector.focus(this.index); },
        blur() { this.selector && this.selector.blur(this.index); },
    },
})


/**
 *  VueJS Component that handles a collection.
 */
$pepr.comps.CollectionView = Vue.component('pepr-collection', {
    template: `
        <div :class="listClass" ref="list">
            <slot name="before"></slot>

            <div ref="list">
                <pepr-collection-item v-for="(item, index) in collection.items"
                    ref="items" :key="item[idAttr]"
                    :hidden="filter && !filter(item)"
                    :index="index" :item="item"
                    :item-class="itemClass"
                    >
                    <slot name="item" :collection="collection" :item="item" :index="index">
                    </slot>
                </pepr-collection-item>
            </div>

            <slot></slot>

            <slot name="after"></slot>
        </div>
    `,

    props: {
        /**
         * @type {String} idAttr [property] Collection's idAttr.
         */
        idAttr: { type: String, default: 'pk' },
        /**
         * @type {String} sortAttr [property] Collection's sortAttr
         */
        sortAttr: { type: String, default: 'pk' },
        /**
         * @type {String} listClass [property] List class
         */
        listClass: { type: String, default: 'list-group' },
        /**
         * @type {String} itemClass [property] Item class
         */
        itemClass: { type: String, default: 'list-group' },
        /**
         * @type {Selector} selector [property]
         */
        selector: { type: Object, default: null },
    },

    data: function() {
        return {
            collection: new Collection(this.idAttr, this.sortAttr),
            filter: null,
        };
    },

    methods: {
        /**
         * Return component at given the index
         */
        getComponent(index) {
            return index > -1 ? this.$refs.items[index] : null;
        },

        /**
         * Extract items from the given slot's elements.
         */
        toCollection(slot) {
            if(!slot || slot.length == 0)
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
                    this.collection.add(data);
                }
                catch(e) {
                    console.log(e);
                }

                elm.parentNode && elm.parentNode.removeChild(elm);
            }

            // this.collection.sort();
        }
    },

    mounted() {
        this.toCollection(this.$slots.default);
    },
});


