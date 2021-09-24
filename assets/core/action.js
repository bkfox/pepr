
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
    constructor({label, exec=null, permissions=null, icon='',
                 help='', css=''}={})
    {
        this.label = label
        this.permissions = Array.isArray(permissions) ? permissions :
                                permissions ? [permissions] : null
        this.exec = exec
        this.icon = icon
        this.help = help
        this.css = css
    }

    isGranted(role, item) {
        return this.permissions ? item.isGranted(role, ...this.permissions) : true
    }

    trigger(role, item, ...args) {
        if(role && this.exec && this.isGranted(role, item))
            this.exec(item, ...args)
    }
}


