/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/core/action.js":
/*!*******************************!*\
  !*** ./assets/core/action.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Action)\n/* harmony export */ });\n\n/**\n * Action available to user (checking on its permissions).\n *\n *\n * Use `name` as permission name when `permissions` is not provided.\n * Provided permissions' name exclude model's label prefix, as it is\n * provided by item at the permission check (this allows reuse of\n * actions instance accross models).\n */\nclass Action {\n    constructor({label, exec=null, permissions=null, icon='',\n                 help='', css=''}={})\n    {\n        this.label = label\n        this.permissions = Array.isArray(permissions) ? permissions :\n                                permissions ? [permissions] : null\n        this.exec = exec\n        this.icon = icon\n        this.help = help\n        this.css = css\n    }\n\n    isGranted(role, item) {\n        return this.permissions ? item.isGranted(role, ...this.permissions) : true\n    }\n\n    trigger(role, item, ...args) {\n        if(role && this.exec && this.isGranted(role, item))\n            this.exec(item, ...args)\n    }\n}\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/action.js?");

/***/ }),

/***/ "./assets/core/api.js":
/*!****************************!*\
  !*** ./assets/core/api.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Api)\n/* harmony export */ });\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-cookie */ \"./node_modules/js-cookie/dist/js.cookie.mjs\");\n\n\n\n/**\n * Provide methods to make API calls with a request pool (per store if provided).\n *\n * # Available config options:\n * - pool: use request pool (return awaiting request if any)\n * - params: URLSearchParams to add to url\n * - data: model instance or data to send (converted into request's body)\n * - form: use form data and 'action'/'method' (if none provided)\n * - dataKey: key to extract response data\n * - commit: update model's store with response data\n */\nclass Api {\n    constructor(model, {store=null, ...config}={}) {\n        this.model = model\n        this.store = store || (model && model.store) || null\n        this.config = config\n    }\n\n    get pool() {\n        if(!this.store)\n            return null\n        if(!this.store.apiPool)\n            this.store.apiPool = {}\n        return this.store.apiPool\n    }\n\n    // TODO: handle delete\n    fetch(url_, config_={}) {\n        let [url, {pool=false, params=null, ...config}] = this.getConfig(url_, config_)\n\n        if(params)\n            url = `${url}?${params.toString()}`\n        \n        const key = pool && this.pool ? `${config.method || 'GET'}:${url}` : null;\n        if(key && this.pool[key])\n            return this.pool[key]\n            \n        const fut = fetch(url, config).then(r => this.onResponse(r, key, config))\n        if(key)\n            this.pool[key] = fut\n        return fut\n    }\n\n    getConfig(url, {data={}, form=null, ...config}) {\n        const apiConf = this.apiConfig || {}\n        const modelConf = (this.model && this.model.apiConfig) || {}\n        config = {\n            ...apiConf, ...modelConf, ...config,\n            headers: {\n                ...(apiConf.headers || {}),\n                ...(modelConf && modelConf.headers || {}),\n                ...(config.headers || {}),\n                'Accept': 'application/json',\n                'X-CSRFToken': js_cookie__WEBPACK_IMPORTED_MODULE_0__[\"default\"].get('csrftoken'),\n            },\n            method: config.method || form && form.getAttribute('method') || 'GET',\n        }\n\n        if(!url && form)\n            url = form.getAttribute('action')\n        if(!url)\n            throw \"url is missing (provided by 'url' or 'form')\"\n\n        if(!config.body) {\n            if(data && Object.keys(data).length) {\n                const formData = new FormData()\n                for(let key in data)\n                    if(key && data[key])\n                        formData.append(key, data[key])\n                config.body = formData\n            }\n            else if(form)\n                config.body = new FormData(form)\n        }\n\n        return [url, config]\n    }\n\n    onResponse(response, key=null, {method, commit=false, dataKey=null})\n    {\n        if(key && this.pool)\n            delete this.pool[key];\n\n        // TODO better handling of response and their response body type\n        // TODO commit delete\n        if(method == 'DELETE')\n            return {response, status: response.status}\n\n\n        return response.json().then(rawData => {\n            if(400 <= response.status)\n                throw(rawData)\n\n\t\t\tconst data = rawData && dataKey ? rawData[dataKey] : rawData\n\n\t\t\t// commit\n            if(200 <= status <= 400) {\n                if(commit && this.model && data)\n                \tthis.model.insertOrUpdate({data:data})\n                // if(del && model)\n                //  model.delete()\n            }\n\n            return {\n                data, rawData, response,\n                status: response.status,\n            }\n        })\n    }\n    \n    get(url, config) {\n        return this.fetch(url, {method: 'GET', pool: true, ...config})\n    }\n\n    head(url, config) {\n        return this.fetch(url, {method: 'HEAD', pool: true, ...config})\n    }\n\n    post(url, config) {\n        return this.fetch(url, {method: 'POST', ...config})\n    }\n\n    put(url, config) {\n        return this.fetch(url, {method: 'PUT', ...config})\n    }\n\n    delete(url, config) {\n        return this.fetch(url, {method: 'DELETE', pool: true, ...config})\n    }\n}\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/api.js?");

/***/ }),

/***/ "./assets/core/app.js":
/*!****************************!*\
  !*** ./assets/core/app.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   \"createApp\": () => (/* binding */ createApp),\n/* harmony export */   \"getScriptData\": () => (/* binding */ getScriptData)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components */ \"./assets/core/components/index.js\");\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./composables */ \"./assets/core/composables/index.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./models */ \"./assets/core/models.js\");\n/* harmony import */ var _plugins__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./plugins */ \"./assets/core/plugins.js\");\n\n\n\n\n\n\n\n\n\n/**\n * Base Pepr's application configuration.\n *\n * Context:\n * - useContext\n *\n * Provide:\n * - baseUrl\n * - roles\n */\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    // Django already uses \"{{\" and \"}}\" delimiters for template rendering\n    delimiters: ['[[', ']]'],\n    components: _components__WEBPACK_IMPORTED_MODULE_0__,\n\n    props: {\n        ..._composables__WEBPACK_IMPORTED_MODULE_1__.useContextById.props,\n    },\n\n    setup(props) {\n        const propsRefs = (0,vue__WEBPACK_IMPORTED_MODULE_4__.toRefs)(props)\n        const contextComp = _composables__WEBPACK_IMPORTED_MODULE_1__.useContextById(propsRefs.contextId, propsRefs.contextEntity)\n        return {...contextComp}\n    },\n});\n\n\n/**\n * Create application setting up plugins etc.\n *\n * @return Promise resolving to app.\n *\n *  @param {Object}         app                 Vue application config\n *  @param {String}         config.baseURL      Root URL of api endpoints\n *  @param {Array[Model]}   config.models       ORM models to declare on the application\n *  @param {Object}         config.storeConfig  Vuex store's config\n *  @param {Array[Promise]} config.tasks        Asynchronous tasks to run before application\n *                                              is ready\n */\nfunction createApp(app, {baseURL='/api', models=null, storeConfig={}, tasks=[]}={}) {\n    app = (0,vue__WEBPACK_IMPORTED_MODULE_4__.createApp)(app)\n    if(models !== null) {\n        app.use(_plugins__WEBPACK_IMPORTED_MODULE_3__.modelsPlugin, {baseURL, models, storeConfig})\n        app.use(_plugins__WEBPACK_IMPORTED_MODULE_3__.initModelsPlugin, {models, tasks})\n    }\n\n    return Promise.all(tasks).then(() => app)\n}\n\n\n/**\n * Load data from JSON <script> element, matching provided querySelector.\n * Return a promise resolving to the config object.\n *\n * If `async` is true, resolve on document `load` event.\n */\nfunction getScriptData(el) {\n    let elm = document.querySelector(el)\n    if(elm.text) {\n        const data = JSON.parse(elm.text)\n        if(data)\n            return data\n    }\n}\n\n\n\n/**\n    /// Fetch application from server and load.\n    /// TODO/FIXME: handling new application config and models etc.\n    fetch(url, {el='app', ...options}={}) {\n        return fetch(url, options).then(response => response.text())\n            .then(content => {\n                let doc = new DOMParser().parseFromString(content, 'text/html')\n                let app = doc.getElementById('app')\n                content = app ? app.innerHTML : content\n                return this.load({sync: true, content, title: doc.title, url })\n            })\n    }\n\n    /// Save application state into browser history\n    historySave(url,replace=false) {\n        const el = document.querySelector(this.config.el)\n        const state = {\n            // TODO: el: this.config.el,\n            content: el.innerHTML,\n            title: document.title,\n        }\n\n        if(replace)\n            history.replaceState(state, '', url)\n        else\n            history.pushState(state, '', url)\n    }\n\n    /// Load application from browser history's state\n    historyLoad(state) {\n        return this.load({ content: state.content, title: state.title })\n    }\n*/\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/app.js?");

/***/ }),

/***/ "./assets/core/components/index.js":
/*!*****************************************!*\
  !*** ./assets/core/components/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"copyProps\": () => (/* binding */ copyProps),\n/* harmony export */   \"PAction\": () => (/* reexport safe */ _action__WEBPACK_IMPORTED_MODULE_0__[\"default\"]),\n/* harmony export */   \"PActions\": () => (/* reexport safe */ _actions__WEBPACK_IMPORTED_MODULE_1__[\"default\"]),\n/* harmony export */   \"PField\": () => (/* reexport safe */ _field__WEBPACK_IMPORTED_MODULE_2__[\"default\"]),\n/* harmony export */   \"PFieldRow\": () => (/* reexport safe */ _fieldRow__WEBPACK_IMPORTED_MODULE_3__[\"default\"]),\n/* harmony export */   \"PForm\": () => (/* reexport safe */ _form__WEBPACK_IMPORTED_MODULE_4__[\"default\"]),\n/* harmony export */   \"PDeck\": () => (/* reexport safe */ _deck__WEBPACK_IMPORTED_MODULE_5__[\"default\"]),\n/* harmony export */   \"PList\": () => (/* reexport safe */ _list__WEBPACK_IMPORTED_MODULE_6__[\"default\"]),\n/* harmony export */   \"PObject\": () => (/* reexport safe */ _object__WEBPACK_IMPORTED_MODULE_7__[\"default\"]),\n/* harmony export */   \"PModal\": () => (/* reexport safe */ _modal__WEBPACK_IMPORTED_MODULE_8__[\"default\"]),\n/* harmony export */   \"PModalForm\": () => (/* reexport safe */ _modalForm__WEBPACK_IMPORTED_MODULE_9__[\"default\"]),\n/* harmony export */   \"PNav\": () => (/* reexport safe */ _nav__WEBPACK_IMPORTED_MODULE_10__[\"default\"]),\n/* harmony export */   \"PNavItem\": () => (/* reexport safe */ _navItem__WEBPACK_IMPORTED_MODULE_11__[\"default\"]),\n/* harmony export */   \"PRuntimeTemplate\": () => (/* reexport safe */ _runtimeTemplate__WEBPACK_IMPORTED_MODULE_12__[\"default\"]),\n/* harmony export */   \"PTab\": () => (/* reexport safe */ _tab__WEBPACK_IMPORTED_MODULE_13__[\"default\"]),\n/* harmony export */   \"PTabs\": () => (/* reexport safe */ _tabs__WEBPACK_IMPORTED_MODULE_14__[\"default\"]),\n/* harmony export */   \"PContext\": () => (/* reexport safe */ _context__WEBPACK_IMPORTED_MODULE_15__[\"default\"]),\n/* harmony export */   \"PSelectRole\": () => (/* reexport safe */ _selectRole__WEBPACK_IMPORTED_MODULE_16__[\"default\"]),\n/* harmony export */   \"PSubscription\": () => (/* reexport safe */ _subscription__WEBPACK_IMPORTED_MODULE_17__[\"default\"]),\n/* harmony export */   \"PSubscriptionButton\": () => (/* reexport safe */ _subscriptionButton__WEBPACK_IMPORTED_MODULE_18__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action */ \"./assets/core/components/action.vue\");\n/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actions */ \"./assets/core/components/actions.vue\");\n/* harmony import */ var _field__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./field */ \"./assets/core/components/field.vue\");\n/* harmony import */ var _fieldRow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fieldRow */ \"./assets/core/components/fieldRow.vue\");\n/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./form */ \"./assets/core/components/form.vue\");\n/* harmony import */ var _deck__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./deck */ \"./assets/core/components/deck.vue\");\n/* harmony import */ var _list__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./list */ \"./assets/core/components/list.vue\");\n/* harmony import */ var _object__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./object */ \"./assets/core/components/object.vue\");\n/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modal */ \"./assets/core/components/modal.vue\");\n/* harmony import */ var _modalForm__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./modalForm */ \"./assets/core/components/modalForm.vue\");\n/* harmony import */ var _nav__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./nav */ \"./assets/core/components/nav.vue\");\n/* harmony import */ var _navItem__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./navItem */ \"./assets/core/components/navItem.vue\");\n/* harmony import */ var _runtimeTemplate__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./runtimeTemplate */ \"./assets/core/components/runtimeTemplate.js\");\n/* harmony import */ var _tab__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./tab */ \"./assets/core/components/tab.vue\");\n/* harmony import */ var _tabs__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./tabs */ \"./assets/core/components/tabs.vue\");\n/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./context */ \"./assets/core/components/context.vue\");\n/* harmony import */ var _selectRole__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./selectRole */ \"./assets/core/components/selectRole.vue\");\n/* harmony import */ var _subscription__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./subscription */ \"./assets/core/components/subscription.vue\");\n/* harmony import */ var _subscriptionButton__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./subscriptionButton */ \"./assets/core/components/subscriptionButton.vue\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nfunction copyProps(source, override) {\n    const props = {}\n    for(const key in source) {\n        const value = source[key]\n        const ovalue = override[key]\n        if(ovalue instanceof Object && value instanceof Object)\n            props[key] = { ...value, ...ovalue }\n        else\n            props[key] = ovalue\n    }\n    return props\n}\n\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/index.js?");

