
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
    constructor(name, label, exec=null, {icon='', permissions=null, raw=false, help='', css=''}={}) {
        this.name = name
        this.label = label
        this.permissions = Array.isArray(permissions) ? permissions : [permissions || name]
        this.exec = exec
        this.icon = icon
        this.help = help
        this.css = css
    }

    isGranted(role, item) {
        return item.isGranted(role, ...this.permissions)
    }

    trigger(role, item, ...args) {
        if(role && this.isGranted(role, item))
            this.exec(item, ...args)
    }
}


