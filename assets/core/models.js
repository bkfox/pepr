import { Model } from '@vuex-orm/core'


export class Base extends Model {
    static get primaryKey() { return 'pk' }

    static fields() {
        return {
            pk: this.string(null),
            api_url: this.string(null),
            access: this.number(null),
        }
    }
}


export class Context extends Base {
    static get entity() { return 'contexts' }

    static fields() {
        return { ...super.fields(),
            role: this.attr(null),
            allow_subscription_request: this.attr(null),
            subscription_default_access: this.number(null),
            subscription_default_role: this.number(null),
            // subsciption: this.attr(null),
            subsciptions: this.hasMany(Subscription, 'context'),
        }
    }
}


export class Accessible extends Base {
    static get entity() { return 'accessibles' }
    static get contextModel() { return Context }

    static fields() {
        return { ...super.fields(),
            context_id: this.attr(null),
            context: this.belongsTo(this.contextModel, 'context_id'),
        }
    }
}

export class Owned extends Accessible {
    static get entity() { return 'owneds' }

    static fields() {
        return { ...super.fields(),
            owner_id: this.attr(null),
            owner: this.belongsTo(this.contextModel, 'owner_id'),
        }
    }
}

export class Subscription extends Owned {
    static get entity() { return 'subscriptions' }

    static fields() {
        return { ...super.fields(),
            status: this.number(),
            access: this.number(),
            role: this.number(),
        }
    }
}