/***/ }),

/***/ "./assets/core/components/runtimeTemplate.js":
/*!***************************************************!*\
  !*** ./assets/core/components/runtimeTemplate.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/**\n * This code originally comes from v-runtime-template by Alex Jovern. It includes\n * PR#33 and is adapted to Vue 3.\n * The following code is under MIT license (Copyright (c) 2018 Alex Jover).\n */\n\n\nconst defineDescriptor = (src, dest, name) => {\n  if (!dest.hasOwnProperty(name)) {\n    const descriptor = Object.getOwnPropertyDescriptor(src, name);\n    Object.defineProperty(dest, name, descriptor);\n  }\n};\n\nconst merge = objs => {\n  const res = {};\n  objs.forEach(obj => {\n    obj &&\n      Object.getOwnPropertyNames(obj).forEach(name =>\n        defineDescriptor(obj, res, name)\n      );\n  });\n  return res;\n};\n\nconst buildFromProps = (obj, props) => {\n  const res = {};\n  props.forEach(prop => defineDescriptor(obj, res, prop));\n  return res;\n};\n\nconst buildPassthrough = (self, source, target, attr) => {\n    [self, source] = [self[attr], source[attr] || {}];\n    let dest = target[attr] || {};\n    for(var key of Object.keys(source))\n        if(self === undefined || self[key] === undefined)\n            dest[key] = source[key];\n    target[attr] = dest;\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  props: {\n    template: String\n  },\n  render() {\n    if (this.template) {\n      let passthrough = {};\n      buildPassthrough(self, this.$parent, passthrough, '$data');\n      buildPassthrough(self, this.$parent, passthrough, '$props');\n      buildPassthrough(self, this.$parent.$options, passthrough, 'components');\n      buildPassthrough(self, this.$parent.$options, passthrough, 'computed');\n      buildPassthrough(self, this.$parent.$options, passthrough, 'methods');\n\n      const methodKeys = Object.keys(passthrough.methods);\n      const dataKeys = Object.keys(passthrough.$data);\n      const propKeys = Object.keys(passthrough.$props);\n      const allKeys = dataKeys.concat(propKeys).concat(methodKeys);\n      const methodsFromProps = buildFromProps(this.$parent, methodKeys);\n      const props = merge([passthrough.$data, passthrough.$props, methodsFromProps]);\n\n      const dynamic = {\n        template: this.template || \"<div></div>\",\n        props: allKeys,\n        computed: passthrough.computed,\n        components: passthrough.components\n      };\n\n      return (0,vue__WEBPACK_IMPORTED_MODULE_0__.h)(dynamic, {\n        props\n      });\n    }\n  }\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/runtimeTemplate.js?");

/***/ }),

/***/ "./assets/core/composables/forms.js":
/*!******************************************!*\
  !*** ./assets/core/composables/forms.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"form\": () => (/* binding */ form),\n/* harmony export */   \"singleSelect\": () => (/* binding */ singleSelect)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api */ \"./assets/core/api.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ \"./assets/core/composables/utils.js\");\n\n\n\n\n\n/**\n * Composable handling form, handling both Model and regular objects.\n * It sends data using XmlHttpRequest.\n *\n * Provides: 'errors' (errors returned by the server)\n *\n * @param {Ref({})} initial         initial data of form's fields\n * @param {Ref({})} defaults        default values of form's fields\n * @param bool      commit          use Model.save and commit changes to store\n * @param {}        submitConfig    extra config to pass to submit method\n *\n * @fires form#success\n * @fires form#error\n * @fires form#reset\n *\n */\nfunction form({initial: initial_, defaults = null,\n                      model = null, commit=false,\n                      submitConfig={}, ...ctx}, { emit })\n{\n    // TODO: include usage of optional 'action' props\n    const initial = (0,vue__WEBPACK_IMPORTED_MODULE_2__.computed)(() => initial_.value || (defaults && defaults.value) || {})\n    const data = (0,vue__WEBPACK_IMPORTED_MODULE_2__.reactive)({...initial.value})\n    const errors = (0,vue__WEBPACK_IMPORTED_MODULE_2__.reactive)({})\n    ;(0,vue__WEBPACK_IMPORTED_MODULE_2__.provide)('errors', errors)\n\n    function reset(value=null) {\n        for(var k in data)\n            delete data[k]\n\n        resetErrors()\n\n        Object.assign(data, value || initial.value)\n        emit('reset', data)\n    }\n\n    function resetErrors(value=null) {\n        for(var k in errors)\n            delete errors[k]\n\n        if(value) {\n            Object.assign(errors, value)\n            emit('error', value)\n        }\n    }\n\n    function submitForm({form, event=null, ...config}={}) {\n        const res = (commit.value && model && model.value) ?\n            model.value.fetch({method: 'POST', form, id: data.$id, commit: true, ...config}) :\n            new _api__WEBPACK_IMPORTED_MODULE_0__[\"default\"](null, {store: useStore()}).fetch({form, ...config})\n\n        return res.then(r => {\n            if(200 <= r.status < 300) {\n                reset(r.data)\n                emit('success', r.data)\n            }\n            else if(r.errors)\n                resetErrors(r.data)\n            return r\n        })\n    }\n\n    (0,vue__WEBPACK_IMPORTED_MODULE_2__.watch)(initial, reset)\n    return { ...ctx, initial, data, errors, model, reset, resetErrors,\n             submit: submitForm }\n}\n\nform.emits = ['success', 'done', 'error', 'reset']\n\n/**\n * Return components' props for form\n */\nform.props = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.makeProps)({\n    action: { type: String, default: '' },\n    initial: { type: Object, default: null },\n    commit: { type: Boolean, default: true },\n})\n\n\n/**\n * Select item\n */\nfunction singleSelect(props, emit) {\n    function getValue(value) {\n        return value === null || value === undefined ?\n            props.initial || 'default' : value\n    }\n\n    const selected = (0,vue__WEBPACK_IMPORTED_MODULE_2__.ref)(getValue(props.initial))\n\n    function select(value=null) {\n        value = getValue(value)\n        if(value != selected.value) {\n            selected.value = value\n            emit('select', selected.value)\n        }\n    }\n    return { selected, select }\n}\n\nsingleSelect.emits = ['select']\nsingleSelect.props = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.makeProps)({\n    initial: { type: String, default: 'default' },\n})\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/composables/forms.js?");

/***/ }),

/***/ "./assets/core/composables/index.js":
/*!******************************************!*\
  !*** ./assets/core/composables/index.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"form\": () => (/* reexport safe */ _forms__WEBPACK_IMPORTED_MODULE_0__.form),\n/* harmony export */   \"singleSelect\": () => (/* reexport safe */ _forms__WEBPACK_IMPORTED_MODULE_0__.singleSelect),\n/* harmony export */   \"Filter\": () => (/* reexport safe */ _lists__WEBPACK_IMPORTED_MODULE_1__.Filter),\n/* harmony export */   \"Filters\": () => (/* reexport safe */ _lists__WEBPACK_IMPORTED_MODULE_1__.Filters),\n/* harmony export */   \"fetchList\": () => (/* reexport safe */ _lists__WEBPACK_IMPORTED_MODULE_1__.fetchList),\n/* harmony export */   \"filters\": () => (/* reexport safe */ _lists__WEBPACK_IMPORTED_MODULE_1__.filters),\n/* harmony export */   \"getList\": () => (/* reexport safe */ _lists__WEBPACK_IMPORTED_MODULE_1__.getList),\n/* harmony export */   \"getObject\": () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_2__.getObject),\n/* harmony export */   \"getOrFetch\": () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_2__.getOrFetch),\n/* harmony export */   \"useContext\": () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_2__.useContext),\n/* harmony export */   \"useContextById\": () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_2__.useContextById),\n/* harmony export */   \"useModel\": () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_2__.useModel),\n/* harmony export */   \"useParentContext\": () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_2__.useParentContext),\n/* harmony export */   \"makeProps\": () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_3__.makeProps)\n/* harmony export */ });\n/* harmony import */ var _forms__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./forms */ \"./assets/core/composables/forms.js\");\n/* harmony import */ var _lists__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lists */ \"./assets/core/composables/lists.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./models */ \"./assets/core/composables/models.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ \"./assets/core/composables/utils.js\");\n\n\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/composables/index.js?");

/***/ }),

/***/ "./assets/core/composables/lists.js":
/*!******************************************!*\
  !*** ./assets/core/composables/lists.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"filters\": () => (/* binding */ filters),\n/* harmony export */   \"Filter\": () => (/* binding */ Filter),\n/* harmony export */   \"Filters\": () => (/* binding */ Filters),\n/* harmony export */   \"getList\": () => (/* binding */ getList),\n/* harmony export */   \"fetchList\": () => (/* binding */ fetchList)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./assets/core/composables/utils.js\");\n\n\n\n\n\nconst filters = {\n    eq: (x, y) => x == y,\n    gt: (x, y) => x > y,\n    gte: (x, y) => x >= y,\n    lt: (x, y) => x < y,\n    lte: (x, y) => x <= y,\n    in: (x, y) => y.indexOf(x) != -1,\n    isnull: (x, y) => y ? (x === null || x === undefined)\n                        : (x !== null && x !== undefined),\n    startswith: (x, y) => x.startswith(y),\n    endswith: (x, y) => x.endswith(y),\n}\n\nclass Filter {\n    constructor(key, value) {\n        let path = key.split('__')\n        let last = path.length > 1 && path[path.length-1]\n        if(last && filters[last])\n            path = path.slice(0, filters.length-1)\n        else\n            last = 'eq'\n\n        this.path = path\n        this.pred = filters[last]\n        this.key = key\n        this.value = value\n    }\n\n    test(left) {\n        for(const p of this.path) {\n            if(left === undefined)\n                return false\n            left = left[p]\n        }\n        const right = (this.value instanceof Function && this.value(left)) || this.value\n        return this.pred(left, right)\n    }\n}\n\nclass Filters {\n    constructor(filters=null) {\n        this.set(filters, true)\n    }\n\n    get length() {\n        return this._length\n    }\n\n    test(value) {\n        for(let filter of Object.values(this.all))\n            if(!filter.test(value))\n                return false\n        return true\n    }\n\n    urlParams(params=null) {\n        params = params || new URLSearchParams()\n        for(let [key, filter] of Object.entries(this.all))\n            params.set(key, filter.value)\n        return params\n    }\n\n    set(filters, reset=false) {\n        if(filters == this)\n            return\n\n        if(!this.all || reset)\n            [this.all, this._length] = [{}, 0]\n\n        if(filters) {\n            const it = filters instanceof Filters ? Object.entries(filters.all)\n                                                  : Object.entries(filters);\n\n            for(let [key, value] of it)\n                if(!this.all[key])\n                    this.all[key] = new Filter(key, value)\n                else if(this.all[key].value != value)\n                    this.all[key].value = value\n        }\n\n        this._length = filters ? Object.keys(this.all).length : 0\n    }\n}\n\n\n\nfunction getList({model, filters, orderBy=null}) {\n    const listFilters = new Filters(filters.value)\n    const listQuery = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => {\n        if(!model.value)\n            return null\n\n        const ob = orderBy && orderBy.value ? orderBy.value.startsWith('-')\n                                            ? [orderBy.value.slice(1), 'desc']\n                                            : [orderBy.value, 'asc']\n                                            : null\n        let query = model.value.query()\n        if(listFilters.length)\n            query = query.where(x => listFilters.test(x))\n        if(ob)\n            query = query.orderBy((obj) => obj[ob[0], ob[1]])\n        return query\n    })\n    const list = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => {\n        return listQuery.value && listQuery.value.get()\n    })\n\n    ;(0,vue__WEBPACK_IMPORTED_MODULE_1__.watch)(filters, (v) => listFilters.set(v, true))\n    return {model, filters, orderBy, list, listFilters, listQuery}\n}\n\n\ngetList.props = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.makeProps)({\n    filters: { type: Object, default: null },\n    orderBy: { type: String, default: '' },\n})\n\n\nfunction fetchList({model, fetchAuto, list, listFilters, url=null}) {\n    const pagination = (0,vue__WEBPACK_IMPORTED_MODULE_1__.reactive)({\n        count: null, next: null, prev:null\n    })\n\n    function fetch({filters=null, resetFilters=true, ...config}={}) {\n        if(!config.url && url && url.value)\n            config.url = url.value\n\n        const search = config.url ? config.url.split('?', 2)[1] : undefined\n        config.urlParams = new URLSearchParams(search)\n\n        if(filters)\n            listFilters.set(filters, resetFilters)\n        if(listFilters.length)\n            config.params = listFilters.urlParams(config.urlParams)\n\n        return model.value.fetch({ ...config }).then(r => {\n            pagination.count = r.data.count\n            pagination.next = r.data.next\n            pagination.prev = r.data.prev\n            return r\n        })\n    }\n\n    function fetchNext(config={}) {\n        return pagination.next ? fetch({...config, url: pagination.next})\n                               : new Promise((resolve) => resolve(null))\n    }\n\n    function fetchPrev(config={}) {\n        return pagination.prev ? fetch({...config, url: pagination.prev})\n                               : new Promise((resolve) => resolve(null))\n    }\n\n    if(fetchAuto) {\n        url && (0,vue__WEBPACK_IMPORTED_MODULE_1__.watch)(url, (url) => fetchAuto.value && fetch({url}))\n        ;(0,vue__WEBPACK_IMPORTED_MODULE_1__.onMounted)(() => fetchAuto.value && fetch())\n    }\n\n    return { url, pagination, fetch, fetchNext, fetchPrev }\n}\n\nfetchList.props = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.makeProps)({\n    url: { type: String, default: null },\n    fetchAuto: { type: Boolean, default: false }\n})\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/composables/lists.js?");

/***/ }),

