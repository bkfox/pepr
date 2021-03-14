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
    emits: ['done', 'error'],
    props: {
        model: Function,
        context: Object,
        item: Object,
        apiUrl: String,
        action: String,
        method: {type:String, default:'POST'},
    },

    computed: {
        currentContext() {
            return (this.item && this.item.context) || this.context
        },

        currentModel() {
            return (this.item && this.item.constructor) || this.model
        },

        targetMethod() {
            return this.item ? 'PUT' : this.method
        },

        targetUrl() {
            return this.item ? this.item.api_url : this.apiUrl
        },
    },

    methods: {
        onSubmit(ev) {
            if(!this.targetUrl || !this.currentModel || ev.target != this.$refs.form)
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
            let method = this.targetMethod.toLowerCase()
            this.currentModel.api()[method](this.targetUrl, data, config)
                .then(r => this.$emit('done', r),
                      r => this.$emit('error', r))
        },
    },
}
</script>
