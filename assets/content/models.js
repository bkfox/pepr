import { Owned } from 'pepr/core/models'
export { Context, Subscription } from 'pepr/core/models'


export class Content extends Owned {
    static get entity() { return 'contents' }

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