/***/ "./assets/core/composables/models.js":
/*!*******************************************!*\
  !*** ./assets/core/composables/models.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"useModel\": () => (/* binding */ useModel),\n/* harmony export */   \"getObject\": () => (/* binding */ getObject),\n/* harmony export */   \"getOrFetch\": () => (/* binding */ getOrFetch),\n/* harmony export */   \"useContext\": () => (/* binding */ useContext),\n/* harmony export */   \"useContextById\": () => (/* binding */ useContextById),\n/* harmony export */   \"useParentContext\": () => (/* binding */ useParentContext)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vuex */ \"./node_modules/vuex/dist/vuex.esm-bundler.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./assets/core/composables/utils.js\");\n\n\n\n\n\n/**\n *  Provide model class using component's store\n */\nfunction useModel({entity=null, item=null}={}) {\n    const model = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() =>\n        (entity && entity.value)\n            ? (0,vuex__WEBPACK_IMPORTED_MODULE_2__.useStore)().$db().model(entity.value)\n            : item && item.value ? item.value.constructor : null)\n    return { entity, model }\n}\n\nuseModel.props = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.makeProps)({\n    entity: { type: String, default: null }\n})\n\n/**\n * Get model instance by id. If not present, fetch from remote server.\n */\nfunction getObject({pk, model}) {\n    const object = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => model.value && model.value.find(pk.value))\n    return { model, pk, object }\n}\n\ngetObject.props = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.makeProps)({\n    pk: [String,Number],\n})\n\n/**\n * Get model instance by id. If not present, fetch from remote server.\n */\nfunction getOrFetch({url=null, ...props}) {\n    const { model, entity } = useModel(props)\n    const { object, pk } = getObject({...props, model})\n\n    function fetch(id, force=false) {\n        if(!id.value || !model.value)\n            return\n        var obj = model.value.find(id.value)\n        if(force || obj == null || obj.value == null)\n            model.value.fetch({id: pk.value, url: url && url.value})\n    }\n    (0,vue__WEBPACK_IMPORTED_MODULE_1__.watch)(pk, fetch)\n    ;(0,vue__WEBPACK_IMPORTED_MODULE_1__.watch)(model, () => fetch(pk))\n    ;(0,vue__WEBPACK_IMPORTED_MODULE_1__.nextTick)().then(() => fetch(pk))\n\n    return { model, object }\n}\n\ngetOrFetch.props = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.makeProps)({\n    ...useModel.props(),\n    ...getObject.props(),\n    url: String,\n})\n\n\n/**\n *  Add context's information to component. Use injected values when no\n *  context reference is provided.\n *\n *  Context:\n *  - context: current context\n *  - role: user's role\n *  - roles: available roles (injected from App)\n *\n *  Provide:\n *  - context: provided context (if any)\n *\n *  @param {Ref({})} [context=null]\n */\nfunction useContext({context=null}={}) {\n    // TODO: context as Model or reactive\n    if(context != null) {\n        const { role, roles, subscription } = (0,vue__WEBPACK_IMPORTED_MODULE_1__.toRefs)(context)\n        // FIXME context is a reactive object, break api with other case\n        ;(0,vue__WEBPACK_IMPORTED_MODULE_1__.provide)('context', (0,vue__WEBPACK_IMPORTED_MODULE_1__.readonly)(context))\n        return { context, role, roles, subscription }\n    }\n\n    if(context==null)\n        context = (0,vue__WEBPACK_IMPORTED_MODULE_1__.inject)('context')\n\n    const role = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => context.value && context.value.role)\n    const roles = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => context.value && context.value.roles)\n    const subscription = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => context.value && context.value.subscription)\n\n    return { context, role, roles, subscription }\n}\n\nuseContext.props = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.makeProps)({\n    context: { type: Object, required: true },\n})\n\n\n/**\n * Use context by id.\n */\nfunction useContextById({contextId: pk, contextEntity: entity,\n                                fetch=false, contextUrl: url}) {\n    const { object: context, ...comp } = fetch ? getOrFetch({pk, entity, url}) : getObject(id, entity)\n    return { ...comp, ...useContext({context}) }\n}\n\nuseContextById.props = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.makeProps)({\n    contextId: { type: String, default: null },\n    contextEntity: { type: String, default: 'context' },\n    contextUrl: { type: String, default: null },\n})\n\n/**\n *  Use context of an Accessible instance\n */\nfunction useParentContext(item) {\n    const context = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => item.value && item.value.context)\n    return useContext({context})\n}\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/composables/models.js?");

/***/ }),

/***/ "./assets/core/composables/utils.js":
/*!******************************************!*\
  !*** ./assets/core/composables/utils.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"makeProps\": () => (/* binding */ makeProps)\n/* harmony export */ });\n\n/**\n * Return function used to add properties related to a composable to a\n * component, as `function(override) -> {...props}`.\n *\n * Where `override` is a dict of properties default values/overriding object.\n *\n */\nfunction makeProps(source) {\n    function func(override={}) {\n        var props = {}\n        for(var key in source) {\n            var oitem = override[key]\n            var sitem = source[key]\n            if(!(oitem instanceof Object))\n                oitem = { default: oitem }\n\n            // TODO: sitem array? => type: sitem\n            props[key] = {...source[key], ...oitem}\n        }\n        return props\n    }\n    return func\n}\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/composables/utils.js?");

/***/ }),

/***/ "./assets/core/index.js":
/*!******************************!*\
  !*** ./assets/core/index.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Action\": () => (/* reexport safe */ _action__WEBPACK_IMPORTED_MODULE_1__[\"default\"]),\n/* harmony export */   \"App\": () => (/* reexport safe */ _app__WEBPACK_IMPORTED_MODULE_2__[\"default\"]),\n/* harmony export */   \"createApp\": () => (/* reexport safe */ _app__WEBPACK_IMPORTED_MODULE_2__.createApp),\n/* harmony export */   \"getScriptData\": () => (/* reexport safe */ _app__WEBPACK_IMPORTED_MODULE_2__.getScriptData),\n/* harmony export */   \"components\": () => (/* reexport module object */ _components__WEBPACK_IMPORTED_MODULE_3__),\n/* harmony export */   \"models\": () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_4__[\"default\"]),\n/* harmony export */   \"importDatabase\": () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_4__.importDatabase),\n/* harmony export */   \"Role\": () => (/* reexport safe */ _role__WEBPACK_IMPORTED_MODULE_6__[\"default\"]),\n/* harmony export */   \"modelsPlugin\": () => (/* reexport safe */ _plugins__WEBPACK_IMPORTED_MODULE_5__.modelsPlugin),\n/* harmony export */   \"addGlobals\": () => (/* binding */ addGlobals)\n/* harmony export */ });\n/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.scss */ \"./assets/core/styles.scss\");\n/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action */ \"./assets/core/action.js\");\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app */ \"./assets/core/app.js\");\n/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components */ \"./assets/core/components/index.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./models */ \"./assets/core/models.js\");\n/* harmony import */ var _plugins__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./plugins */ \"./assets/core/plugins.js\");\n/* harmony import */ var _role__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./role */ \"./assets/core/role.js\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/**\n *  Add items into `window.pepr[namespace]` object.\n */\nfunction addGlobals(namespace, globals) {\n    if(!window.pepr)\n        window.pepr = {}\n    window.pepr[namespace] = { ...(window.pepr[namespace] || {}), ...globals }\n}\n\naddGlobals('core', {\n    createApp(props) {\n        return (0,_app__WEBPACK_IMPORTED_MODULE_2__.createApp)(_app__WEBPACK_IMPORTED_MODULE_2__[\"default\"], props)\n    },\n    getScriptData: _app__WEBPACK_IMPORTED_MODULE_2__.getScriptData, importDatabase: _models__WEBPACK_IMPORTED_MODULE_4__.importDatabase\n})\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/index.js?");

/***/ }),

