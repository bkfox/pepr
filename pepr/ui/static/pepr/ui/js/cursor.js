
/**
 *  Cursor iterating over a Collection, that persists between Collection
 *  changes.
 */
class Cursor {
    /**
     *  Creates a new cursor
     *
     */
    constructor(collection=null, index=-1) {
        /**
         * @type {Collection} collection cursor over this collection.
         * @type {Number} index cursor current position in the collection.
         * @type {String} reverseAttr attribute on current item set to cursor.
         */
        var self=this;
        this.collection = collection;

        this.seek(index, false);
        /*this.collection.on('splice', function(event) {
            self.onSplice(event);
        });*/
    }

    /**
     *  True if cursor targets nothing
     */
    get none() {
        return !this.collection ||
               this.index == -1 || this.index > this.collection.length;
    }

    /**
     *  True if cursor targets an item
     */
    get some() {
        return this.index > -1 && this.index < this.collection.length;
    }

    get begin() {
        return this.collection.length ? 0 : -1;
    }

    get end() {
        return this.collection.items.length-1;
    }

    /**
     *  Current item targeted by the cursor.
     */
    get item() {
        return this.collection && this.collection.items[this.index];
    }

    /**
     *  Collection's items
     */
    get items() {
        return this.collection && this.collection.items;
    }

    /**
     *  Called when Collection is modified.
     */
    /*onSplice(event) {
        if(event.index >= this.index)
            return;
        // console.log(this.index, '<', event.index);
        this.seek(event.count - (event.deleteCount || 0), true);
    }*/

    /**
     *  Return a copy of this cursor (as distinct instance)
     */
    copy() {
        return new this.constructor(this.collection, this.index, this.reverseAttr)
    }

    /**
     *  Change collection to run over
     */
    rebase(collection) {
        this.collection = collection;
        this.seek(this.index);
    }

    /**
     *  Move to next items.
     */
    next(index=1, loop=false) {
        if(loop && this.index >= this.collection.length-1)
            this.seek(-1);
        else
            this.seek(index, true);

    }

    /**
     *  Move to previous items.
     */
    prev(index=1, loop=false) {
        // when we use prev, we don't expect unselection by having index set to `-1`
        // that's why this condition does check on loop.
        if(loop && this.none)
            this.seek(this.collection.length);
        else
            this.seek(-index, true);
    }

    /**
     *  Reset cursor to initial position. If `collection` is given, update this too.
     */
    reset(collection=null) {
        if(collection !== null)
            this.collection = collection;
        this.seek(-1);
    }

    /**
     *  Seek to given index. For relative move, it checks first if it has been
     *  moved.
     */
    seek(index, relative=false) {
        if(relative)
            index += this.index;
        // TODO: relative ? this.begin : -1 => implications in prev and next
        this.index = Math.max(-1, Math.min(index, this.end));
        return this.index;
    }

    /**
     *  Seek cursor to given item in the collection.
     *
     *  @return {Object|null} the found item if any.
     *
     */
    seek_to(item) {
        this.index = this.collection.indexOf(item);
        return this.index > -1 ? item : null;
    }
}

