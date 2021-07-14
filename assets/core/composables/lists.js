import { computed, reactive, watch } from 'vue'

import { makeProps } from './utils'


export const filters = {
    eq: (x, y) => x == y,
    gt: (x, y) => x > y,
    gte: (x, y) => x >= y,
    lt: (x, y) => x < y,
    lte: (x, y) => x <= y,
    in: (x, y) => y.indexOf(x) != -1,
    isnull: (x, y) => y ? (x === null || x === undefined)
                        : (x !== null && x !== undefined),
    startswith: (x, y) => x.startswith(y),
    endswith: (x, y) => x.endswith(y),
}

export class Filter {
    constructor(key, value) {
        let path = key.split('__')
        let last = path.length > 1 && path[path.length-1]
        if(last && filters[last])
            path = path.slice(0, filters.length-1)
        else
            last = 'eq'

        this.path = path
        this.pred = filters[last]
        this.value = value
    }

    test(left) {
        for(const p of this.path) {
            if(left === undefined)
                return false
            left = left[p]
        }
        const right = (this.value instanceof Function && this.value(left)) || this.value
        return this.pred(left, right)
    }
}

export class Filters {
    constructor(filters=null) {
        this.set(filters, true)
    }

    get length() {
        return this._length
    }

    test(value) {
        for(let filter of Object.values(this.all))
            if(!filter.test(value))
                return false
        return true
    }

    urlParams(params=null) {
        params = new URLSearchParams()
        for(let [key, filter] of Object.entries(this.all))
            params.set(key, filter.value)
        return params
    }

    set(filters, reset=false) {
        if(!this.all || reset)
            [this.all, this._length] = [{}, 0]

        if(filters)
            for(let [key, filter] of Object.entries(filters))
                this.all[key] = new Filter(key, filter)

        this._length = filters ? Object.keys(filters).length : 0
    }

    setValues(values) {
        for(let [key, value] of Object.entries(values))
            if(this.all[key])
                this.all[key].value = value
    }
}



export function getList({model, filters, orderBy=null}) {
    const listFilters = new Filters(filters.value)
    const listQuery = computed(() => {
        if(!model.value)
            return null

        const ob = orderBy && orderBy.value ? orderBy.value.startsWith('-')
                                            ? [orderBy.value.slice(1), 'desc']
                                            : [orderBy.value, 'asc']
                                            : null
        let query = model.value.query()
        if(listFilters.length)
            query = query.where(x => listFilters.test(x))
        if(ob)
            query = query.orderBy((obj) => obj[ob[0], ob[1]])
        return query
    })
    const list = computed(() => {
        return listQuery.value && listQuery.value.get()
    })

    watch(filters, (v) => listFilters.set(v, true))
    return {model, filters, orderBy, list, listFilters, listQuery}
}


getList.props = makeProps({
    filters: { type: Object, default: null },
    orderBy: { type: String, default: '' },
})


export function fetchList({model, listFilters, url=null}) {
    const pagination = reactive({
        count: null, next: null, prev:null
    })

    function fetch({filters=null, ...config}={}) {
        if(listFilters.length) {
            if(filters)
                listFilters.setValues(filters)
            config.urlParams = listFilters.urlParams()
        }
        if(!config.url && url && url.value)
            config.url = url.value

        return model.value.fetch({ ...config }).then(r => {
            const data = r.response.data
            pagination.count = data.count
            pagination.next = data.next
            pagination.prev = data.prev
            return r
        })
    }

    function fetchNext({...config}) {
        return pagination.next ? fetch({...config, url: pagination.next})
                               : new Promise((resolve) => resolve(null))
    }

    function fetchPrev({...config}) {
        return pagination.prev ? fetch({...config, url: pagination.prev})
                               : new Promise((resolve) => resolve(null))
    }

    return { url, pagination, fetch, fetchNext, fetchPrev }
}

fetchList.props = makeProps({
    url: { type: String, default: null },
})