/***/ "./assets/core/models.js":
/*!*******************************!*\
  !*** ./assets/core/models.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"importDatabase\": () => (/* binding */ importDatabase),\n/* harmony export */   \"Model\": () => (/* binding */ Model),\n/* harmony export */   \"Role\": () => (/* binding */ Role),\n/* harmony export */   \"BaseAccessible\": () => (/* binding */ BaseAccessible),\n/* harmony export */   \"Context\": () => (/* binding */ Context),\n/* harmony export */   \"Accessible\": () => (/* binding */ Accessible),\n/* harmony export */   \"Owned\": () => (/* binding */ Owned),\n/* harmony export */   \"Subscription\": () => (/* binding */ Subscription),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _vuex_orm_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vuex-orm/core */ \"./node_modules/@vuex-orm/core/dist/vuex-orm.esm.js\");\n/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action */ \"./assets/core/action.js\");\n/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api */ \"./assets/core/api.js\");\n\n\n\n\n\n\n/**\n * Load models from data, as an Object of `{ entity: insertOrUpdateData }`\n */\nfunction importDatabase(store, data) {\n    let db = store.$db();\n    for(var entity in data) {\n        let model = db.model(entity)\n        model ? model.insertOrUpdate({ data: data[entity] })\n              : console.warn(`model ${entity} is not a registered model`)\n    }\n}\n\n\n/**\n * Base model class\n */\nclass Model extends _vuex_orm_core__WEBPACK_IMPORTED_MODULE_2__.Model {\n    /**\n\t * Django AppConfig's application label.\n\t */\n    static appLabel = 'pepr_core'\n\tstatic primaryKey = 'pk'\n\tstatic apiConfig = {\n        commit: true,\n\t}\n\n    static fields() {\n        return {\n            pk: this.string(null),\n            access: this.number(null),\n        }\n    }\n\n\t/**\n\t * Model's label (equivalent to Django's `model._meta.label_lower`).\n\t */\n    static get label() { return this.appLabel + '.' + this.entity }\n\n    /**\n     * Default model's api entry point.\n     * Defaults to `/app/label/entity/` (for `appLabel=app_label`)\n     */\n    static get url() {\n        return `/${this.appLabel.replace('_','/')}/${this.entity}/`\n    }\n\n    /**\n     * Real url of API's entry point (including store's baseURL).\n     */\n    static get fullUrl() {\n        const baseURL = this.store().baseURL\n        return (baseURL ? `${baseURL}${this.url}` : this.url).replace('//', '/')\n    }\n\n    /**\n     * Item's url (PUT or POST url).\n     */\n    get $url() {\n        return this.$id ? `${this.constructor.url}${this.$id}/`\n                        :  this.constructor.url;\n    }\n\n\t/**\n\t * Item's real url (including store's baseURL).\n\t */\n    get $fullUrl() {\n        return this.$id ? `${this.constructor.fullUrl}${this.$id}/`\n                        : this.constructor.fullUrl\n    }\n\n    /**\n     * Return model in the same database by name or class.\n\t * @param model [Model|String]\n     */\n    static model(model) {\n        model = model.prototype instanceof Model ? model.entity : model\n        return this.store().$db().model(model)\n    }\n\n    /**\n     * Return model in the same database by name or class.\n\t * @param model [Model|String]\n     */\n    $model(model) {\n        return this.constructor.model(model)\n    }\n\n    /**\n     * Return instance data (based on declared fields and their default\n     * values).\n     */\n    $data(defaults=true) {\n        const data = {}\n        for(const [key, field] of Object.entries(this.$fields()))\n            if(field instanceof _vuex_orm_core__WEBPACK_IMPORTED_MODULE_2__.Type)\n                data[key] = defaults && this[key] === undefined\n                                ? field.value : this[key]\n        return data\n    }\n\n    /**\n     * Update ORM database for this object\n     */\n    $update(data) {\n        Object.assign(this, data)\n        this.constructor.update({ where: this.$id, data })\n    }\n\n    /**\n     * Fetch one or more entities from server.\n     */\n    static fetch({id='', url=null, action='', data=null, ...config}={}) {\n        if(!id && data)\n            id = data.$id\n        if(!url)\n            url = id ? `${this.fullUrl}${id}/` : this.fullUrl\n        if(action)\n            url += `${action}/`\n\n        // django drf's results\n        if(!id && config.dataKey === undefined)\n            config.dataKey = 'results'\n\n        return this.api().fetch(url, {data, ...config})\n    }\n\n    /**\n     * Fetch item from the server\n     */\n    fetch(config) {\n        if(!this.$id)\n            throw \"item is not on server\"\n        return this.constructor.fetch({id: this.$id, ...config})\n    }\n\n    /**\n     * Save item to server and return promise\n     */\n    save(config = {}) {\n        config.data = config.data || this.$data(false)\n        config.method = config.method || (config.data.$id ? 'PUT' : 'POST')\n        return this.constructor.fetch(config)\n    }\n\n    /**\n     * Delete item from server and return promise\n     */\n    delete(config={}) {\n        if(this.$fullUrl)\n            return this.constructor.api().delete(this.$fullUrl, config).then(r => {\n                this.constructor.delete(this.$id)\n                return r\n            })\n        else\n            throw \"no api url for item\"\n    }\n}\n\n\nclass Role {\n    /* static fields() {\n        return {\n            context_id: this.string(null),\n            subscription_id: this.string(null),\n            identity_id: this.string(null),\n            access: this.number(null),\n            is_anonymous: this.boolean(false),\n            is_subscribed: this.boolean(false),\n            is_moderator: this.boolean(false),\n            is_admin: this.boolean(false),\n            permissions: this.attr(null)\n       }\n    } */\n\n    static subclass(name, statics, prototype={}) {\n        class ChildClass extends this {}\n        for(var key in statics)\n            ChildClass[key] = statics[key]\n\n        ChildClass.prototype = {...ChildClass.prototype, ...prototype}\n        return ChildClass\n    }\n\n    constructor(data=null) {\n        data && Object.assign(this, data)\n    }\n\n    get name() {\n        const roles = this.context.roles\n        return roles[this.access].name\n    }\n\n    get description() {\n        const roles = this.context.roles\n        return roles[this.access].description\n    }\n\n    /**\n     * True if all permissions are granted on this role\n     */\n    hasPermission(permission, prefix='') {\n        return this.permissions &&\n            !!this.permissions[prefix ? `${prefix}.${permission}` : permission]\n    }\n\n    /**\n     * True if all permissions are granted on this role\n     */\n    hasPermissions(permissions, prefix='') {\n        return this.permissions && !permissions.find(\n            p => this.permissions[prefix ? `${prefix}.${p}` : p]\n        )\n    }\n}\n\n\n\nclass BaseAccessible extends Model {\n\n    /**\n     * All available actions on model\n     */\n\tstatic actions = [\n\t\tnew _action__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({label: 'Delete', permissions:'delete',\n\t\t\t\t    exec: (item) => confirm('Delete?') && item.delete({delete:1}),\n\t\t\t\t    icon: 'mdi mdi-delete'}),\n\t]\n\n\t/**\n\t * Available actions on this model instance\n\t */\n\tgetActions(role) {\n\t\treturn this.constructor.actions?.filter(a => a.isGranted(role, this)) || []\n\t}\n\n    /**\n     * True if all permissions are allowed\n     *\n     * @param {Role} role - user's role to check permission of\n     * @param {...(string|Function)} permissions - permission names or\n     *                               `functions(role, this)` to test\n     */\n\tisGranted(role, ...permissions) {\n        return permissions.find(\n            p => p instanceof Function ? !p(role, this)\n                                       : !role.hasPermission(p, this.constructor.label)\n        )\n\t}\n}\n\n\nclass Context extends BaseAccessible {\n    static entity = 'context'\n    static fields() {\n        return { ...super.fields(),\n            default_access: this.number(null),\n            allow_subscription_request: this.attr(null),\n            subscription_accept_role: this.number(null),\n            subscription_default_access: this.number(null),\n            subscription_default_role: this.number(null),\n            // subsciption: this.attr(null),\n            subsciptions: this.hasMany(Subscription, 'context'),\n            n_subscriptions: this.number(0),\n            role: this.attr(null, value => new Role(value)),\n        }\n    }\n    // static actions = [ ]\n\n    static fetchRoles() {\n        if(this.roles !== undefined)\n            return new Promise(resolve => resolve(this.roles))\n        const url = `${this.fullUrl}roles/`\n        return fetch(url).then(r => r.json(), r => console.error(r))\n                         .then(r => { this.roles = this._validate_roles(r) })\n    }\n\n    static _validate_roles(value) {\n        if(!value)\n            return {}\n\n        const roles = {}\n        for(var role of value)\n            roles[role.access] = role\n        return roles\n    }\n\n    /**\n     * Return user's identity\n     */\n    get identity() {\n        let id = this.role?.identity_id\n        return id && this.constructor.find(id)\n    }\n\n    /**\n     * Return user's subscription\n     */\n    get subscription() {\n        const id = this.role?.identity_id\n        return id && this.$model('subscription').query()\n            .where({ context_id: this.$id, owner_id: id }).first()\n    }\n\n    get roles() {\n        return this.constructor.roles\n    }\n}\n\nclass Accessible extends BaseAccessible {\n    static entity = 'accessible'\n    static contextEntity = 'context'\n    static fields() {\n        return { ...super.fields(),\n            context_id: this.attr(null),\n            // context: this.belongsTo(Context, 'context_id'),\n        }\n    }\n\n    /**\n     * Model of Accessible's context\n     */\n    static get contextModel() {\n        return this.model(this.contextEntity)\n    }\n    \n    /**\n     * Available choices for 'access' attribute.\n     */\n    static accessChoices(roles, role=null) {\n        if(!Array.isArray(roles))\n            roles = Object.values(roles)\n        return role ? roles.filter((r) => r.access <= role.access) : roles\n    }\n\n    /**\n     * Parent context object.\n     */\n    get context() {\n        return this.context_id && this.constructor.contextModel.find(this.context_id)\n    }\n}\n\nclass Owned extends Accessible {\n    static entity = 'owned'\n    static fields() {\n        return { ...super.fields(),\n            owner_id: this.attr(null),\n        //    owner: this.belongsTo(Context, 'owner_id'),\n        }\n    }\n\n    isGranted(role, ...permissions) {\n        if(this.owner == role.identity)\n            return true\n        return super.isGranted(role, ...permissions)\n    }\n\n    /**\n     * Related owner object\n     */\n    get owner() {\n        return null; // Context.find(this.owner_id)\n    }\n}\n\nclass Subscription extends Owned {\n    static INVITE = 1\n    static REQUEST = 2\n    static SUBSCRIBED = 3\n\n    static entity = 'subscription'\n    static fields() {\n        return { ...super.fields(),\n            status: this.number(),\n            access: this.number(),\n            role: this.number(),\n        }\n    }\n    static actions = [\n        new _action__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\n            label: 'Accept Subscription',\n            exec: (item) => item.fetch({action: 'accept', method: 'PUT', commit: true})\n                                .then(r => {\n                                    const context = item.context\n                                    context.$update({n_subscriptions: context.n_subscriptions+1})\n                                }),\n            icon: 'mdi mdi-account-check',\n            css: 'is-success',\n            permissions: ['accept', (r, i) => i.status == Subscription.REQUEST]\n        }),\n        ...super.actions,\n    ]\n\n    static accessChoices(roles, role=null) {\n        if(roles.prototype instanceof Context)\n            roles = roles.roles\n        return super.accessChoices(roles, role)\n                    .filter(role => role.status != 'moderator' && role.status != 'admin')\n    }\n\n    /**\n     * Available choices for the 'role' attribute\n     */\n    static roleChoices(roles, role=null) {\n        return this.accessChoices(roles, role)\n                   .filter(role => role.status != 'anonymous' &&\n                                   role.status != 'registered')\n    }\n\n    isGranted(role, ...permissions) {\n        if(permissions.indexOf('accept') != -1 &&\n            (this.status != Subscription.REQUEST ||\n             !role.hasPermission('accept', this.constructor.label)))\n            return false\n        return super.isGranted(role, ...permissions)\n    }\n\n    save(config) {\n        return super.save(config).then(r => {\n            this.context && this.context.fetch()\n            return r\n        })\n    }\n\n    delete(config) {\n        const context = this.context\n        return super.delete(config).then(\n            r => {\n                context && context.fetch()\n                return r\n            },\n        )\n    }\n\n    /**\n     * Subscription is an invitation\n     */\n    get isInvite() { return this.status == Subscription.INVITE }\n\n    /**\n     * Subscription is a request\n     */\n    get isRequest() { return this.status == Subscription.REQUEST }\n\n    /**\n     * Subscription is validated\n     */\n    get isSubscribed() { return this.status == Subscription.SUBSCRIBED }\n}\n\n\nconst defaults = { Context, Subscription }\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defaults);\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/models.js?");

/***/ }),

/***/ "./assets/core/plugins.js":
/*!********************************!*\
  !*** ./assets/core/plugins.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"apiPlugin\": () => (/* binding */ apiPlugin),\n/* harmony export */   \"modelsPlugin\": () => (/* binding */ modelsPlugin),\n/* harmony export */   \"initModelsPlugin\": () => (/* binding */ initModelsPlugin)\n/* harmony export */ });\n/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vuex */ \"./node_modules/vuex/dist/vuex.esm-bundler.js\");\n/* harmony import */ var _vuex_orm_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vuex-orm/core */ \"./node_modules/@vuex-orm/core/dist/vuex-orm.esm.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models */ \"./assets/core/models.js\");\n/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api */ \"./assets/core/api.js\");\n\n\n\n\n\n\n\n\n\n\n\n/**\n * VuexORM plugin to add api related methods (using 'api.Api'\n */\nconst apiPlugin = {\n    install(components, options) {\n        components.Model.api = function() {\n            return new _api__WEBPACK_IMPORTED_MODULE_1__[\"default\"](this, options)\n        }\n    }\n}\n\n/**\n * Create Vuex ORM database using provided models. Add model getters to\n * application global properties.\n */\nconst modelsPlugin = {\n    install(app, {models={}, baseURL='', getters=true, storeConfig={}}={}) {\n        _vuex_orm_core__WEBPACK_IMPORTED_MODULE_2__[\"default\"].use(apiPlugin, { baseURL })\n\n        // store\n        const database = new _vuex_orm_core__WEBPACK_IMPORTED_MODULE_2__[\"default\"].Database()\n        for(let model of models)\n            database.register(model)\n\n        storeConfig.plugins = [ ...(storeConfig.plugins || []), _vuex_orm_core__WEBPACK_IMPORTED_MODULE_2__[\"default\"].install(database) ]\n        const store = (0,vuex__WEBPACK_IMPORTED_MODULE_3__.createStore)(storeConfig)\n        store['baseURL'] = baseURL.toString()\n        app.use(store)\n\n        getters && this.installGetters(app, models)\n    },\n\n    installGetters(app, models) {\n        const target = app.config.globalProperties;\n        for(let key in models) {\n            let model = models[key]\n            if(!target[model.name])\n                target[model.name] = target.$store.$db().model(model.entity)\n        }\n    }\n\n\n}\n\n\n/**\n * Perform initialization of provided models\n */\nconst initModelsPlugin = {\n    install(app, {models={}, tasks=[]}) {\n        const target = app.config.globalProperties\n        for(let model of models) {\n            model = target.$store.$db().model(model.entity)\n            if(!model)\n                throw `model '${model.entity}' is not declared on app`\n            if(model.prototype instanceof _models__WEBPACK_IMPORTED_MODULE_0__.Context)\n                tasks.push(model.fetchRoles())\n        }\n    }\n}\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/plugins.js?");

/***/ }),

/***/ "./assets/core/role.js":
/*!*****************************!*\
  !*** ./assets/core/role.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Role)\n/* harmony export */ });\nclass Role {\n    /* static fields() {\n        return {\n            context_id: this.string(null),\n            subscription_id: this.string(null),\n            identity_id: this.string(null),\n            access: this.number(null),\n            is_anonymous: this.boolean(false),\n            is_subscribed: this.boolean(false),\n            is_moderator: this.boolean(false),\n            is_admin: this.boolean(false),\n            permissions: this.attr(null)\n       }\n    } */\n\n    static subclass(name, statics, prototype={}) {\n        class ChildClass extends this {}\n        for(var key in statics)\n            ChildClass[key] = statics[key]\n\n        ChildClass.prototype = {...ChildClass.prototype, ...prototype}\n        return ChildClass\n    }\n\n    constructor(data=null) {\n        data && Object.assign(this, data)\n    }\n\n    get name() {\n        const roles = this.context.roles\n        return roles[this.access].name\n    }\n\n    get description() {\n        const roles = this.context.roles\n        return roles[this.access].description\n    }\n\n    /**\n     * True if all permissions are granted on this role\n     */\n    hasPermission(permission, prefix='') {\n        return this.permissions &&\n            !!this.permissions[prefix ? `${prefix}.${permission}` : permission]\n    }\n\n    /**\n     * True if all permissions are granted on this role\n     */\n    hasPermissions(permissions, prefix='') {\n        return this.permissions && !permissions.find(\n            p => this.permissions[prefix ? `${prefix}.${p}` : p]\n        )\n    }\n}\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/role.js?");

/***/ }),

/***/ "./assets/core/styles.scss":
/*!*********************************!*\
  !*** ./assets/core/styles.scss ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/styles.scss?");

/***/ }),

/***/ "./assets/core/components/action.vue":
/*!*******************************************!*\
  !*** ./assets/core/components/action.vue ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _action_vue_vue_type_template_id_eb410666__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./action.vue?vue&type=template&id=eb410666 */ \"./assets/core/components/action.vue?vue&type=template&id=eb410666\");\n/* harmony import */ var _action_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action.vue?vue&type=script&lang=js */ \"./assets/core/components/action.vue?vue&type=script&lang=js\");\n\n\n\n_action_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _action_vue_vue_type_template_id_eb410666__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_action_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"assets/core/components/action.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_action_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/action.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/action.vue?vue&type=script&lang=js":
/*!***************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/action.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _composables_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composables/models */ \"./assets/core/composables/models.js\");\n/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../action */ \"./assets/core/action.js\");\n\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    emits: ['trigger'],\n    props: {\n        item: Object,\n        action: Object,\n        dropdown: Boolean,\n        \n        label: {type: String, default: ''},\n        exec: Function,\n        permissions: [Array,String,Function],\n        icon: {type: String, default: ''},\n        help: {type: String, default: ''},\n        css: {type: String, default: ''},\n        noText: { type: Boolean, default: false }\n    },\n\n    setup(props, {emit}) {\n        const { role } = (0,_composables_models__WEBPACK_IMPORTED_MODULE_0__.useContext)()\n        const action = (0,vue__WEBPACK_IMPORTED_MODULE_2__.computed)(() => props.action || new _action__WEBPACK_IMPORTED_MODULE_1__[\"default\"](props))\n        const componentProps = (0,vue__WEBPACK_IMPORTED_MODULE_2__.computed)(() => {\n            const value = props.dropdown ?\n                {'is': 'a', 'class': 'dropdown-item ' + (action.value.css || '')} :\n                {'is': 'button', 'class': 'button m-1 ' + (action.value.css || '')}\n            return { ...value, 'title': action.help, 'aria-description': action.help}\n        })\n\n        function trigger(...args) {\n            if(props.item && action.value.exec)\n                action.value.trigger(role && role.value, props.item, ...args)\n            emit('trigger', { role: role && role.value,\n                              item: props.item,\n                              args: args })\n        }\n        return { trigger, action, componentProps }\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/action.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/actions.vue":
/*!********************************************!*\
  !*** ./assets/core/components/actions.vue ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _actions_vue_vue_type_template_id_75888414__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions.vue?vue&type=template&id=75888414 */ \"./assets/core/components/actions.vue?vue&type=template&id=75888414\");\n/* harmony import */ var _actions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actions.vue?vue&type=script&lang=js */ \"./assets/core/components/actions.vue?vue&type=script&lang=js\");\n\n\n\n_actions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _actions_vue_vue_type_template_id_75888414__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_actions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"assets/core/components/actions.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_actions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/actions.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/actions.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/actions.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _composables_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composables/models */ \"./assets/core/composables/models.js\");\n/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action */ \"./assets/core/components/action.vue\");\n\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        item: Object,\n        actions: Array,\n        dropdown: Boolean,\n        noText: { type: Boolean, default: false }\n    },\n\n    setup(props, ctx) {\n        const { role } = (0,_composables_models__WEBPACK_IMPORTED_MODULE_0__.useContext)()\n        const actions = (0,vue__WEBPACK_IMPORTED_MODULE_2__.computed)(() => props.actions || (\n            role.value && props.item?.getActions(role.value) || []\n        ))\n        return { actions }\n    },\n\n    components: { PAction: _action__WEBPACK_IMPORTED_MODULE_1__[\"default\"] },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/actions.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/context.vue":
