import PField from './field'
import PFieldRow from './fieldRow'
import PForm from './form'
import PDeck from './deck'
import PList from './list'
import PModal from './modal'
import PNav from './nav'
import PNavItem from './navItem'
import PRuntimeTemplate from './runtimeTemplate'

import PContext from './context'
import PSelectRole from './selectRole'
import PSubscription from './subscription'
import PSubscriptionButton from './subscriptionButton'
import PSubscriptionForm from './subscriptionForm'
import PSubscriptionList from './subscriptionList'

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
    PField, PFieldRow, PForm, PDeck,
    PList, PModal, PNav, PNavItem, PRuntimeTemplate,

    PContext, PSelectRole,
    PSubscription, PSubscriptionButton, PSubscriptionForm, PSubscriptionList
}
