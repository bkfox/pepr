<template>
    <form ref="form" :method="targetMethod" :action="action" 
            @submit="onSubmit">
        <slot name="error" v-if="error" :message="message">
            <div class="is-bad">{{ message }}</div>
        </slot>
        <slot :item="item"></slot>
    </form>
</template>
<script>
import Cookies from 'js-cookie'

export default {
    props: {
        model: Function,
        item: Object,
        apiUrl: String,
        action: String,
        method: {type:String, default:'POST'},
    },

    computed: {
        targetMethod() {
            return this.item ? 'PUT' : this.method
        },

        targetUrl() {
            return this.item ? this.item.api_url : this.apiUrl
        },
    },

    methods: {
        onSubmit(ev) {
            if(!this.targetUrl || !this.model || ev.target != this.$refs.form)
                return

            ev.preventDefault()
            ev.stopPropagation()

            let data = new FormData(event.target);
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': Cookies.get('csrftoken'),
                }
            }
            let method = this.method.toLowerCase()
            this.model.api()[method](this.targetUrl, data, config)
                //.reject((err) => console.error(
                //    `XHR request to ${this.apiUrl} failed (config: ${config}): `,
                //    error))
        },
    },
}
</script>
