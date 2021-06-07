
/**
 * Return function used to add properties related to a composable to a
 * component, as `function(override) -> {...props}`.
 *
 * Where `override` is a dict of properties default values/overriding object.
 *
 */
export function makeProps(source) {
    function func(override={}) {
        var props = {}
        for(var key in source) {
            var oitem = override[key]
            var sitem = source[key]
            if(!(oitem instanceof Object))
                oitem = { default: oitem }

            // TODO: sitem array? => type: sitem
            props[key] = {...source[key], ...oitem}
        }
        return props
    }
    return func
}
