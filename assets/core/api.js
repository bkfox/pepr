import Cookies from 'js-cookie'


export function getSubmitConfig({url=null, data={}, form=null, ...config}) {
    url = url || form && form.getAttribute('action')

    if(!Object.keys(data).length)
        data = new FormData(form)
    else if(!(data instanceof FormData)) {
        const formData = new FormData()
        for(let key in data)
            formData.append(key, data[key])
        data = formData
    }

    config.method = config.method || form.getAttribute('method') || 'POST'
    config.headers = {...(config.headers || {}),
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': Cookies.get('csrftoken'),
    }
    return {...config, url, body: data}
}

/**
 * Submit data to server.
 */
export function submit({bodyType='json', ...config}) {
    const { url, ...config_ } = getSubmitConfig(config)
    return fetch(url, config_).then(
        r => r[bodyType]().then(d => {
            d = { status: r.status, data: d, response: r }
            if(400 <= d.status)
                throw(d)
            return d
        })
    )
}


class ApiPool {
    constructor() {
        this.pool = {}
    }

    onResponse(response, key=null) {
        if(key)
            delete this.pool[key];

        return response.json().then(data => {
            data = { status: response.status, data, response }
            if(400 <= data.status)
                throw(d)
            return data
        })
    }

    fetch(url, config, pool=false) {
        const key = pool ? url : null;
        if(!key || !this.pool[key]) {
            const fut = fetch(url, config)
            fut.then(r => this.onResponse(r, key))
            if(key)
                this.pool[key] = fut
            return [fut, true]
        }
        return [this.pool[key], false]
    }
}

class Api {
    constructor(model) {
        this.model = model;
    }

    get store() {
        return this.model.store()
    }

    get pool() {
        if(!this.store.apiPool)
            this.store.apiPool = new ApiPool()
        return this.store.apiPool
    }

    normConfig(url, {data={}, form=null, ...config}) {
        // TODO:
        // - multipart only on POST/PUT
        // - body vs data
        if(url && this.store.baseURL)
            url = `${this.store.baseURL}${url}`
        else if(!url && form)
            url = form.getAttribute('action')

        if(!Object.keys(data).length)
            data = form ? new FormData(form) : config.body
        else if(!(data instanceof FormData)) {
            const formData = new FormData()
            for(let key in data)
                formData.append(key, data[key])
            data = formData
        }

        config.method = config.method || form.getAttribute('method') || 'POST'
        config.headers = {...(config.headers || {}),
            'Accept': 'text/json',
            'Content-Type': 'multipart/form-data',
            'X-CSRFToken': Cookies.get('csrftoken'),
        }
        return {...config, url, body: data}
    }

    // TODO: handle delete
    fetch(url, {pool=false, commit=false, ...config}={}) {
        ({url, ...config} = this.normConfig(config))
        const [fut, created] = this.pool.fetch(url, config, pool)
        if(created && commit)
            fut.then(({ data, status }) => {
                if(200 <= status <= 400)
                    this.model.insertOrUpdate({data})
            })
        return fut
    }

    get(url, config) {
        return this.fetch(url, {method: 'GET', pool: true, commit: true, ...config})
    }

    head(url, config) {
        return this.fetch(url, {method: 'HEAD', pool: true, ...config})
    }

    post(url, config) {
        return this.fetch(url, {method: 'POST', commit: true, ...config})
    }

    put(url, config) {
        return this.fetch(url, {method: 'PUT', commit: true, ...config})
    }

    delete(url, config) {
        return this.fetch(url, {method: 'DELETE', ...config})
    }
}


