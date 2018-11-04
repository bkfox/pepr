/**
 * Collection that is synchronized to the server with API requests.
 */
class Container extends Collection {
    /**
     * Bind to a specific server resource if not yet bound.
     *
     * @param {String} collectionUrl API base url of the collection object;
     * @param {String} itemsUrl API base url to get items;
     * @param {Boolean} observe observe the distant collection (sync to list changes)
     * @param {Boolean} force;
     */
    bind(connection, collectionUrl, itemsUrl, observe=true, force=false) {
        if(this.observer) {
            if(!force)
                return;
            this.observer.off('message', this.onmessage, this);
            this.observer = null;
        }

        this.connection = connection;
        this.collectionUrl = collectionUrl;
        this.itemsUrl = itemsUrl;

        if(observe) {
            this.observer = this.connection.observe(
                this.collectionUrl + 'observer/'
            );
            this.observer.on('message', this.onmessage, this);
        }

        // TODO: load from server + pagination
    }

    reset() {
        super.reset();
        if(this.observer) {
            this.observer.off('message', this.onmessage, this);
            delete this.observer;
        }
    }

    /**
     * Handle a pubsub message and update collection accordingly
     */
    onmessage(event) {
        var message = event.message;
        if(message.status >= 300) {
            console.info('error received from server', message.content);
            return;
        }

        console.log('>> message', event);
        var item = message.data;
        switch(message.method) {
            case 'POST': this.add(item);
                           break;
            case 'PUT': this.update(item);
                           break;
            case 'DELETE': this.remove(item);
                           break;
            default:
                break;
        }
    }
}


$pepr.comps.Container = Vue.component('pepr-container', {
    extends: $pepr.comps.Collection,
    props: ['collectionUrl','itemsUrl'],
    data() {
        return {
            connection: undefined,
            collection: new Container(this.idAttr, this.sortAttr),
        }
    },
    mounted() {
        this.collection.bind(this.connection || $pepr.connection,
                             this.collectionUrl, this.itemsUrl);
    }
});

