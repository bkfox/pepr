
/**
 * Interface class that provides a `drop()` method used as object destructor.
 */
export default class Drop {
    drop() {
        if(this.onDrop)
            this.onDrop();
    }
}

