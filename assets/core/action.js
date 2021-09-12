
/**
 * Action available to user (checking on its permissions).
 *
 *
 * Use `name` as permission name when `permissions` is not provided.
 * Provided permissions' name exclude model's label prefix, as it is
 * provided by item at the permission check (this allows reuse of
 * actions instance accross models).
 */
export default class Action {
    constructor(name, label, exec=null, {icon='', permissions=null, raw=false, ...extra}={}) {
        this.name = name
        this.label = label
        this.permissions = Array.isArray(permissions) ? permissions : [permissions || name]
        this.exec = exec
        this.icon = icon
        this.extra = extra
    }

    isGranted(role, item) {
        const label = item && item.constructor.label
        const permissions = label && !this.raw ? this.permissions.map(x => `${label}.${x}`)
                                               : this.permissions
        return role.isGranted(permissions, item)
    }

    trigger(context, item, ...args) {
        let role = context && context.role
        if(role && this.isGranted(role, item))
            this.exec(item, ...args)
    }
}


