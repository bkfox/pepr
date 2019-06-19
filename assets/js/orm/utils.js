/** @module orm/utils **/


/**
 * @param value - value to test
 * @return {Boolean} true if value is an iterable, false otherwise
 */
export function iterable(value) {
    return value !== null && value[Symbol.iterator] instanceof Function;
}

/**
 *
 * @callback chainReduceCallback
 * @param results - an array of functions results
 * @returns value returned by the chaining function.
 * @see module:orm/utils.chainCalls
 */
/**
 * Return a function that chains calls to sources and return their results reduced
 * by `reduce`; or `chain` if it is already a chain with the same `reduce`.
 *
 * @param {chainReduceCallback} reduce - handle results and provide chain results
 * @param {Function=} chain - chain function
 * @param {Function|value} ...sources - source functions or values
 * @return the resulting chain function.
 */
export function chainCalls(reduce, source, ...sources) {
    if(source._chain && source._reduceChain == reduce) {
        source._chain = new Set([...source._chain, ...sources])
        return source;
    }

    function inner(...args) {
        var results = [];
        for(var source of inner._chain)
            results.push(source instanceof Function ? source(...args) : source);
        return reduce(results);
    }
    inner._chain = new Set([source, ...sources]);
    inner._reduceChain = reduce;
    return inner;
}


/**
 * @callback renameAttrsCallback
 * @param {String} key - attribute name
 * @param value - attribute value
 * @returns {String} new attribute name
 * @see module:orm/utils.renameAttrs
 */
/**
 * Copy source's attributes to target renamed using provided callback.
 * @param {Object} targe - object to copy renamed attributes into
 * @param {Object} source - object to copy attributes from
 * @param {renameAttrsCallback} callback - callback
 * @returns target
 */
export function renameAttrs(target, source, callback) {
    for(var [key, value] in Object.entries(source))
        target[callback(key, value)] = value;
    return target;
}



/**
 * Multiple sources object into the provided target and return it.
 * Merged elements: state, getters, mutations, actions
 *
 * @param {Object} target - Vuex store options to update
 * @param {Object} ...sources - object merged into `target`
 * @return {Object} the updated target
 */
export function mergeStores(target, ...sources) {
    if(!sources.length)
        return target || {};

    // get attributes from target and sources when they exists
    function getAttrs(key) {
        return sources.reduce((a, source) => (!source || !source[key] || a.push(source[key])) && a,
                              target[key] ? [target[key]] : [])
    }

    // states are merged into a single object
    let attrs = getAttrs('state');
    if(attrs)
        target.state = attrs.length > 1 ? chainCalls(r => Object.assign(...r), ...attrs)
                                        : attrs[0];

    for(let key of ['getters', 'mutations', 'actions']) {
        attrs = getAttrs(key);
        if(attrs.length && attrs instanceof Array)
            target[key] = Object.assign(...attrs);
    }
    return target;
}


