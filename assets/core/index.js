import './styles.scss';
import '@mdi/font/fonts/materialdesignicons-webfont.ttf';

import Action from './action'
import App, {loadConfig, mount} from './app'
import components from './components'
import models, {loadStore, Role} from './models'
import { ormPlugin } from './plugins'

export {
    Action, App, loadConfig, mount, components,
    models, loadStore, Role, ormPlugin
}