/*!********************************************!*\
  !*** ./assets/core/components/context.vue ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _context_vue_vue_type_template_id_5fa901a8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./context.vue?vue&type=template&id=5fa901a8 */ \"./assets/core/components/context.vue?vue&type=template&id=5fa901a8\");\n/* harmony import */ var _context_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./context.vue?vue&type=script&lang=js */ \"./assets/core/components/context.vue?vue&type=script&lang=js\");\n\n\n\n_context_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _context_vue_vue_type_template_id_5fa901a8__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_context_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"assets/core/components/context.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_context_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/context.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/context.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/context.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables/index.js\");\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        ..._composables__WEBPACK_IMPORTED_MODULE_0__.useContextById.props(),\n    },\n\n    setup(props) {\n        const propsRefs = (0,vue__WEBPACK_IMPORTED_MODULE_1__.toRefs)(props)\n        const contextId = (0,vue__WEBPACK_IMPORTED_MODULE_1__.ref)(propsRefs.contextId && propsRefs.contextId.value)\n        const contextComp = _composables__WEBPACK_IMPORTED_MODULE_0__.useContextById({...propsRefs, contextId, fetch: true})\n\n        ;(0,vue__WEBPACK_IMPORTED_MODULE_1__.watch)(propsRefs.contextId, (id) => { contextId.value = id })\n\n        return {...contextComp, contextId}\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/context.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/deck.vue":
/*!*****************************************!*\
  !*** ./assets/core/components/deck.vue ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _deck_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./deck.vue?vue&type=script&lang=js */ \"./assets/core/components/deck.vue?vue&type=script&lang=js\");\n\n\n/* hot reload */\nif (false) {}\n\n_deck_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].__file = \"assets/core/components/deck.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_deck_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/deck.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/deck.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/deck.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables/index.js\");\n\n// TODO:\n// - history stack of deck\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    emits: _composables__WEBPACK_IMPORTED_MODULE_0__.singleSelect.emits,\n    props: _composables__WEBPACK_IMPORTED_MODULE_0__.singleSelect.props(),\n\n    setup(props, { emit }) {\n        // const instance = getCurrentInstance()\n        const selectComp = (0,_composables__WEBPACK_IMPORTED_MODULE_0__.singleSelect)(props, emit)\n        // watch(selectComp.selected, () => instance.ctx.$forceUpdate())\n        return selectComp\n    },\n\n    render() {\n        return (this.selected &&\n                this.$slots[this.selected] && this.$slots[this.selected]()) ||\n                (0,vue__WEBPACK_IMPORTED_MODULE_1__.h)('div')\n    },\n});\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/deck.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/field.vue":
/*!******************************************!*\
  !*** ./assets/core/components/field.vue ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _field_vue_vue_type_template_id_d2dad89a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./field.vue?vue&type=template&id=d2dad89a */ \"./assets/core/components/field.vue?vue&type=template&id=d2dad89a\");\n/* harmony import */ var _field_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./field.vue?vue&type=script&lang=js */ \"./assets/core/components/field.vue?vue&type=script&lang=js\");\n\n\n\n_field_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _field_vue_vue_type_template_id_d2dad89a__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_field_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"assets/core/components/field.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_field_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/field.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/field.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/field.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n// TODO:\n// - set/get name from/to inner control input/select/button\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        label: String,\n        name: String,\n        leftIcons: Array,\n        rightIcons: Array,\n    },\n\n    setup(props) {\n        const errors = (0,vue__WEBPACK_IMPORTED_MODULE_0__.inject)('errors')\n        const error = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => errors && errors[props.name])\n        return { error }\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/field.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/fieldRow.vue":
/*!*********************************************!*\
  !*** ./assets/core/components/fieldRow.vue ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _fieldRow_vue_vue_type_template_id_a0756752__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fieldRow.vue?vue&type=template&id=a0756752 */ \"./assets/core/components/fieldRow.vue?vue&type=template&id=a0756752\");\n/* harmony import */ var _fieldRow_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fieldRow.vue?vue&type=script&lang=js */ \"./assets/core/components/fieldRow.vue?vue&type=script&lang=js\");\n\n\n\n_fieldRow_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _fieldRow_vue_vue_type_template_id_a0756752__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_fieldRow_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"assets/core/components/fieldRow.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_fieldRow_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/fieldRow.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/fieldRow.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/fieldRow.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        label: String,\n        name: String,\n    },\n\n    setup(props) {\n        const errors = (0,vue__WEBPACK_IMPORTED_MODULE_0__.inject)('errors')\n        const error = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => errors && errors[props.name])\n        return { error }\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/fieldRow.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/form.vue":
/*!*****************************************!*\
  !*** ./assets/core/components/form.vue ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _form_vue_vue_type_template_id_05d1c81b__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=05d1c81b */ \"./assets/core/components/form.vue?vue&type=template&id=05d1c81b\");\n/* harmony import */ var _form_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js */ \"./assets/core/components/form.vue?vue&type=script&lang=js\");\n\n\n\n_form_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _form_vue_vue_type_template_id_05d1c81b__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_form_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"assets/core/components/form.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_form_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/form.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/form.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/form.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables/index.js\");\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    emits: [..._composables__WEBPACK_IMPORTED_MODULE_0__.form.emits],\n    props: {\n        ..._composables__WEBPACK_IMPORTED_MODULE_0__.useModel.props(),\n        ..._composables__WEBPACK_IMPORTED_MODULE_0__.form.props({commit:true}),\n    },\n\n    setup(props, context_) {\n        const propsRefs = (0,vue__WEBPACK_IMPORTED_MODULE_1__.toRefs)(props)\n        // const contextComp = composables.useContext()\n        const modelComp = _composables__WEBPACK_IMPORTED_MODULE_0__.useModel({...propsRefs, item: propsRefs.initial});\n        const formComp  = _composables__WEBPACK_IMPORTED_MODULE_0__.form({...propsRefs, ...modelComp}, context_)\n        const data = formComp.data\n        const method = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => modelComp.model.value ? (data.$id ? 'PUT' : 'POST')\n                                                            : (props.method || 'POST'))\n\n        function submit({event, form, ...config}={}) {\n            if(event) {\n                event.preventDefault()\n                event.stopPropagation()\n                form = form || event.target\n            }\n\n            const url = form.getAttribute('action') || props.action\n            const method = form.getAttribute('method') || method.value\n            return formComp.submit({ form, url, method, ...config})\n        }\n        \n        return {...modelComp, ...formComp, method, submit}\n    },\n\n\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/form.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/list.vue":
/*!*****************************************!*\
  !*** ./assets/core/components/list.vue ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _list_vue_vue_type_template_id_39caeef5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./list.vue?vue&type=template&id=39caeef5 */ \"./assets/core/components/list.vue?vue&type=template&id=39caeef5\");\n/* harmony import */ var _list_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./list.vue?vue&type=script&lang=js */ \"./assets/core/components/list.vue?vue&type=script&lang=js\");\n\n\n\n_list_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _list_vue_vue_type_template_id_39caeef5__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_list_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"assets/core/components/list.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_list_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/list.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/list.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/list.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables/index.js\");\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        ..._composables__WEBPACK_IMPORTED_MODULE_0__.useModel.props(),\n        ..._composables__WEBPACK_IMPORTED_MODULE_0__.getList.props(),\n        ..._composables__WEBPACK_IMPORTED_MODULE_0__.fetchList.props({ default: true }),\n    },\n\n    setup(props) {\n        let propsRefs = (0,vue__WEBPACK_IMPORTED_MODULE_1__.toRefs)(props)\n        let modelComp = _composables__WEBPACK_IMPORTED_MODULE_0__.useModel(propsRefs)\n        let listComp = _composables__WEBPACK_IMPORTED_MODULE_0__.getList({...propsRefs, ...modelComp})\n        let fetchComp = _composables__WEBPACK_IMPORTED_MODULE_0__.fetchList({...propsRefs, ...listComp})\n\n        ;(0,vue__WEBPACK_IMPORTED_MODULE_1__.watch)(propsRefs.filters, (filters) => props.fetchAuto && filters != propsRefs.filters.value\n                                                && fetchComp.fetch({filters}))\n        return {...modelComp, ...listComp, ...fetchComp}\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/list.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/modal.vue":
/*!******************************************!*\
  !*** ./assets/core/components/modal.vue ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _modal_vue_vue_type_template_id_67044834__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modal.vue?vue&type=template&id=67044834 */ \"./assets/core/components/modal.vue?vue&type=template&id=67044834\");\n/* harmony import */ var _modal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modal.vue?vue&type=script&lang=js */ \"./assets/core/components/modal.vue?vue&type=script&lang=js\");\n\n\n\n_modal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _modal_vue_vue_type_template_id_67044834__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_modal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"assets/core/components/modal.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_modal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/modal.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/modal.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/modal.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _runtimeTemplate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./runtimeTemplate */ \"./assets/core/components/runtimeTemplate.js\");\n\n/* TODO:\n    - modal-card & slots for headers & footers\n */\n\n\n// TODO: 'loading' 'error' state & related slots\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    data() {\n        return {\n            /// Fetch request controller\n            controller: null,\n            /// Html code to show\n            html: '',\n            isActive: false,\n        }\n    },\n\n    methods: {\n        hide({reset=false}={}) {\n            if(reset)\n                this.html = '';\n            this.isActive = false;\n            this.controller && this.controller.abort()\n            this.controller = null;\n        },\n\n        show({reset=false}={}) {\n            if(reset)\n                this.html = ''\n                \n            this.isActive = true;\n\n            const modal = this.$el;\n            if(!modal)\n                return\n\n            modal.focus({ preventScroll: top });\n            modal.scrollTop = 0;\n        },\n\n        toggle(opts) {\n            if(this.isActive)\n                this.hide(opts)\n            else\n                this.show(opts)\n        },\n\n        /**\n         * Fetch url and load into modal\n         */\n        load(url, config={}) {\n            if(this.controller)\n                this.controller.abort();\n\n            this.controller = new AbortController();\n            fetch(url, config)\n                .resolve(response => response.text())\n                .then(text => {\n                    this.html = html\n                    this.controller = null\n                    !this.html && this.hide()\n                }, err => { this.controller = null })\n        },\n    },\n\n    components: { PRuntimeTemplate: _runtimeTemplate__WEBPACK_IMPORTED_MODULE_0__[\"default\"] },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/modal.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/modalForm.vue":
/*!**********************************************!*\
  !*** ./assets/core/components/modalForm.vue ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _modalForm_vue_vue_type_template_id_b20a186c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modalForm.vue?vue&type=template&id=b20a186c */ \"./assets/core/components/modalForm.vue?vue&type=template&id=b20a186c\");\n/* harmony import */ var _modalForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modalForm.vue?vue&type=script&lang=js */ \"./assets/core/components/modalForm.vue?vue&type=script&lang=js\");\n\n\n\n_modalForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _modalForm_vue_vue_type_template_id_b20a186c__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_modalForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"assets/core/components/modalForm.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_modalForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/modalForm.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/modalForm.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/modalForm.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modal */ \"./assets/core/components/modal.vue\");\n/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form */ \"./assets/core/components/form.vue\");\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        ..._form__WEBPACK_IMPORTED_MODULE_1__[\"default\"].props,\n        formClass:String\n    },\n    emits: [..._form__WEBPACK_IMPORTED_MODULE_1__[\"default\"].emits],\n    methods: {\n        show({data=null, ...opts}={}) {\n            data && this.$refs.form.reset(data)\n            this.$refs.modal.show(opts)\n        },\n\n        hide(opts={}) {\n            this.$refs.modal.hide(opts)\n        },\n    },\n    components: { PModal: _modal__WEBPACK_IMPORTED_MODULE_0__[\"default\"], PForm: _form__WEBPACK_IMPORTED_MODULE_1__[\"default\"] }\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/modalForm.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/nav.vue":
/*!****************************************!*\
  !*** ./assets/core/components/nav.vue ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _nav_vue_vue_type_template_id_3d06339c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./nav.vue?vue&type=template&id=3d06339c */ \"./assets/core/components/nav.vue?vue&type=template&id=3d06339c\");\n/* harmony import */ var _nav_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nav.vue?vue&type=script&lang=js */ \"./assets/core/components/nav.vue?vue&type=script&lang=js\");\n\n\n\n_nav_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _nav_vue_vue_type_template_id_3d06339c__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_nav_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"assets/core/components/nav.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_nav_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/nav.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/nav.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/nav.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables/index.js\");\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        default: { type: String, default: 'default' },\n        // deck: { type: Object },\n    },\n\n    setup(props, { emit }) {\n        var select = (0,_composables__WEBPACK_IMPORTED_MODULE_0__.singleSelect)(props, emit)\n\n        function onClick(event) {\n            let el = event.target\n            if(!el.hasAttribute('target'))\n                return\n\n            event.preventDefault()\n            event.stopPropagation()\n\n            select.select(el.getAttribute('target'))\n        }\n        return { ...select, onClick }\n    },\n});\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/nav.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/navItem.vue":
