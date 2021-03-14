import { Owned } from './models'


export default class Action {
    constructor(name, permissions, exec=null) {
        this.name = name
        this.permissions = Array.isArray(permissions) ? permissions : [permissions]
        if(exec)
            this.exec = exec
    }

    isGranted(role, item) {
        return role.isGranted(this.permissions, item)
    }

    trigger(item, ...args) {
        let role = item.context && item.context.role
        if(role && this.isGranted(role, item))
            this.exec(item, ...args)
    }
}


