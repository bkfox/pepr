import { Model } from '@vuex-orm/core'


export class Base extends Model {
    static fields() {
        return {
            api_url: this.string(null),
            access: this.number(null),
        }
    }
}


export class Context extends Base {
    static entity = 'context'

    static fields() {
        return { ...super.fields(),
            role: this.attr(null),
            allow_subscription_request: this.attr(null),
            subscription_default_access: this.number(null),
            subscription_default_role: this.number(null),
            subsciption: this.attr(null),
            subsciptions: this.hasMany(Subscription, 'context'),
        }
    }
}


export class Accessible extends Base {
    static entity = 'accessible'

    static fields() {
        return { ...super.fields(),
            context: this.attr(null),
        }
    }
}

export class Owned extends Accessible {
    static entity = 'owned'

    static fields() {
        return { ...super.fields(),
            owner: this.attr(null),
        }
    }
}

export class Subscription extends Owned {
    static entity = 'subscription'

    static fields() {
        return { ...super.fields(),
            status: this.number(),
            access: this.number(),
            role: this.number(),
        }
    }
}