/*!********************************************!*\
  !*** ./assets/core/components/navItem.vue ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _navItem_vue_vue_type_template_id_dd0fa162__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./navItem.vue?vue&type=template&id=dd0fa162 */ \"./assets/core/components/navItem.vue?vue&type=template&id=dd0fa162\");\n/* harmony import */ var _navItem_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./navItem.vue?vue&type=script&lang=js */ \"./assets/core/components/navItem.vue?vue&type=script&lang=js\");\n\n\n\n_navItem_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _navItem_vue_vue_type_template_id_dd0fa162__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_navItem_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"assets/core/components/navItem.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_navItem_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/navItem.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/navItem.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/navItem.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        icon: { type: String },\n        target: { type: String },\n        href: { type: String, default: '#' },\n    },\n\n    computed: {\n        isActive() {\n            return this.$parent.selected == this.target\n        },\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/navItem.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/object.vue":
/*!*******************************************!*\
  !*** ./assets/core/components/object.vue ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _object_vue_vue_type_template_id_5b94f556__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./object.vue?vue&type=template&id=5b94f556 */ \"./assets/core/components/object.vue?vue&type=template&id=5b94f556\");\n/* harmony import */ var _object_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./object.vue?vue&type=script&lang=js */ \"./assets/core/components/object.vue?vue&type=script&lang=js\");\n\n\n\n_object_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _object_vue_vue_type_template_id_5b94f556__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_object_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"assets/core/components/object.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_object_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/object.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/object.vue?vue&type=script&lang=js":
/*!***************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/object.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables/index.js\");\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        ..._composables__WEBPACK_IMPORTED_MODULE_0__.getOrFetch.props(),\n    },\n\n    setup(props) {\n        const propsRefs = (0,vue__WEBPACK_IMPORTED_MODULE_1__.toRefs)(props)\n        return _composables__WEBPACK_IMPORTED_MODULE_0__.getOrFetch(propsRefs)\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/object.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/selectRole.vue":
/*!***********************************************!*\
  !*** ./assets/core/components/selectRole.vue ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _selectRole_vue_vue_type_template_id_6f4ba4a9__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./selectRole.vue?vue&type=template&id=6f4ba4a9 */ \"./assets/core/components/selectRole.vue?vue&type=template&id=6f4ba4a9\");\n/* harmony import */ var _selectRole_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./selectRole.vue?vue&type=script&lang=js */ \"./assets/core/components/selectRole.vue?vue&type=script&lang=js\");\n\n\n\n_selectRole_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _selectRole_vue_vue_type_template_id_6f4ba4a9__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_selectRole_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"assets/core/components/selectRole.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_selectRole_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/selectRole.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/selectRole.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/selectRole.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables/index.js\");\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    inheritAttrs: false,\n    emits: ['update:value'],\n\n    props: {\n        value: { type: [Number,String], default: null },\n        roles: { type: Array, default: null },\n        filter: { type: Function, default: null },\n    },\n\n    setup(props, { emit }) {\n        const {roles, filter, value} = (0,vue__WEBPACK_IMPORTED_MODULE_1__.toRefs)(props)\n        const contextComp = _composables__WEBPACK_IMPORTED_MODULE_0__.useContext()\n        \n        const options = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => {\n            var roles_ = roles.value ? roles.value : contextComp.roles.value\n            if(!filter.value)\n                return roles_\n\n            const options = []\n            if(roles) {\n                for(var role of Object.values(roles_)) {\n                    if(filter.value(role))\n                        options.push(role)\n                }\n                options.sort((x, y) => x.access < y.access)\n            }\n            return options\n        })\n        return { ...contextComp, value, options }\n    },\n});\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/selectRole.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/subscription.vue":
/*!*************************************************!*\
  !*** ./assets/core/components/subscription.vue ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _subscription_vue_vue_type_template_id_7f3d10f4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./subscription.vue?vue&type=template&id=7f3d10f4 */ \"./assets/core/components/subscription.vue?vue&type=template&id=7f3d10f4\");\n/* harmony import */ var _subscription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./subscription.vue?vue&type=script&lang=js */ \"./assets/core/components/subscription.vue?vue&type=script&lang=js\");\n\n\n\n_subscription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _subscription_vue_vue_type_template_id_7f3d10f4__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_subscription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"assets/core/components/subscription.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_subscription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscription.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscription.vue?vue&type=script&lang=js":
/*!*********************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscription.vue?vue&type=script&lang=js ***!
  \*********************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        item: Object,\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscription.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/subscriptionButton.vue":
/*!*******************************************************!*\
  !*** ./assets/core/components/subscriptionButton.vue ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _subscriptionButton_vue_vue_type_template_id_2344f646__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./subscriptionButton.vue?vue&type=template&id=2344f646 */ \"./assets/core/components/subscriptionButton.vue?vue&type=template&id=2344f646\");\n/* harmony import */ var _subscriptionButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./subscriptionButton.vue?vue&type=script&lang=js */ \"./assets/core/components/subscriptionButton.vue?vue&type=script&lang=js\");\n\n\n\n_subscriptionButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _subscriptionButton_vue_vue_type_template_id_2344f646__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_subscriptionButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"assets/core/components/subscriptionButton.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_subscriptionButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionButton.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionButton.vue?vue&type=script&lang=js":
/*!***************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionButton.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables/index.js\");\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        modal: {type: Object},\n        noText: { type: Boolean, default: false },\n        isSmall: { type: Boolean, default: false },\n        subscription: {type: Object, default: null},\n    },\n\n    setup(props) {\n        const contextComp = _composables__WEBPACK_IMPORTED_MODULE_0__.useContext()\n        const context = contextComp.context\n        const subscription = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => props.subscription || context.value.subscription ||\n            context.value && new (context.value.$model('subscription'))({\n                context_id: context.value.$id,\n                access: context.value.subscription_default_access,\n                role: context.value.subscription_default_role,\n            })\n        )\n        return { ...contextComp, subscription }\n    },\n\n    methods: {\n        edit() {\n            this.modal.show({data: this.subscription})\n        },\n\n        subscribe() {\n            this.subscription.save()\n        },\n\n        unsubscribe() {\n            confirm(`Unsubscribe from \"${this.context.title}\"?`) &&\n                this.subscription.delete()\n        },\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionButton.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/tab.vue":
/*!****************************************!*\
  !*** ./assets/core/components/tab.vue ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _tab_vue_vue_type_template_id_7951c10e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tab.vue?vue&type=template&id=7951c10e */ \"./assets/core/components/tab.vue?vue&type=template&id=7951c10e\");\n/* harmony import */ var _tab_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tab.vue?vue&type=script&lang=js */ \"./assets/core/components/tab.vue?vue&type=script&lang=js\");\n\n\n\n_tab_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _tab_vue_vue_type_template_id_7951c10e__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_tab_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"assets/core/components/tab.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_tab_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/tab.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/tab.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/tab.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        target: String,\n        icon: String,\n        value: { type: [Object,String,Number,Boolean], default: null }\n    },\n\n    // TODO/\n    // - isActive: in data\n    // - singleSelect:\n    //      - FIXME: propsRefs as arg instead of props\n    //      - default value\n    //      - provide custom onSelect handler\n    //  - tabs:\n    //      - update isActive of item\n\n    computed: {\n        isActive() {\n            return this.$parent.selected == { target: this.target, value: this.value }\n        }\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/tab.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/tabs.vue":
/*!*****************************************!*\
  !*** ./assets/core/components/tabs.vue ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _tabs_vue_vue_type_template_id_96dbfc56__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tabs.vue?vue&type=template&id=96dbfc56 */ \"./assets/core/components/tabs.vue?vue&type=template&id=96dbfc56\");\n/* harmony import */ var _tabs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tabs.vue?vue&type=script&lang=js */ \"./assets/core/components/tabs.vue?vue&type=script&lang=js\");\n\n\n\n_tabs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].render = _tabs_vue_vue_type_template_id_96dbfc56__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_tabs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"].__file = \"assets/core/components/tabs.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_tabs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/tabs.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/tabs.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/tabs.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables/index.js\");\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    emits: _composables__WEBPACK_IMPORTED_MODULE_0__.singleSelect.emits,\n    props: _composables__WEBPACK_IMPORTED_MODULE_0__.singleSelect.props(),\n\n    setup(props, { emit }) {\n        return (0,_composables__WEBPACK_IMPORTED_MODULE_0__.singleSelect)(props, emit)\n    },\n\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/tabs.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/action.vue?vue&type=script&lang=js":
/*!*******************************************************************!*\
  !*** ./assets/core/components/action.vue?vue&type=script&lang=js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_action_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_action_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./action.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/action.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/action.vue?");

/***/ }),

/***/ "./assets/core/components/actions.vue?vue&type=script&lang=js":
/*!********************************************************************!*\
  !*** ./assets/core/components/actions.vue?vue&type=script&lang=js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_actions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_actions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./actions.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/actions.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/actions.vue?");

/***/ }),

/***/ "./assets/core/components/context.vue?vue&type=script&lang=js":
/*!********************************************************************!*\
  !*** ./assets/core/components/context.vue?vue&type=script&lang=js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_context_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_context_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./context.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/context.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/context.vue?");

/***/ }),

/***/ "./assets/core/components/deck.vue?vue&type=script&lang=js":
/*!*****************************************************************!*\
  !*** ./assets/core/components/deck.vue?vue&type=script&lang=js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_deck_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_deck_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./deck.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/deck.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/deck.vue?");

/***/ }),

/***/ "./assets/core/components/field.vue?vue&type=script&lang=js":
/*!******************************************************************!*\
  !*** ./assets/core/components/field.vue?vue&type=script&lang=js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_field_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_field_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./field.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/field.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/field.vue?");

/***/ }),

/***/ "./assets/core/components/fieldRow.vue?vue&type=script&lang=js":
/*!*********************************************************************!*\
  !*** ./assets/core/components/fieldRow.vue?vue&type=script&lang=js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_fieldRow_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_fieldRow_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./fieldRow.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/fieldRow.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/fieldRow.vue?");

/***/ }),

/***/ "./assets/core/components/form.vue?vue&type=script&lang=js":
/*!*****************************************************************!*\
  !*** ./assets/core/components/form.vue?vue&type=script&lang=js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_form_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_form_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./form.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/form.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/form.vue?");

/***/ }),

/***/ "./assets/core/components/list.vue?vue&type=script&lang=js":
/*!*****************************************************************!*\
  !*** ./assets/core/components/list.vue?vue&type=script&lang=js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_list_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_list_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./list.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/list.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/list.vue?");

/***/ }),

/***/ "./assets/core/components/modal.vue?vue&type=script&lang=js":
/*!******************************************************************!*\
  !*** ./assets/core/components/modal.vue?vue&type=script&lang=js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_modal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_modal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./modal.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/modal.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/modal.vue?");

/***/ }),

/***/ "./assets/core/components/modalForm.vue?vue&type=script&lang=js":
/*!**********************************************************************!*\
  !*** ./assets/core/components/modalForm.vue?vue&type=script&lang=js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_modalForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_modalForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./modalForm.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/modalForm.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/modalForm.vue?");

/***/ }),

/***/ "./assets/core/components/nav.vue?vue&type=script&lang=js":
/*!****************************************************************!*\
  !*** ./assets/core/components/nav.vue?vue&type=script&lang=js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_nav_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_nav_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./nav.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/nav.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/nav.vue?");

/***/ }),

/***/ "./assets/core/components/navItem.vue?vue&type=script&lang=js":
/*!********************************************************************!*\
  !*** ./assets/core/components/navItem.vue?vue&type=script&lang=js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_navItem_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_navItem_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./navItem.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/navItem.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/navItem.vue?");

/***/ }),

/***/ "./assets/core/components/object.vue?vue&type=script&lang=js":
/*!*******************************************************************!*\
  !*** ./assets/core/components/object.vue?vue&type=script&lang=js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_object_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_object_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./object.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/object.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/object.vue?");

/***/ }),

/***/ "./assets/core/components/selectRole.vue?vue&type=script&lang=js":
/*!***********************************************************************!*\
  !*** ./assets/core/components/selectRole.vue?vue&type=script&lang=js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_selectRole_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_selectRole_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./selectRole.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/selectRole.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/selectRole.vue?");

/***/ }),

/***/ "./assets/core/components/subscription.vue?vue&type=script&lang=js":
/*!*************************************************************************!*\
  !*** ./assets/core/components/subscription.vue?vue&type=script&lang=js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_subscription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_subscription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./subscription.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscription.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscription.vue?");

/***/ }),

/***/ "./assets/core/components/subscriptionButton.vue?vue&type=script&lang=js":
/*!*******************************************************************************!*\
  !*** ./assets/core/components/subscriptionButton.vue?vue&type=script&lang=js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_subscriptionButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_subscriptionButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./subscriptionButton.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionButton.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionButton.vue?");

/***/ }),

/***/ "./assets/core/components/tab.vue?vue&type=script&lang=js":
/*!****************************************************************!*\
  !*** ./assets/core/components/tab.vue?vue&type=script&lang=js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_tab_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_tab_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./tab.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/tab.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/tab.vue?");

/***/ }),

/***/ "./assets/core/components/tabs.vue?vue&type=script&lang=js":
/*!*****************************************************************!*\
  !*** ./assets/core/components/tabs.vue?vue&type=script&lang=js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_tabs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"])\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_tabs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./tabs.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/tabs.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/tabs.vue?");

/***/ }),

/***/ "./assets/core/components/action.vue?vue&type=template&id=eb410666":
/*!*************************************************************************!*\
  !*** ./assets/core/components/action.vue?vue&type=template&id=eb410666 ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_action_vue_vue_type_template_id_eb410666__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_action_vue_vue_type_template_id_eb410666__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./action.vue?vue&type=template&id=eb410666 */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/action.vue?vue&type=template&id=eb410666\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/action.vue?");

/***/ }),

