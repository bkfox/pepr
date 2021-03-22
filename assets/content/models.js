import { Context, Owned, Subscription } from 'pepr/core/models'


export class Content extends Owned {
    static get entity() { return 'content' }
    static get baseURL() { return '/pepr/content/content/' }

    static fields() {
        return { ...super.fields(),
            text: this.string(''),
            html: this.string(''),
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


const defaults = { Content }
export default defaults


