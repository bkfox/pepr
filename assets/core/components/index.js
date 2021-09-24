import PAction from './action'
import PActions from './actions'
import PField from './field'
import PFieldRow from './fieldRow'
import PForm from './form'
import PDeck from './deck'
import PList from './list'
import PObject from './object'
import PModal from './modal'
import PModalForm from './modalForm'
import PNav from './nav'
import PNavItem from './navItem'
import PRuntimeTemplate from './runtimeTemplate'
import PTab from './tab'
import PTabs from './tabs'

import PContext from './context'
import PSelectRole from './selectRole'
import PSubscription from './subscription'
import PSubscriptionButton from './subscriptionButton'

export function copyProps(source, override) {
    const props = {}
    for(const key in source) {
        const value = source[key]
        const ovalue = override[key]
        if(ovalue instanceof Object && value instanceof Object)
            props[key] = { ...value, ...ovalue }
        else
            props[key] = ovalue
    }
    return props
}


export {
    PAction, PActions, PField, PFieldRow, PForm, PDeck,
    PList, PObject,
    PModal, PModalForm, PNav, PNavItem, PRuntimeTemplate,
    PTab, PTabs,

    PContext, PSelectRole,
    PSubscription, PSubscriptionButton,
}
