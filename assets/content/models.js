import * as models from 'pepr/core/models'


export class Container extends models.Context {
    static get entity() { return 'container' }
    static get url() { return '/pepr/content/container/' }

    static fields() {
        return { ...super.fields(),
            title: this.string(''),
            headline: this.string(''),
        }
    }
}


export class Content extends models.Owned {
    static get entity() { return 'content' }
    static get contextEntity() { return 'container' }
    static get url() { return '/pepr/content/content/' }

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


export class Subscription extends models.Subscription {
    static get contextEntity() { return 'container' }
}

export default { Subscription, Container, Content }

