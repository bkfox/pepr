import App from 'pepr/core/app'

import * as models from './models'

const config = {
    props: {
        apiUrl: { type: String, default: '/api/' },
    },
}
const app = new App(config, {models});

app.load({async:true}).then(app => {
    window.app = app;
})

export default app;

