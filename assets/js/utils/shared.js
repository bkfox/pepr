import Drop from './drop';


/**
 * Provide shared pointer functionalities, with ownership explicitely acquired
 * and released.
 * Owners' `onDrop()` method will be called (if present) when the object is
 * dropped and there still are owners.
 */
export default class Shared extends Drop {
    constructor(data=null, {owner=null}={}) {
        super();

        this.data = data;
        if(owner !== null)
            this.acquire(owner)
    }

    /**
     * Return a read reference to owners. It is ensured to always return an
     * array.
     */
    get owners() {
        return this._owners || [];
    }

    /**
     * Return True if given owner has acquired this item.
     */
    hasOwner(owner) {
        return this._owners && this.owners.includes(owner);
    }

    /**
     * Acquire the object by the owner, and return the owner.
     */
    acquire(owner) {
        if(!this._owners)
            this._owners = [owner];
        else if(this._owners.indexOf(owner) == -1)
            this._owners.push(owner);
        return owner;
    }

    /**
     * Release and drop if required object from owner. Return True if the
     * object is has been dropped.
     */
    release(owner) {
        const index = this._owners.indexOf(owner);
        if(index >= 0)
            this._owners.splice(index, 1);
        else console.warn('object not acquired by owner.\nShared:', shared,
                          '\nOwner:', owner);
        if(!this._owners)
            this.drop();
        return !Boolean(this._owners);
    }

    drop() {
        if(this._owners)
            for(const owner of this._owners)
                if(owner.onDrop && typeof owner.onDrop == 'function')
                    owner.onDrop(this);

        if(this.data && this.data instanceof Drop)
            this.data.drop();

        super.drop();

        this.data = null;
        delete this._owners;
    }
}

