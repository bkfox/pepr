
/**
 * Ensure data is an instance of the provided model.
 */
export function as(model, data) {
    return data instanceof model ? data : new model(data);
}

/**
 * Merge `source` store options into `dest` and return this one. If `getKey(k)`
 * is provided, use it to generate items' keys in getters, mutations, etc.
 * Source's items can be methods that then will be called to retrieve the actual
 * values.
 *
 * @param {Object} dest: object to update
 * @param {Object} source: object merged into `dest`
 * @param {function(k)} getKey: items' key generator.
 */
export function mergeStores(dest, source, getKey=null) {
    // merge entity with provided store. if `getKey` is provided,
    // use it to generate items' keys in resulting getters, mutations,
    // and actions.
    for(let x of ['state', 'getters','mutations','actions']) {
        if(!source[x])
            continue;

        let items = source[x];
        if(items instanceof Function)
            items = items.call(source)

        if(getKey)
            items = Object.keys(items).reduce((map, key) => {
                map[getKey(key)] = items[key];
                return map;
            }, {})
        dest[x] = {...dest[x], ...items};
    }
    return dest;
}