/***/ "./assets/core/components/actions.vue?vue&type=template&id=75888414":
/*!**************************************************************************!*\
  !*** ./assets/core/components/actions.vue?vue&type=template&id=75888414 ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_actions_vue_vue_type_template_id_75888414__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_actions_vue_vue_type_template_id_75888414__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./actions.vue?vue&type=template&id=75888414 */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/actions.vue?vue&type=template&id=75888414\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/actions.vue?");

/***/ }),

/***/ "./assets/core/components/context.vue?vue&type=template&id=5fa901a8":
/*!**************************************************************************!*\
  !*** ./assets/core/components/context.vue?vue&type=template&id=5fa901a8 ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_context_vue_vue_type_template_id_5fa901a8__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_context_vue_vue_type_template_id_5fa901a8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./context.vue?vue&type=template&id=5fa901a8 */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/context.vue?vue&type=template&id=5fa901a8\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/context.vue?");

/***/ }),

/***/ "./assets/core/components/field.vue?vue&type=template&id=d2dad89a":
/*!************************************************************************!*\
  !*** ./assets/core/components/field.vue?vue&type=template&id=d2dad89a ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_field_vue_vue_type_template_id_d2dad89a__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_field_vue_vue_type_template_id_d2dad89a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./field.vue?vue&type=template&id=d2dad89a */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/field.vue?vue&type=template&id=d2dad89a\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/field.vue?");

/***/ }),

/***/ "./assets/core/components/fieldRow.vue?vue&type=template&id=a0756752":
/*!***************************************************************************!*\
  !*** ./assets/core/components/fieldRow.vue?vue&type=template&id=a0756752 ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_fieldRow_vue_vue_type_template_id_a0756752__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_fieldRow_vue_vue_type_template_id_a0756752__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./fieldRow.vue?vue&type=template&id=a0756752 */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/fieldRow.vue?vue&type=template&id=a0756752\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/fieldRow.vue?");

/***/ }),

/***/ "./assets/core/components/form.vue?vue&type=template&id=05d1c81b":
/*!***********************************************************************!*\
  !*** ./assets/core/components/form.vue?vue&type=template&id=05d1c81b ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_form_vue_vue_type_template_id_05d1c81b__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_form_vue_vue_type_template_id_05d1c81b__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./form.vue?vue&type=template&id=05d1c81b */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/form.vue?vue&type=template&id=05d1c81b\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/form.vue?");

/***/ }),

/***/ "./assets/core/components/list.vue?vue&type=template&id=39caeef5":
/*!***********************************************************************!*\
  !*** ./assets/core/components/list.vue?vue&type=template&id=39caeef5 ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_list_vue_vue_type_template_id_39caeef5__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_list_vue_vue_type_template_id_39caeef5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./list.vue?vue&type=template&id=39caeef5 */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/list.vue?vue&type=template&id=39caeef5\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/list.vue?");

/***/ }),

/***/ "./assets/core/components/modal.vue?vue&type=template&id=67044834":
/*!************************************************************************!*\
  !*** ./assets/core/components/modal.vue?vue&type=template&id=67044834 ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_modal_vue_vue_type_template_id_67044834__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_modal_vue_vue_type_template_id_67044834__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./modal.vue?vue&type=template&id=67044834 */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/modal.vue?vue&type=template&id=67044834\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/modal.vue?");

/***/ }),

/***/ "./assets/core/components/modalForm.vue?vue&type=template&id=b20a186c":
/*!****************************************************************************!*\
  !*** ./assets/core/components/modalForm.vue?vue&type=template&id=b20a186c ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_modalForm_vue_vue_type_template_id_b20a186c__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_modalForm_vue_vue_type_template_id_b20a186c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./modalForm.vue?vue&type=template&id=b20a186c */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/modalForm.vue?vue&type=template&id=b20a186c\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/modalForm.vue?");

/***/ }),

/***/ "./assets/core/components/nav.vue?vue&type=template&id=3d06339c":
/*!**********************************************************************!*\
  !*** ./assets/core/components/nav.vue?vue&type=template&id=3d06339c ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_nav_vue_vue_type_template_id_3d06339c__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_nav_vue_vue_type_template_id_3d06339c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./nav.vue?vue&type=template&id=3d06339c */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/nav.vue?vue&type=template&id=3d06339c\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/nav.vue?");

/***/ }),

/***/ "./assets/core/components/navItem.vue?vue&type=template&id=dd0fa162":
/*!**************************************************************************!*\
  !*** ./assets/core/components/navItem.vue?vue&type=template&id=dd0fa162 ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_navItem_vue_vue_type_template_id_dd0fa162__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_navItem_vue_vue_type_template_id_dd0fa162__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./navItem.vue?vue&type=template&id=dd0fa162 */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/navItem.vue?vue&type=template&id=dd0fa162\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/navItem.vue?");

/***/ }),

/***/ "./assets/core/components/object.vue?vue&type=template&id=5b94f556":
/*!*************************************************************************!*\
  !*** ./assets/core/components/object.vue?vue&type=template&id=5b94f556 ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_object_vue_vue_type_template_id_5b94f556__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_object_vue_vue_type_template_id_5b94f556__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./object.vue?vue&type=template&id=5b94f556 */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/object.vue?vue&type=template&id=5b94f556\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/object.vue?");

/***/ }),

/***/ "./assets/core/components/selectRole.vue?vue&type=template&id=6f4ba4a9":
/*!*****************************************************************************!*\
  !*** ./assets/core/components/selectRole.vue?vue&type=template&id=6f4ba4a9 ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_selectRole_vue_vue_type_template_id_6f4ba4a9__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_selectRole_vue_vue_type_template_id_6f4ba4a9__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./selectRole.vue?vue&type=template&id=6f4ba4a9 */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/selectRole.vue?vue&type=template&id=6f4ba4a9\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/selectRole.vue?");

/***/ }),

/***/ "./assets/core/components/subscription.vue?vue&type=template&id=7f3d10f4":
/*!*******************************************************************************!*\
  !*** ./assets/core/components/subscription.vue?vue&type=template&id=7f3d10f4 ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_subscription_vue_vue_type_template_id_7f3d10f4__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_subscription_vue_vue_type_template_id_7f3d10f4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./subscription.vue?vue&type=template&id=7f3d10f4 */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscription.vue?vue&type=template&id=7f3d10f4\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscription.vue?");

/***/ }),

/***/ "./assets/core/components/subscriptionButton.vue?vue&type=template&id=2344f646":
/*!*************************************************************************************!*\
  !*** ./assets/core/components/subscriptionButton.vue?vue&type=template&id=2344f646 ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_subscriptionButton_vue_vue_type_template_id_2344f646__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_subscriptionButton_vue_vue_type_template_id_2344f646__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./subscriptionButton.vue?vue&type=template&id=2344f646 */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionButton.vue?vue&type=template&id=2344f646\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionButton.vue?");

/***/ }),

/***/ "./assets/core/components/tab.vue?vue&type=template&id=7951c10e":
/*!**********************************************************************!*\
  !*** ./assets/core/components/tab.vue?vue&type=template&id=7951c10e ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_tab_vue_vue_type_template_id_7951c10e__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_tab_vue_vue_type_template_id_7951c10e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./tab.vue?vue&type=template&id=7951c10e */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/tab.vue?vue&type=template&id=7951c10e\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/tab.vue?");

/***/ }),

/***/ "./assets/core/components/tabs.vue?vue&type=template&id=96dbfc56":
/*!***********************************************************************!*\
  !*** ./assets/core/components/tabs.vue?vue&type=template&id=96dbfc56 ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_tabs_vue_vue_type_template_id_96dbfc56__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_tabs_vue_vue_type_template_id_96dbfc56__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./tabs.vue?vue&type=template&id=96dbfc56 */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/tabs.vue?vue&type=template&id=96dbfc56\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/tabs.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/action.vue?vue&type=template&id=eb410666":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/action.vue?vue&type=template&id=eb410666 ***!
  \*******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = {\n  key: 0,\n  class: \"icon is-small\"\n}\nconst _hoisted_2 = { key: 1 }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_component = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"component\")\n\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"span\", {\n    onClick: _cache[0] || (_cache[0] = (...args) => ($setup.trigger && $setup.trigger(...args)))\n  }, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", {\n      item: $props.item,\n      action: $setup.action\n    }, () => [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_component, (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeProps)((0,vue__WEBPACK_IMPORTED_MODULE_0__.guardReactiveProps)($setup.componentProps)), {\n        default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n          ($setup.action.icon)\n            ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"span\", _hoisted_1, [\n                (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"i\", {\n                  class: (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)($setup.action.icon)\n                }, null, 2 /* CLASS */)\n              ]))\n            : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n          (!$props.noText)\n            ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"span\", _hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($setup.action.label), 1 /* TEXT */))\n            : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n        ]),\n        _: 1 /* STABLE */\n      }, 16 /* FULL_PROPS */)\n    ])\n  ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/action.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/actions.vue?vue&type=template&id=75888414":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/actions.vue?vue&type=template&id=75888414 ***!
  \********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = {\n  key: 0,\n  class: \"dropdown hoverable\"\n}\nconst _hoisted_2 = { class: \"dropdown-trigger\" }\nconst _hoisted_3 = {\n  class: \"dropdown-menu\",\n  role: \"menu\"\n}\nconst _hoisted_4 = { class: \"dropdown-content\" }\nconst _hoisted_5 = { key: 1 }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_p_action = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-action\")\n\n  return ($props.dropdown && $setup.actions.length > 1)\n    ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"div\", _hoisted_1, [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"div\", _hoisted_2, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"button\", {}, () => [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_action, {\n              item: $props.item,\n              action: $setup.actions[0]\n            }, null, 8 /* PROPS */, [\"item\", \"action\"])\n          ])\n        ]),\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"div\", _hoisted_3, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"div\", _hoisted_4, [\n            ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($setup.actions.slice(1), (action) => {\n              return (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"item\", {\n                item: $props.item,\n                action: action\n              }, () => [\n                (action instanceof _ctx.Action)\n                  ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_p_action, {\n                      key: 0,\n                      item: $props.item,\n                      action: action,\n                      \"no-text\": $props.noText,\n                      dropdown: \"\"\n                    }, {\n                      default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n                        (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"action\")\n                      ]),\n                      _: 2 /* DYNAMIC */\n                    }, 1032 /* PROPS, DYNAMIC_SLOTS */, [\"item\", \"action\", \"no-text\"]))\n                  : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n              ])\n            }), 256 /* UNKEYED_FRAGMENT */)),\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\")\n          ])\n        ])\n      ]))\n    : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"div\", _hoisted_5, [\n        ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($setup.actions, (action) => {\n          return (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"item\", {\n            item: $props.item,\n            action: action\n          }, () => [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_action, {\n              item: $props.item,\n              action: action,\n              \"no-text\": $props.noText\n            }, {\n              default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n                (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"action\")\n              ]),\n              _: 2 /* DYNAMIC */\n            }, 1032 /* PROPS, DYNAMIC_SLOTS */, [\"item\", \"action\", \"no-text\"])\n          ])\n        }), 256 /* UNKEYED_FRAGMENT */)),\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\")\n      ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/actions.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/context.vue?vue&type=template&id=5fa901a8":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/context.vue?vue&type=template&id=5fa901a8 ***!
  \********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return (_ctx.context)\n    ? (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", {\n        key: 0,\n        context: _ctx.context,\n        role: _ctx.context.role,\n        roles: _ctx.context.roles,\n        subscription: _ctx.context.subscription\n      })\n    : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/context.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/field.vue?vue&type=template&id=d2dad89a":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/field.vue?vue&type=template&id=d2dad89a ***!
  \******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = {\n  class: /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)({field: true})\n}\nconst _hoisted_2 = {\n  key: 0,\n  class: \"label\"\n}\nconst _hoisted_3 = { class: \"icon is-small is-left\" }\nconst _hoisted_4 = { class: \"icon is-small is-right\" }\nconst _hoisted_5 = {\n  key: 1,\n  class: \"help is-danger\"\n}\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"div\", _hoisted_1, [\n    ($props.label)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"label\", _hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.label), 1 /* TEXT */))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"div\", {\n      class: (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)({control: true, hasIconsLeft: $props.leftIcons, hasIconsRight: $props.rightIcons})\n    }, [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", {\n        field: $props.name,\n        error: $setup.error\n      }),\n      ($props.leftIcons)\n        ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, { key: 0 }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($props.leftIcons, (icon) => {\n            return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"span\", _hoisted_3, [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"i\", {\n                class: (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(icon)\n              }, null, 2 /* CLASS */)\n            ]))\n          }), 256 /* UNKEYED_FRAGMENT */))\n        : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n      ($props.rightIcons)\n        ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, { key: 1 }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($props.rightIcons, (icon) => {\n            return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"span\", _hoisted_4, [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"i\", {\n                class: (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(icon)\n              }, null, 2 /* CLASS */)\n            ]))\n          }), 256 /* UNKEYED_FRAGMENT */))\n        : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n    ], 2 /* CLASS */),\n    ($setup.error)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"span\", _hoisted_5, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($setup.error), 1 /* TEXT */))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"help\")\n  ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/field.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/fieldRow.vue?vue&type=template&id=a0756752":
/*!*********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/fieldRow.vue?vue&type=template&id=a0756752 ***!
  \*********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { class: \"field is-horizontal\" }\nconst _hoisted_2 = {\n  key: 0,\n  class: \"field-label\"\n}\nconst _hoisted_3 = { class: \"label\" }\nconst _hoisted_4 = {\n  key: 1,\n  class: \"field-label\"\n}\nconst _hoisted_5 = { class: \"field-body\" }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"div\", _hoisted_1, [\n    ($props.label)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"div\", _hoisted_2, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"label\", _hoisted_3, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.label), 1 /* TEXT */)\n        ]))\n      : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"div\", _hoisted_4)),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"div\", _hoisted_5, [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\")\n    ])\n  ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/fieldRow.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/form.vue?vue&type=template&id=05d1c81b":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/form.vue?vue&type=template&id=05d1c81b ***!
  \*****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = [\"method\", \"action\"]\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"form\", {\n    method: $setup.method,\n    action: _ctx.action,\n    onSubmit: _cache[0] || (_cache[0] = $event => ($setup.submit({event: $event})))\n  }, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", (0,vue__WEBPACK_IMPORTED_MODULE_0__.mergeProps)({\n      model: _ctx.model,\n      data: _ctx.data,\n      reset: _ctx.reset,\n      resetErrors: _ctx.resetErrors\n    }, _ctx.$attrs))\n  ], 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_1))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/form.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/list.vue?vue&type=template&id=39caeef5":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/list.vue?vue&type=template&id=39caeef5 ***!
  \*****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_p_list_filters = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-list-filters\")\n\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [\n    (_ctx.$slots.filters)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_p_list_filters, {\n          key: 0,\n          onSubmit: _cache[0] || (_cache[0] = $event => (_ctx.fetch($event)))\n        }, {\n          default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"filters\", {\n              list: _ctx.list,\n              pagination: _ctx.pagination\n            })\n          ]),\n          _: 3 /* FORWARDED */\n        }))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n    (_ctx.list)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, { key: 1 }, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"top\", {\n            list: _ctx.list,\n            pagination: _ctx.pagination,\n            fetch: _ctx.fetch,\n            fetchNext: _ctx.fetchNext,\n            fetchPrev: _ctx.fetchPrev\n          }),\n          ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)(_ctx.list, (item, index) => {\n            return (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"item\", {\n              index: index,\n              item: item,\n              list: _ctx.list,\n              pagination: _ctx.pagination,\n              fetch: _ctx.fetch,\n              fetchNext: _ctx.fetchNext,\n              fetchPrev: _ctx.fetchPrev\n            })\n          }), 256 /* UNKEYED_FRAGMENT */)),\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"bottom\", {\n            list: _ctx.list,\n            pagination: _ctx.pagination,\n            fetch: _ctx.fetch,\n            fetchNext: _ctx.fetchNext,\n            fetchPrev: _ctx.fetchPrev\n          })\n        ], 64 /* STABLE_FRAGMENT */))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n  ], 64 /* STABLE_FRAGMENT */))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/list.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/modal.vue?vue&type=template&id=67044834":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/modal.vue?vue&type=template&id=67044834 ***!
  \******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = [\"aria-hidden\"]\nconst _hoisted_2 = {\n  class: \"modal-content\",\n  role: \"document\"\n}\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_p_runtime_template = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-runtime-template\")\n\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"div\", {\n    role: \"dialog\",\n    tabindex: -1,\n    \"aria-modal\": \"true\",\n    \"aria-hidden\": !$data.isActive,\n    class: (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)({modal: true, 'is-active': $data.isActive}),\n    onKeydown: _cache[2] || (_cache[2] = (0,vue__WEBPACK_IMPORTED_MODULE_0__.withKeys)($event => ($options.hide()), [\"esc\"]))\n  }, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"div\", {\n      class: \"modal-background\",\n      onClick: _cache[0] || (_cache[0] = (0,vue__WEBPACK_IMPORTED_MODULE_0__.withModifiers)($event => ($options.hide()), [\"self\"]))\n    }),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"div\", _hoisted_2, [\n      ($data.html)\n        ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_p_runtime_template, {\n            key: 0,\n            template: $data.html\n          }, null, 8 /* PROPS */, [\"template\"]))\n        : (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", {\n            key: 1,\n            isActive: $data.isActive,\n            hide: $options.hide,\n            show: $options.show,\n            toggle: $options.toggle,\n            load: $options.load\n          })\n    ]),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"button\", {\n      class: \"modal-close is-large\",\n      \"aria-label\": \"close\",\n      onClick: _cache[1] || (_cache[1] = $event => ($options.hide()))\n    })\n  ], 42 /* CLASS, PROPS, HYDRATE_EVENTS */, _hoisted_1))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/modal.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/modalForm.vue?vue&type=template&id=b20a186c":
