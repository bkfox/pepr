import { Owned, Context, Subscription as BaseSubscription } from 'pepr/core/models'


export class Container extends Context {
    static get entity() { return 'contexts' }
    static get contextModel() { return Container }

    static fields() {
        return { ...super.fields(),
            description: this.string(null),
        }
    }
}

export class Subscription extends BaseSubscription {
    static get contextModel() { return Container }
}

export class Content extends Owned {
    static get entity() { return 'contents' }
    static get contextModel() { return Container }

    static fields() {
        return { ...super.fields(),
            text: this.string(null),
            html: this.string(null),
            created: this.attr(null),
            modified: this.attr(null),
            modifier: this.attr(null),
            meta: this.attr(null),
        }
    }

    get createdDate() {
        return this.created && new Date(this.created)
    }

    get modifiedDate() {
        return this.modified && new Date(this.modified)
    }
}


