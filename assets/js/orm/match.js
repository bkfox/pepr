
/**
 * Test if a value matches the provided lookup.
 *
 * Lookup predicate can be:
 * - Object: match all lookup's attributes against value's ones;
 * - Array: match at least one of the lookup against value;
 * - Function(value) -> Boolean: match using this function;
 * - other values: equality (==) test between lookup and value;
 *
 * @function
 * @param lookup - matching predicate
 * @param value - value to test
 * @return true if value matches to predicate, false otherwise.
 */
export default function match(lookup, value) {
    if(lookup instanceof Array) {
        for(let lookup_ of lookup) {
            if(match(lookup_, value))
                return true;
        }
        return false;
    }
    else if(lookup instanceof Function) {
        return lookup(value);
    }
    else if(lookup instanceof Object) {
        for(var attr in lookup) {
            if(!match(lookup[attr], value[attr]))
                return false;
        }
        return true;
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


