import { Context, Owned, Subscription } from 'pepr/core/models'


export class Container extends Context {
    static get entity() { return 'container' }
    static get baseURL() { return '/pepr/content/container/' }

    static fields() {
        return { ...super.fields(),
            title: this.string(''),
            headline: this.string(''),
        }
    }
}


export class Content extends Owned {
    static get entity() { return 'content' }
    static get contextEntity() { return 'container' }
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


export default { Subscription, Container, Content }

