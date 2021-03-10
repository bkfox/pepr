import App from 'pepr/core/app'

import * as models from './models'
import Content from './content'

// TODO: move into app
const config = {
    props: {
        apiUrl: { type: String, default: '/api/' },
    },

    computed: {
        context() {
            return this.context_id
        }
    }
}
const app = new App(config, {models,
    components: {
        'p-content': Content,
    },
});

app.load({async:true}).then((vm) => {
    window.contentVm = vm
})
export default app;

