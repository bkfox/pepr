/**
 *  Provides selection on a list.
 */
$pepr.comps.Selector = Vue.component('pepr-selector', {
    template: `
        <span>
            <slot name="selected" v-if="collection && selectedLabel"
                :view="view" :value="selectedValue" :label="selectedLabel">
            </slot>
        </span>
    `,

    props: {
        /**
         * @type {String} itemLabelAttr [property] defines an attribute on items
         * used as selection's display value.
         */
        labelAttr: { type: String, default: null },
        /**
         * @type {String} itemValueAttr [property] defines an attribute on items
         * used as value for selections in form input.
         */
        valueAttr: { type: String },
        /**
         * @type {String} selectKey [property] ``event.key`` that triggers the selection
         * of an item.
         */
        selectKey: { type: String, default: 'Space' },
        /**
         * @type {CollectionView} view [property]
         */
        view: { type: Object, default: null },
    },

    data() {
        return {
            active: null,
            selected: null,
        }
    },

    computed: {
        collection() {
            return this.view && this.view.collection;
        },

        selectedValue() {
            return this.itemAttr(this.selected, this.valueAttr);
        },
        selectedLabel() {
            return this.itemAttr(this.selected, this.labelAttr);
        },

        activeValue() {
            return this.itemAttr(this.active, this.valueAttr);
        },
        activeLabel() {
            return this.itemAttr(this.active, this.labelAttr);
        },
    },

    methods: {
        /**
         * Return item's attribute of given cursor if any
         */
        itemAttr(cursor, attr) {
            return attr && cursor && cursor.some && cursor.item[attr];
        },

        /**
         * Called to set attribute on cursor's item to the given value. It is used
         * to keep track of multiple cursors: "active", "selected", etc.
         */
        __triggerItemEvent(cursor, event) {
            var comp = this.view.getComponent(cursor.index);
            if(comp)
                this.$emit(event, { selector: this, target: comp, cursor: cursor });
        },

        /**
         * Move cursor to index, component[attr] will be set to true if cursor targets
         * it, and false otherwise.
         *
         * Emits event `event` if given, `{ target: itemComponent, cursor: cursor }`.
         */
        seek(cursor, index, attr='', event='', cancelEvent='', callback=null) {
            if(cancelEvent)
                this.__triggerItemEvent(cursor, cancelEvent);

            if(callback)
                callback.call(this, cursor, index)
            else if(index !== null)
                cursor.seek(index);

            if(event)
                this.__triggerItemEvent(cursor, event);
        },

        /**
         * Select item at given index.
         */
        select(index=null, callback=null) {
            index = index === null ? this.active.index : index;
            this.seek(this.selected, index, 'selected', 'selected', 'unselect', callback);
        },

        /**
         * Unselect currently selected item.
         */
        unselect() {
            this.seek(this.selected, -1, 'selected', 'unselected');
        },

        /**
         * Focus item at given index.
         */
        focus(index=null, callback=null) {
            index = index === null ? this.active.index : index;
            this.seek(this.active, index, 'active', 'focus', 'blur', callback);
        },

        /**
         * Loose focus of active item.
         */
        blur() {
            this.seek(this.active, -1, 'active', 'blur');
        },

        /**
         *  Handle key event for moving around and select an item. Return
         *  true if the event has been taken care of.
         */
        keyEvent(event) {
            switch(event.key) {
                // selection
                case this.selectKey:
                    if(this.active.some)
                        this.select(this.active.index);
                    break;
                // escape
                case 'Escape':
                    this.active.reset();
                    break;
                // moves
                case 'ArrowDown':
                    this.focus(null, (cursor, index) => cursor.next(1, true));
                    break;
                case 'ArrowUp':
                    this.focus(null, (cursor, index) => cursor.prev(1, true));
                    break;
                default:
                    return false;
            }

            event.preventDefault();
            event.stopPropagation();
            return true;
        },

        viewChanged(view) {
            var view_ = this.active && this.active.co
        },
    },

    mounted() {
        var fn = (view) => {
            this.active = new Cursor(view.collection);
            this.selected = new Cursor(view.collection);
        };

        if(this.view)
            fn(this.view);

        this.$watch(() => this.view, fn);
    }

    // TODO: watcher over cursors?
});


