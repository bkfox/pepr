import Cookies from 'js-cookie'


/**
 * Provide methods to make API calls with a request pool (per store if provided).
 *
 * # Available config options:
 * - pool: use request pool (return awaiting request if any)
 * - params: URLSearchParams to add to url
 * - data: model instance or data to send (converted into request's body)
 * - form: use form data and 'action'/'method' (if none provided)
 * - dataKey: key to extract response data
 * - commit: update model's store with response data
 */
export default class Api {
    constructor(model, {store=null, ...config}={}) {
        this.model = model
        this.store = store || (model && model.store) || null
        this.config = config
    }

    get pool() {
        if(!this.store)
            return null
        if(!this.store.apiPool)
            this.store.apiPool = {}
        return this.store.apiPool
    }

    // TODO: handle delete
    fetch(url_, config_={}) {
        let [url, {pool=false, params=null, ...config}] = this.getConfig(url_, config_)

        if(params)
            url = `${url}?${params.toString()}`
        
        const key = pool && this.pool ? `${config.method || 'GET'}:${url}` : null;
        if(key && this.pool[key])
            return this.pool[key]
            
        const fut = fetch(url, config).then(r => this.onResponse(r, key, config))
        if(key)
            this.pool[key] = fut
        return fut
    }

    getConfig(url, {data={}, form=null, ...config}) {
        const apiConf = this.apiConfig || {}
        const modelConf = (this.model && this.model.apiConfig) || {}
        config = {
            ...apiConf, ...modelConf, ...config,
            headers: {
                ...(apiConf.headers || {}),
                ...(modelConf && modelConf.headers || {}),
                ...(config.headers || {}),
                'Accept': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken'),
            },
            method: config.method || form.getAttribute('method') || 'POST',
        }

        if(!url && form)
            url = form.getAttribute('action')
        if(!url)
            throw "url is missing (provided by 'url' or 'form')"

        if(!config.body) {
            if(Object.keys(data).length) {
                const formData = new FormData()
                for(let key in data)
                    formData.append(key, data[key])
                config.body = formData
            }
            else if(form)
                config.body = new FormData(form)
            if(config.body)
                config.headers['Content-Type'] = 'multipart/form-data'
        }

        return [url, config]
    }

    onResponse(response, key=null, {method, commit=false, dataKey=null})
    {
        if(key && this.pool)
            delete this.pool[key];

        // TODO better handling of response and their response body type
        // TODO commit delete
        if(method == 'DELETE')
            return {response, status: response.status}


        return response.json().then(rawData => {
            if(400 <= response.status)
                throw(rawData)

			const data = rawData && dataKey ? rawData[dataKey] : rawData

			// commit
            if(200 <= status <= 400) {
                if(commit && this.model && data)
                	this.model.insertOrUpdate({data:data})
                // if(del && model)
                //  model.delete()
            }

            return {
                data, rawData, response,
                status: response.status,
            }
        })
    }
    
    get(url, config) {
        return this.fetch(url, {method: 'GET', pool: true, ...config})
    }

    head(url, config) {
        return this.fetch(url, {method: 'HEAD', pool: true, ...config})
    }

    post(url, config) {
        return this.fetch(url, {method: 'POST', ...config})
    }

    put(url, config) {
        return this.fetch(url, {method: 'PUT', ...config})
    }

    delete(url, config) {
        return this.fetch(url, {method: 'DELETE', pool: true, ...config})
    }
}


