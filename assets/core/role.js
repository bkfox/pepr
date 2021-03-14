import { Owned } from './models'

export default class Role {
    constructor(data) {
        for(let key in data)
            this[key] = data[key]
    }

    isGranted(permissions, item) {
        if(!this.permissions)
            return false
        if(item instanceof Owned && this.identity == item.owner)
            return true

        for(var name of permissions)
            if(!this.permissions[name])
                return false
        return true
    }
}

