
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

    trigger(context, item, ...args) {
        let role = context && context.role
        if(role && this.isGranted(role, item))
            this.exec(item, ...args)
    }
}