/*!**********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/modalForm.vue?vue&type=template&id=b20a186c ***!
  \**********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_p_form = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-form\")\n  const _component_p_modal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-modal\")\n\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_p_modal, { ref: \"modal\" }, {\n    default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_form, (0,vue__WEBPACK_IMPORTED_MODULE_0__.mergeProps)({ ref: \"form\" }, _ctx.$props, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toHandlers)(_ctx.$listeners), {\n        class: $props.formClass,\n        onDone: _cache[0] || (_cache[0] = $event => ($options.hide())),\n        onSuccess: _cache[1] || (_cache[1] = $event => ($options.hide()))\n      }), {\n        default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)((formProps) => [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", (0,vue__WEBPACK_IMPORTED_MODULE_0__.mergeProps)(formProps, {\n            hide: $options.hide,\n            show: $options.show,\n            modal: _ctx.$refs.modal,\n            form: _ctx.$refs.form\n          }))\n        ]),\n        _: 3 /* FORWARDED */\n      }, 16 /* FULL_PROPS */, [\"class\"])\n    ]),\n    _: 3 /* FORWARDED */\n  }, 512 /* NEED_PATCH */))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/modalForm.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/nav.vue?vue&type=template&id=3d06339c":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/nav.vue?vue&type=template&id=3d06339c ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"nav\", {\n    onClick: _cache[0] || (_cache[0] = (...args) => ($setup.onClick && $setup.onClick(...args)))\n  }, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\")\n  ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/nav.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/navItem.vue?vue&type=template&id=dd0fa162":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/navItem.vue?vue&type=template&id=dd0fa162 ***!
  \********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = [\"href\", \"target\"]\nconst _hoisted_2 = {\n  key: 0,\n  class: \"icon is-small\"\n}\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"a\", {\n    class: (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)({ 'is-active': $options.isActive }),\n    href: $props.href,\n    target: $props.target\n  }, [\n    ($props.icon)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"span\", _hoisted_2, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"i\", {\n            class: (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)($props.icon)\n          }, null, 2 /* CLASS */)\n        ]))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\")\n  ], 10 /* CLASS, PROPS */, _hoisted_1))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/navItem.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/object.vue?vue&type=template&id=5b94f556":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/object.vue?vue&type=template&id=5b94f556 ***!
  \*******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return null\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/object.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/selectRole.vue?vue&type=template&id=6f4ba4a9":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/selectRole.vue?vue&type=template&id=6f4ba4a9 ***!
  \***********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { class: \"control has-icons-left\" }\nconst _hoisted_2 = { class: \"select\" }\nconst _hoisted_3 = [\"value\", \"selected\"]\nconst _hoisted_4 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"span\", { class: \"icon is-left\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"i\", { class: \"mdi mdi-eye\" })\n], -1 /* HOISTED */)\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"div\", _hoisted_1, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"div\", _hoisted_2, [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)((0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"select\", (0,vue__WEBPACK_IMPORTED_MODULE_0__.mergeProps)(_ctx.$attrs, {\n        \"onUpdate:modelValue\": _cache[0] || (_cache[0] = $event => ($setup.value = $event))\n      }), [\n        ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($setup.options, (role) => {\n          return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"option\", {\n            value: role.access,\n            selected: role.access == $setup.value\n          }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(role.name), 9 /* TEXT, PROPS */, _hoisted_3))\n        }), 256 /* UNKEYED_FRAGMENT */))\n      ], 16 /* FULL_PROPS */), [\n        [vue__WEBPACK_IMPORTED_MODULE_0__.vModelSelect, $setup.value]\n      ])\n    ]),\n    _hoisted_4\n  ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/selectRole.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscription.vue?vue&type=template&id=7f3d10f4":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscription.vue?vue&type=template&id=7f3d10f4 ***!
  \*************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { key: 0 }\nconst _hoisted_2 = { key: 1 }\nconst _hoisted_3 = { class: \"icon is-large has-text-info\" }\nconst _hoisted_4 = {\n  key: 0,\n  class: \"mdi mdi-account\"\n}\nconst _hoisted_5 = {\n  key: 1,\n  class: \"mdi mdi-account-question\",\n  title: \"Awaiting for approval\"\n}\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", { item: $props.item }, () => [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"div\", null, [\n      ($props.item.owner && $props.item.owner.title)\n        ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"span\", _hoisted_1, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.item.owner.title), 1 /* TEXT */))\n        : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"span\", _hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.item.owner_id) + \" (not visible)\", 1 /* TEXT */)),\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"div\", _hoisted_3, [\n        ($props.item.isSubscribed)\n          ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"span\", _hoisted_4))\n          : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"span\", _hoisted_5))\n      ])\n    ])\n  ])\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscription.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionButton.vue?vue&type=template&id=2344f646":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionButton.vue?vue&type=template&id=2344f646 ***!
  \*******************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = {\n  key: 0,\n  class: \"dropdown is-hoverable\"\n}\nconst _hoisted_2 = { class: \"dropdown-trigger\" }\nconst _hoisted_3 = { class: \"field has-addons\" }\nconst _hoisted_4 = { class: \"control\" }\nconst _hoisted_5 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"span\", { class: \"icon\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"i\", { class: \"mdi mdi-account-multiple-check\" })\n], -1 /* HOISTED */)\nconst _hoisted_6 = { key: 0 }\nconst _hoisted_7 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"span\", { class: \"icon\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"i\", { class: \"mdi mdi-account-question\" })\n], -1 /* HOISTED */)\nconst _hoisted_8 = { key: 0 }\nconst _hoisted_9 = [\"title\"]\nconst _hoisted_10 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"span\", { class: \"icon\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"i\", { class: \"mdi mdi-account-multiple-plus\" })\n], -1 /* HOISTED */)\nconst _hoisted_11 = { key: 0 }\nconst _hoisted_12 = {\n  key: 0,\n  class: \"control\"\n}\nconst _hoisted_13 = { class: \"button is-white\" }\nconst _hoisted_14 = {\n  class: \"dropdown-menu\",\n  role: \"menu\"\n}\nconst _hoisted_15 = {\n  key: 0,\n  class: \"dropdown-content\"\n}\nconst _hoisted_16 = {\n  key: 1,\n  class: \"dropdown-content\"\n}\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return (_ctx.roles)\n    ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"div\", _hoisted_1, [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"div\", _hoisted_2, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"div\", _hoisted_3, [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"div\", _hoisted_4, [\n              ($setup.subscription && $setup.subscription.isSubscribed)\n                ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"button\", {\n                    key: 0,\n                    class: (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(['button is-info', $props.isSmall && 'is-small']),\n                    onClick: _cache[0] || (_cache[0] = (...args) => ($options.edit && $options.edit(...args)))\n                  }, [\n                    _hoisted_5,\n                    (!$props.noText)\n                      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"span\", _hoisted_6, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(_ctx.roles[_ctx.role.access].name), 1 /* TEXT */))\n                      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n                  ], 2 /* CLASS */))\n                : ($setup.subscription && $setup.subscription.isRequest)\n                  ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"button\", {\n                      key: 1,\n                      class: (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(['button is-info', $props.isSmall && 'is-small']),\n                      onClick: _cache[1] || (_cache[1] = (...args) => ($options.edit && $options.edit(...args)))\n                    }, [\n                      _hoisted_7,\n                      (!$props.noText)\n                        ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"span\", _hoisted_8, \"Request sent\"))\n                        : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n                    ], 2 /* CLASS */))\n                  : (!$setup.subscription || !$setup.subscription.isSubscribed)\n                    ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"button\", {\n                        key: 2,\n                        class: (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(['button is-link', $props.isSmall && 'is-small']),\n                        title: `Subscribe as ${_ctx.roles[_ctx.context.subscription_default_role].name}`,\n                        onClick: _cache[2] || (_cache[2] = (...args) => ($options.subscribe && $options.subscribe(...args)))\n                      }, [\n                        _hoisted_10,\n                        (!$props.noText)\n                          ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"span\", _hoisted_11, \"Subscribe\"))\n                          : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n                      ], 10 /* CLASS, PROPS */, _hoisted_9))\n                    : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\" Accept Invite \")\n            ]),\n            (!$props.noText)\n              ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"div\", _hoisted_12, [\n                  (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"button\", _hoisted_13, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(_ctx.context.n_subscriptions), 1 /* TEXT */)\n                ]))\n              : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n          ])\n        ]),\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"div\", _hoisted_14, [\n          (!$setup.subscription)\n            ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"div\", _hoisted_15, [\n                (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"a\", {\n                  class: \"dropdown-item\",\n                  onClick: _cache[3] || (_cache[3] = (...args) => ($options.edit && $options.edit(...args)))\n                }, \"Subscribe...\")\n              ]))\n            : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"div\", _hoisted_16, [\n                (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"a\", {\n                  class: \"dropdown-item\",\n                  onClick: _cache[4] || (_cache[4] = (...args) => ($options.unsubscribe && $options.unsubscribe(...args)))\n                }, \"Unsubscribe\")\n              ]))\n        ])\n      ]))\n    : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionButton.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/tab.vue?vue&type=template&id=7951c10e":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/tab.vue?vue&type=template&id=7951c10e ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = {\n  key: 0,\n  class: \"icon\"\n}\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"li\", {\n    class: (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)({'is-active': $options.isActive})\n  }, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"a\", {\n      class: (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)({'is-active': $options.isActive}),\n      onClick: _cache[0] || (_cache[0] = $event => (_ctx.$parent.select({target: $props.target, value: $props.value})))\n    }, [\n      ($props.icon)\n        ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"span\", _hoisted_1, [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"i\", {\n              class: (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)($props.icon)\n            }, null, 2 /* CLASS */)\n          ]))\n        : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", { isActive: $options.isActive })\n    ], 2 /* CLASS */)\n  ], 2 /* CLASS */))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/tab.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/tabs.vue?vue&type=template&id=96dbfc56":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/tabs.vue?vue&type=template&id=96dbfc56 ***!
  \*****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(\"div\", null, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)(\"ul\", null, [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", {\n        selected: _ctx.selected,\n        select: _ctx.select\n      })\n    ])\n  ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/tabs.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"core": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkpepr_assets"] = self["webpackChunkpepr_assets"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./assets/core/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;