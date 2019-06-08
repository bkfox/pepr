
/**
 * Test if a value matches the provided lookup. Lookup can be:
 *
 * - Object: match all lookup's attributes against value's ones;
 * - Array: match at least one of the lookup against value;
 * - Function(value) -> Boolean: match using this function;
 * - other values: equality (==) test between lookup and value;
 */
export function match(lookup, value) {
    if(lookup instanceof Object) {
        for(var attr in lookup) {
            if(!match(lookup[attr], value[attr]))
                return false;
        }
        return true;
    }
    else if(lookup instanceof Array) {
        for(let lookup in lookup) {
            if(match(lookup, value))
                return true;
        }
        return false;
    }
    else if(lookup instanceof Function) {
        return lookup(value);
    }
    return lookup == value;
}


/**
 * And combinator that can be used as match lookup.
 */
export function and(...lookups) {
    return value => {
        for(var lookup of lookups)
            if(!match(lookup, value))
                return false;
        return true;
    }
}


/**
 * Or combinator that can be used as match lookup.
 */
export function or(...lookups) {
    return value => {
        for(var lookup of lookups)
            if(match(lookup, value))
                return true;
        return false;
    }
}


