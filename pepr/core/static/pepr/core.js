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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Action)\n/* harmony export */ });\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models */ \"./assets/core/models.js\");\n\n\n\nclass Action {\n    constructor(name, permissions, exec=null) {\n        this.name = name\n        this.permissions = Array.isArray(permissions) ? permissions : [permissions]\n        if(exec)\n            this.exec = exec\n    }\n\n    isGranted(role, item) {\n        return role.isGranted(this.permissions, item)\n    }\n\n    trigger(item, ...args) {\n        let role = item.context && item.context.role\n        if(role && this.isGranted(role, item))\n            this.exec(item, ...args)\n    }\n}\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/action.js?");

/***/ }),

/***/ "./assets/core/app.js":
/*!****************************!*\
  !*** ./assets/core/app.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   \"createApp\": () => (/* binding */ createApp),\n/* harmony export */   \"getScriptData\": () => (/* binding */ getScriptData)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components */ \"./assets/core/components/index.js\");\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./composables */ \"./assets/core/composables.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./models */ \"./assets/core/models.js\");\n/* harmony import */ var _plugins__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./plugins */ \"./assets/core/plugins.js\");\n\n\n\n\n\n\n\n\n\n/**\n * Base Pepr's application configuration.\n *\n * Context:\n * - useContext\n *\n * Provide:\n * - baseUrl\n * - roles\n */\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    // Django already uses \"{{\" and \"}}\" delimiters for template rendering\n    delimiters: ['[[', ']]'],\n    components: _components__WEBPACK_IMPORTED_MODULE_0__,\n\n    props: {\n        ..._composables__WEBPACK_IMPORTED_MODULE_1__.useContextById.props,\n        roles: Object,\n    },\n\n    setup(props, context_) {\n        const propsRefs = (0,vue__WEBPACK_IMPORTED_MODULE_4__.toRefs)(props)\n        const contextComp = _composables__WEBPACK_IMPORTED_MODULE_1__.useContextById(propsRefs.contextId, propsRefs.contextEntity)\n\n        ;(0,vue__WEBPACK_IMPORTED_MODULE_4__.provide)('roles', propsRefs.roles)\n\n        return {...contextComp}\n    },\n});\n\n\n/**\n * Create application setting up plugins etc.\n */\nfunction createApp(app, {baseURL='/api', models=null, storeConfig={}}={}) {\n    app = createApp(app)\n    if(models !== null)\n        app.use(_plugins__WEBPACK_IMPORTED_MODULE_3__.modelsPlugin, {baseURL, models, storeConfig})\n    return app\n}\n\n/**\n * Load data from JSON <script> element, matching provided querySelector.\n * Return a promise resolving to the config object.\n *\n * If `async` is true, resolve on document `load` event.\n */\nfunction getScriptData(el) {\n    let elm = document.querySelector(el)\n    if(elm.text) {\n        const data = JSON.parse(elm.text)\n        if(data)\n            return data\n    }\n}\n\n\n\n/**\n    /// Fetch application from server and load.\n    /// TODO/FIXME: handling new application config and models etc.\n    fetch(url, {el='app', ...options}={}) {\n        return fetch(url, options).then(response => response.text())\n            .then(content => {\n                let doc = new DOMParser().parseFromString(content, 'text/html')\n                let app = doc.getElementById('app')\n                content = app ? app.innerHTML : content\n                return this.load({sync: true, content, title: doc.title, url })\n            })\n    }\n\n    /// Save application state into browser history\n    historySave(url,replace=false) {\n        const el = document.querySelector(this.config.el)\n        const state = {\n            // TODO: el: this.config.el,\n            content: el.innerHTML,\n            title: document.title,\n        }\n\n        if(replace)\n            history.replaceState(state, '', url)\n        else\n            history.pushState(state, '', url)\n    }\n\n    /// Load application from browser history's state\n    historyLoad(state) {\n        return this.load({ content: state.content, title: state.title })\n    }\n*/\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/app.js?");

/***/ }),

/***/ "./assets/core/components/index.js":
/*!*****************************************!*\
  !*** ./assets/core/components/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"copyProps\": () => (/* binding */ copyProps),\n/* harmony export */   \"PField\": () => (/* reexport safe */ _field__WEBPACK_IMPORTED_MODULE_0__.default),\n/* harmony export */   \"PFieldRow\": () => (/* reexport safe */ _field__WEBPACK_IMPORTED_MODULE_0__.default),\n/* harmony export */   \"PDeck\": () => (/* reexport safe */ _deck__WEBPACK_IMPORTED_MODULE_1__.default),\n/* harmony export */   \"PList\": () => (/* reexport safe */ _list__WEBPACK_IMPORTED_MODULE_2__.default),\n/* harmony export */   \"PModal\": () => (/* reexport safe */ _modal__WEBPACK_IMPORTED_MODULE_3__.default),\n/* harmony export */   \"PNav\": () => (/* reexport safe */ _nav__WEBPACK_IMPORTED_MODULE_4__.default),\n/* harmony export */   \"PNavItem\": () => (/* reexport safe */ _navItem__WEBPACK_IMPORTED_MODULE_5__.default),\n/* harmony export */   \"PRuntimeTemplate\": () => (/* reexport safe */ _runtimeTemplate__WEBPACK_IMPORTED_MODULE_6__.default),\n/* harmony export */   \"PContext\": () => (/* reexport safe */ _context__WEBPACK_IMPORTED_MODULE_7__.default),\n/* harmony export */   \"PContextForm\": () => (/* reexport safe */ _contextForm__WEBPACK_IMPORTED_MODULE_8__.default),\n/* harmony export */   \"PSelectRole\": () => (/* reexport safe */ _selectRole__WEBPACK_IMPORTED_MODULE_9__.default),\n/* harmony export */   \"PSubscription\": () => (/* reexport safe */ _subscription__WEBPACK_IMPORTED_MODULE_10__.default),\n/* harmony export */   \"PSubscriptionButton\": () => (/* reexport safe */ _subscriptionButton__WEBPACK_IMPORTED_MODULE_11__.default),\n/* harmony export */   \"PSubscriptionForm\": () => (/* reexport safe */ _subscriptionForm__WEBPACK_IMPORTED_MODULE_12__.default),\n/* harmony export */   \"PSubscriptionList\": () => (/* reexport safe */ _subscriptionList__WEBPACK_IMPORTED_MODULE_13__.default)\n/* harmony export */ });\n/* harmony import */ var _field__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./field */ \"./assets/core/components/field.vue\");\n/* harmony import */ var _deck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./deck */ \"./assets/core/components/deck.vue\");\n/* harmony import */ var _list__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./list */ \"./assets/core/components/list.vue\");\n/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modal */ \"./assets/core/components/modal.vue\");\n/* harmony import */ var _nav__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./nav */ \"./assets/core/components/nav.vue\");\n/* harmony import */ var _navItem__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./navItem */ \"./assets/core/components/navItem.vue\");\n/* harmony import */ var _runtimeTemplate__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./runtimeTemplate */ \"./assets/core/components/runtimeTemplate.js\");\n/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./context */ \"./assets/core/components/context.vue\");\n/* harmony import */ var _contextForm__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./contextForm */ \"./assets/core/components/contextForm.vue\");\n/* harmony import */ var _selectRole__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./selectRole */ \"./assets/core/components/selectRole.vue\");\n/* harmony import */ var _subscription__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./subscription */ \"./assets/core/components/subscription.vue\");\n/* harmony import */ var _subscriptionButton__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./subscriptionButton */ \"./assets/core/components/subscriptionButton.vue\");\n/* harmony import */ var _subscriptionForm__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./subscriptionForm */ \"./assets/core/components/subscriptionForm.vue\");\n/* harmony import */ var _subscriptionList__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./subscriptionList */ \"./assets/core/components/subscriptionList.vue\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nfunction copyProps(source, override) {\n    const props = {}\n    for(const key in source) {\n        const value = source[key]\n        const ovalue = override[key]\n        if(ovalue instanceof Object && value instanceof Object)\n            props[key] = { ...value, ...ovalue }\n        else\n            props[key] = ovalue\n    }\n    return props\n}\n\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/index.js?");

/***/ }),

/***/ "./assets/core/components/runtimeTemplate.js":
/*!***************************************************!*\
  !*** ./assets/core/components/runtimeTemplate.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/**\n * This code originally comes from v-runtime-template by Alex Jovern. It includes\n * PR#33 and is adapted to Vue 3.\n * The following code is under MIT license (Copyright (c) 2018 Alex Jover).\n */\n\n\nconst defineDescriptor = (src, dest, name) => {\n  if (!dest.hasOwnProperty(name)) {\n    const descriptor = Object.getOwnPropertyDescriptor(src, name);\n    Object.defineProperty(dest, name, descriptor);\n  }\n};\n\nconst merge = objs => {\n  const res = {};\n  objs.forEach(obj => {\n    obj &&\n      Object.getOwnPropertyNames(obj).forEach(name =>\n        defineDescriptor(obj, res, name)\n      );\n  });\n  return res;\n};\n\nconst buildFromProps = (obj, props) => {\n  const res = {};\n  props.forEach(prop => defineDescriptor(obj, res, prop));\n  return res;\n};\n\nconst buildPassthrough = (self, source, target, attr) => {\n    [self, source] = [self[attr], source[attr] || {}];\n    let dest = target[attr] || {};\n    for(var key of Object.keys(source))\n        if(self === undefined || self[key] === undefined)\n            dest[key] = source[key];\n    target[attr] = dest;\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  props: {\n    template: String\n  },\n  render() {\n    if (this.template) {\n      let passthrough = {};\n      buildPassthrough(self, this.$parent, passthrough, '$data');\n      buildPassthrough(self, this.$parent, passthrough, '$props');\n      buildPassthrough(self, this.$parent.$options, passthrough, 'components');\n      buildPassthrough(self, this.$parent.$options, passthrough, 'computed');\n      buildPassthrough(self, this.$parent.$options, passthrough, 'methods');\n\n      const methodKeys = Object.keys(passthrough.methods);\n      const dataKeys = Object.keys(passthrough.$data);\n      const propKeys = Object.keys(passthrough.$props);\n      const allKeys = dataKeys.concat(propKeys).concat(methodKeys);\n      const methodsFromProps = buildFromProps(this.$parent, methodKeys);\n      const props = merge([passthrough.$data, passthrough.$props, methodsFromProps]);\n\n      const dynamic = {\n        template: this.template || \"<div></div>\",\n        props: allKeys,\n        computed: passthrough.computed,\n        components: passthrough.components\n      };\n\n      return (0,vue__WEBPACK_IMPORTED_MODULE_0__.h)(dynamic, {\n        props\n      });\n    }\n  }\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/runtimeTemplate.js?");

/***/ }),

/***/ "./assets/core/composables.js":
/*!************************************!*\
  !*** ./assets/core/composables.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"makeProps\": () => (/* binding */ makeProps),\n/* harmony export */   \"useModel\": () => (/* binding */ useModel),\n/* harmony export */   \"getObject\": () => (/* binding */ getObject),\n/* harmony export */   \"getOrFetch\": () => (/* binding */ getOrFetch),\n/* harmony export */   \"useContext\": () => (/* binding */ useContext),\n/* harmony export */   \"useContextById\": () => (/* binding */ useContextById),\n/* harmony export */   \"useParentContext\": () => (/* binding */ useParentContext),\n/* harmony export */   \"form\": () => (/* binding */ form),\n/* harmony export */   \"singleSelect\": () => (/* binding */ singleSelect)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vuex */ \"./node_modules/vuex/dist/vuex.esm-bundler.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models */ \"./assets/core/models.js\");\n\n\n\n\n\n\n/**\n * Return function used to add properties related to a composable to a\n * component, as `function(override) -> {...props}`.\n *\n * Where `override` is a dict of properties default values/overriding object.\n *\n */\nfunction makeProps(source) {\n    function func(override={}) {\n        var props = {}\n        for(var key in source) {\n            var oitem = override[key]\n            if(oitem instanceof Object)\n                props[key] = {...source[key], ...oitem}\n            else\n                props[key] = oitem\n        }\n        return props\n    }\n    return func\n}\n\n\n/**\n *  Provide model class using component's store\n */\nfunction useModel({entity=null, item=null}=null) {\n    const model = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() =>\n        (entity && entity.value) ? userStore().$db().model(entity.value)\n                                 : item && item.value.constructor || null)\n    return { model }\n}\n\n\n/**\n * Get model instance by id. If not present, fetch from remote server.\n */\nfunction getObject(id, entity) {\n    const model = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => entity.value && userStore().$db().model(entity.value))\n    const object = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => model.value && model.value.find(id.value))\n    return { model, object }\n}\n\n/**\n * Get model instance by id. If not present, fetch from remote server.\n */\nfunction getOrFetch(id, entity) {\n    const { model, object } = getObject(id, entity)\n\n    function fetch(id) {\n        var obj = model.value && model.value.find(id.value)\n        if(obj == null || obj.value == null)\n            model.value.fetch(id).then(r => {\n                // model.insertOrUpdate({data: r.response.data })\n                // return r\n            })\n    }\n    (0,vue__WEBPACK_IMPORTED_MODULE_1__.watch)(id, fetch)\n\n    return { model, object }\n}\n\n\n/**\n *  Add context's information to component.\n *\n *  Context:\n *  - context: current context\n *  - role: user's role\n *  - roles: available roles (injected from App)\n *\n *  Provide:\n *  - context: current context\n *  - role: current role\n *\n *  @param {Ref(Model)} context\n */\nfunction useContext(context) {\n    const role = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => context.value && context.value.role)\n    const roles = (0,vue__WEBPACK_IMPORTED_MODULE_1__.inject)('roles')\n    const subscription = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => context.value && context.value.subscription)\n\n    ;(0,vue__WEBPACK_IMPORTED_MODULE_1__.provide)('context', context)\n    ;(0,vue__WEBPACK_IMPORTED_MODULE_1__.provide)('role', role)\n    ;(0,vue__WEBPACK_IMPORTED_MODULE_1__.provide)('subscription', subscription)\n\n    return { context, role, roles, subscription }\n}\n\nuseContext.props = makeProps({\n    context: { type: Object, required: true },\n})\n\n\n/**\n * Use context by id.\n */\nfunction useContextById({contextId: id, contextEntity: entity, fetch=false}) {\n    const { object: context } = fetch ? getOrFetch(id, entity) : getObject(id, entity)\n    return useContext(context)\n}\n\nuseContextById.props = makeProps({\n    contextId: { type: String, default: null },\n    contextEntity: { type: String, default: 'context' },\n})\n\n/**\n *  Use context of an Accessible instance\n */\nfunction useParentContext(item) {\n    const context = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => item.value && item.value.context)\n    return useContext(context)\n}\n\n\n\n/**\n * Composable handling form, handling both Model and regular objects.\n * It sends data using XmlHttpRequest.\n *\n * Provides: 'errors' (errors returned by the server)\n *\n * @param {Ref({})} initial         initial data of form's fields\n * @param {Ref({})} defaults        default values of form's fields\n * @param bool      commit          use Model.save and commit changes to store\n * @param {}        submitConfig    extra config to pass to submit method\n *\n * @fires form#success\n * @fires form#error\n * @fires form#reset\n *\n */\nfunction form({initial: initial_, defaults = null,\n                      constructor: constructor_ = null, commit=false,\n                      submitConfig={}}, { emit })\n{\n    const initial = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => initial_.value || defaults && defaults.value || {})\n    const constructor = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() =>\n        constructor.value ? typeof(constructor.value) == 'string'\n                          ? (0,vuex__WEBPACK_IMPORTED_MODULE_2__.useStore)().$db().model(constructor.value)\n                          : constructor.value\n                          : initial.value.constructor\n    )\n    const data = (0,vue__WEBPACK_IMPORTED_MODULE_1__.reactive)(new constructor.value({...initial.value}))\n    const errors = (0,vue__WEBPACK_IMPORTED_MODULE_1__.reactive)({})\n    ;(0,vue__WEBPACK_IMPORTED_MODULE_1__.provide)('errors', errors)\n\n\n    function reset(value=null) {\n        for(var k in data)\n            delete data[k]\n\n        resetErrors()\n\n        Object.assign(data, value || initial.value)\n        emit('reset', data)\n    }\n\n    function resetErrors(value=null) {\n        for(var k in errors)\n            delete errors[k]\n\n        if(value) {\n            Object.assign(errors, value)\n            emit('error', r.data)\n        }\n    }\n\n    function submitForm(ev, form=null) {\n        if(ev) {\n            ev.preventDefault()\n            ev.stopPropagation()\n        }\n\n        form = form || ev.target\n        url = form.getAttribute('action')\n        method = form.getAttribute('method')\n\n        const res = (commit && data.value instanceof _models__WEBPACK_IMPORTED_MODULE_0__.Model) ?\n            data.value.save({form, url, method, ...submitConfig}) :\n            (0,_models__WEBPACK_IMPORTED_MODULE_0__.submit)({form, url, method, ...submitConfig})\n\n\n        return res.then(r => {\n            if(200 <= r.status < 300) {\n                reset(r.data)\n                emit('success', r.data)\n            }\n            else if(r.errors)\n                resetErrors(r.data)\n            return r\n        })\n    }\n\n    reset()\n    ;(0,vue__WEBPACK_IMPORTED_MODULE_1__.watch)(initial, reset)\n    ;(0,vue__WEBPACK_IMPORTED_MODULE_1__.watch)(constructor, reset)\n    return { initial, data, errors, reset, resetErrora,\n             constructor: constructor,\n             submit: submitForm }\n}\n\n/**\n * Return components' props for form\n */\nform.props = makeProps({\n    constructor: { type: [Function,String], default: null },\n    initial: { type: Object, default: null },\n    commit: { type: Boolean, default: false },\n})\n\n\n/**\n * Select item\n */\nfunction singleSelect(props, emit) {\n    const selected = (0,vue__WEBPACK_IMPORTED_MODULE_1__.ref)(props.default)\n    function select(value=null) {\n        value = value === null ? props.default : value\n        if(value != selected.value) {\n            selected.value = value\n            emit('select', selected.value)\n        }\n    }\n    return { selected, select }\n}\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/composables.js?");

/***/ }),

/***/ "./assets/core/index.js":
/*!******************************!*\
  !*** ./assets/core/index.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Action\": () => (/* reexport safe */ _action__WEBPACK_IMPORTED_MODULE_1__.default),\n/* harmony export */   \"App\": () => (/* reexport safe */ _app__WEBPACK_IMPORTED_MODULE_2__.default),\n/* harmony export */   \"createApp\": () => (/* reexport safe */ _app__WEBPACK_IMPORTED_MODULE_2__.createApp),\n/* harmony export */   \"getScriptData\": () => (/* reexport safe */ _app__WEBPACK_IMPORTED_MODULE_2__.getScriptData),\n/* harmony export */   \"components\": () => (/* reexport module object */ _components__WEBPACK_IMPORTED_MODULE_3__),\n/* harmony export */   \"models\": () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_4__.default),\n/* harmony export */   \"importDatabase\": () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_4__.importDatabase),\n/* harmony export */   \"Role\": () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_4__.Role),\n/* harmony export */   \"modelsPlugin\": () => (/* reexport safe */ _plugins__WEBPACK_IMPORTED_MODULE_5__.modelsPlugin),\n/* harmony export */   \"addGlobals\": () => (/* binding */ addGlobals)\n/* harmony export */ });\n/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.scss */ \"./assets/core/styles.scss\");\n/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action */ \"./assets/core/action.js\");\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app */ \"./assets/core/app.js\");\n/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components */ \"./assets/core/components/index.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./models */ \"./assets/core/models.js\");\n/* harmony import */ var _plugins__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./plugins */ \"./assets/core/plugins.js\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n/**\n *  Add items into `window.pepr[namespace]` object.\n */\nfunction addGlobals(namespace, globals) {\n    if(!window.pepr)\n        window.pepr = {}\n    window.pepr[namespace] = { ...(window.pepr[namespace] || {}), ...globals }\n}\n\naddGlobals('core', {\n    createApp(props) {\n        return (0,_app__WEBPACK_IMPORTED_MODULE_2__.createApp)(_app__WEBPACK_IMPORTED_MODULE_2__.default, props)\n    },\n    getScriptData: _app__WEBPACK_IMPORTED_MODULE_2__.getScriptData, importDatabase: _models__WEBPACK_IMPORTED_MODULE_4__.importDatabase\n})\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/index.js?");

/***/ }),

/***/ "./assets/core/models.js":
/*!*******************************!*\
  !*** ./assets/core/models.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"submit\": () => (/* binding */ submit),\n/* harmony export */   \"importDatabase\": () => (/* binding */ importDatabase),\n/* harmony export */   \"Model\": () => (/* binding */ Model),\n/* harmony export */   \"Role\": () => (/* binding */ Role),\n/* harmony export */   \"Context\": () => (/* binding */ Context),\n/* harmony export */   \"Accessible\": () => (/* binding */ Accessible),\n/* harmony export */   \"Owned\": () => (/* binding */ Owned),\n/* harmony export */   \"Subscription\": () => (/* binding */ Subscription),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-cookie */ \"./node_modules/js-cookie/src/js.cookie.js\");\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(js_cookie__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _vuex_orm_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vuex-orm/core */ \"./node_modules/@vuex-orm/core/dist/vuex-orm.esm.js\");\n\n\n\n\n\n\n/**\n * Submit data to server.\n */\nfunction submit(url, {data={}, form=null, bodyType='json', ...config}) {\n    url = url || form && form.getAttribute('action')\n\n    if(!data)\n        data = new FormData(form)\n    else if(!(data instanceof FormData)) {\n        const formData = new FormData()\n        for(let key in data)\n            formData.append(key, data[key])\n        data = formData\n    }\n\n    config.method = config.method || form.getAttribute('method') || 'POST'\n    config.headers = {...(config.headers || {}),\n        'Content-Type': 'multipart/form-data',\n        'X-CSRFToken': js_cookie__WEBPACK_IMPORTED_MODULE_0___default().get('csrftoken'),\n    }\n\n    return fetch(url, {data, ...config }).then(\n        r => r[bodyType]().then(d => {\n            d = { status: r.status, data: d, response: r }\n            if(400 <= d.status)\n                throw(d)\n            return d\n        })\n    )\n}\n\n\n/**\n * Load models from data, as an Object of `{ entity: insertOrUpdateData }`\n */\nfunction importDatabase(store, data) {\n    let db = store.$db();\n    for(var entity in data) {\n        let model = db.model(entity)\n        model ? model.insertOrUpdate({ data: data[entity] })\n              : console.warn(`model ${entity} is not a registered model`)\n    }\n}\n\n\n/**\n * Base model class\n */\nclass Model extends _vuex_orm_core__WEBPACK_IMPORTED_MODULE_1__.Model {\n    /**\n     * Default model's api entry point\n     */\n    static get baseURL() { return '' }\n\n    static get primaryKey() { return 'pk' }\n    static get apiConfig() {\n        return {\n            headers: { 'X-CSRFToken': js_cookie__WEBPACK_IMPORTED_MODULE_0___default().get('csrftoken') },\n            delete: true,\n        }\n    }\n\n    static fields() {\n        return {\n            pk: this.string(null),\n            access: this.number(null),\n        }\n    }\n\n    /**\n     * Item's url (PUT or POST url)\n     */\n    get $url() {\n        return this.$id ? `${this.constructor.baseURL}${this.$id}/`\n                        :  this.constructor.baseURL;\n    }\n\n    /**\n     * Return other model in the same database.\n     */\n    $model(model) {\n        model = model.prototype instanceof Model ? model.entity : model\n        return this.$store().$db().model(model)\n    }\n\n    // TODO: many=True, getOrFetch\n    static fetch(id, config={}) {\n        return this.api().get(`${this.baseURL}/${id}/`, config)\n    }\n\n    /**\n     * Reload item from the server\n     */\n    fetch(config) {\n        if(!this.$id)\n            throw \"item is not on server\"\n        return this.$id && this.constructor.api().get(this.$url, config)\n            .then(r => {\n                this.constructor.insertOrUpdate({data: r.response.data})\n                return r\n            })\n    }\n\n    /**\n     * Save item to server and return promise\n     */\n    save({data=null, form=null, url=null, method=null, ...config}= {}) {\n        if(!data && !form) {\n            // FIXME: exclude relations / use data\n            data = {}\n            const fields = this.constructor.fields()\n            for(var key in fields)\n                if(this[key] !== undefined)\n                    data[key] = this[key]\n        }\n\n        if(!method)\n            method = self.$id ? 'PUT': 'POST'\n\n        url = url || this.$url\n        return submit(url, {data, method, ...config}).then(r => {\n            this.constructor.insertOrUpdate({data: r.data})\n            return r\n        })\n    }\n\n    /**\n     * Delete item from server and return promise\n     */\n    delete(config) {\n        if(this.$url)\n            return this.constructor.api().delete(this.$url, config).then(r => {\n                this.constructor.delete(this.$id)\n                return r\n            })\n        else\n            throw \"no api url for item\"\n    }\n}\n\n\nclass Role {\n    /* static fields() {\n        return {\n            context_id: this.string(null),\n            subscription_id: this.string(null),\n            identity_id: this.string(null),\n            access: this.number(null),\n            is_anonymous: this.boolean(false),\n            is_subscribed: this.boolean(false),\n            is_moderator: this.boolean(false),\n            is_admin: this.boolean(false),\n            permissions: this.attr(null)\n       }\n    } */\n\n    constructor(data=null) {\n        data && Object.assign(this, data)\n    }\n\n    /**\n     * True if all permissions are granted for this role\n     */\n    isGranted(permissions, item=null) {\n        if(!this.permissions)\n            return false\n        if(item && item instanceof Owned && this.identity == item.owner)\n            return true\n\n        for(var name of permissions)\n            if(!this.permissions[name])\n                return false\n        return true\n    }\n}\n\n\nclass Context extends Model {\n    static get entity() { return 'context' }\n    static get baseURL() { return '/pepr/core/context/' }\n\n\n    static fields() {\n        return { ...super.fields(),\n            default_access: this.number(null),\n            allow_subscription_request: this.attr(null),\n            subscription_accept_role: this.number(null),\n            subscription_default_access: this.number(null),\n            subscription_default_role: this.number(null),\n            // subsciption: this.attr(null),\n            subsciptions: this.hasMany(Subscription, 'context'),\n            n_subscriptions: this.number(0),\n            role: this.attr(null, value => new Role(value))\n        }\n    }\n\n    /**\n     * Return user's identity\n     */\n    get identity() {\n        let id = this.role && this.role.identity_id\n        return id && this.$model('context').find(id)\n    }\n\n    /**\n     * Return user's subscription\n     */\n    get subscription() {\n        let id = this.role && this.role.identity_id\n        return id && this.$model('subscription').query()\n            .where({ context_id: this.$id, owner_id: id }).first()\n    }\n}\n\n\n\nclass Accessible extends Model {\n    static get entity() { return 'accessible' }\n    static get contextModel() { return Context }\n\n    static fields() {\n        return { ...super.fields(),\n            context_id: this.attr(null),\n            // context: this.belongsTo(Context, 'context_id'),\n        }\n    }\n\n    /**\n     * Available choices for 'access' attribute.\n     */\n    static accessChoices(roles, role=null) {\n        if(!Array.isArray(roles))\n            roles = Object.values(roles)\n        return role ? roles.filter((r) => r.access <= role.access) : roles\n    }\n\n    /**\n     * Parent context object.\n     */\n    get context() {\n        return this.context_id && this.constructor.contextModel.find(this.context_id)\n    }\n\n    // FIXME: wtf\n    granted(permissions) {\n        let role_perms = this.context.role.permissions\n        if(!Array.isArray(perms))\n            return !!role_perms[permissions]\n\n        for(var permission of permissions)\n            if(!role_perms[permission])\n                return false\n        return true\n    }\n}\n\nclass Owned extends Accessible {\n    static get entity() { return 'owned' }\n\n    static fields() {\n        return { ...super.fields(),\n            owner_id: this.attr(null),\n        //    owner: this.belongsTo(Context, 'owner_id'),\n        }\n    }\n\n    /**\n     * Related owner object\n     */\n    get owner() {\n        return Context.find(this.owner_id)\n    }\n}\n\nclass Subscription extends Owned {\n    static get entity() { return 'subscription' }\n    static get baseURL() { return '/pepr/core/subscription/' }\n\n    static fields() {\n        return { ...super.fields(),\n            status: this.number(),\n            access: this.number(),\n            role: this.number(),\n        }\n    }\n\n    static accessChoices(roles, role=null) {\n        return super.accessChoices(roles, role)\n                    .filter(role => role.status != 'moderator' && role.status != 'admin')\n    }\n\n    /**\n     * Available choices for the 'role' attribute\n     */\n    static roleChoices(roles, role=null) {\n        return this.accessChoices(roles, role)\n                   .filter(role => role.status != 'anonymous' &&\n                                   role.status != 'registered')\n    }\n\n    save(config) {\n        return super.save(config).then(\n            r => {\n                this.context && this.context.fetch()\n                return r\n            }\n        )\n    }\n\n    delete(config) {\n        const context = this.context\n        return super.delete(config).then(\n            r => {\n                context && context.fetch()\n                return r\n            },\n        )\n    }\n\n    /**\n     * Subscription is an invitation\n     */\n    get isInvite() { return this.status == Subscription.INVITE }\n\n    /**\n     * Subscription is a request\n     */\n    get isRequest() { return this.status == Subscription.REQUEST }\n\n    /**\n     * Subscription is validated\n     */\n    get isSubscribed() { return this.status == Subscription.SUBSCRIBED }\n}\nSubscription.INVITE = 1\nSubscription.REQUEST = 2\nSubscription.SUBSCRIBED = 3\n\n\nconst defaults = { Context, Subscription }\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defaults);\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/models.js?");

/***/ }),

/***/ "./assets/core/plugins.js":
/*!********************************!*\
  !*** ./assets/core/plugins.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"modelsPlugin\": () => (/* binding */ modelsPlugin)\n/* harmony export */ });\n/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vuex */ \"./node_modules/vuex/dist/vuex.esm-bundler.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ \"./node_modules/axios/lib/axios.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _vuex_orm_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vuex-orm/core */ \"./node_modules/@vuex-orm/core/dist/vuex-orm.esm.js\");\n/* harmony import */ var _vuex_orm_plugin_axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vuex-orm/plugin-axios */ \"./node_modules/@vuex-orm/plugin-axios/dist/vuex-orm-axios.esm-browser.js\");\n\n\n\n\n\n\n\n/**\n * Create Vuex ORM database using provided models. Add model getters to\n * application global properties.\n */\nconst modelsPlugin = {\n    install(app, {models={}, baseURL='', storeConfig={}}={}) {\n        _vuex_orm_core__WEBPACK_IMPORTED_MODULE_0__.default.use(_vuex_orm_plugin_axios__WEBPACK_IMPORTED_MODULE_1__.default, { axios: (axios__WEBPACK_IMPORTED_MODULE_2___default()), baseURL })\n\n        // store\n        const database = new _vuex_orm_core__WEBPACK_IMPORTED_MODULE_0__.default.Database()\n        for(let model of models)\n            database.register(model)\n\n        storeConfig.plugins = [ ...(storeConfig.plugins || []), _vuex_orm_core__WEBPACK_IMPORTED_MODULE_0__.default.install(database) ]\n        app.use((0,vuex__WEBPACK_IMPORTED_MODULE_3__.createStore)(storeConfig))\n\n        // getters\n        const target = app.config.globalProperties;\n        for(let key in models) {\n            let model = models[key]\n            if(!target[model.name])\n                target[model.name] = target.$store.$db().model(model.entity)\n        }\n    }\n}\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/plugins.js?");

/***/ }),

/***/ "./assets/core/styles.scss":
/*!*********************************!*\
  !*** ./assets/core/styles.scss ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/styles.scss?");

/***/ }),

/***/ "./assets/core/components/context.vue":
/*!********************************************!*\
  !*** ./assets/core/components/context.vue ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _context_vue_vue_type_template_id_5fa901a8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./context.vue?vue&type=template&id=5fa901a8 */ \"./assets/core/components/context.vue?vue&type=template&id=5fa901a8\");\n/* harmony import */ var _context_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./context.vue?vue&type=script&lang=js */ \"./assets/core/components/context.vue?vue&type=script&lang=js\");\n\n\n\n_context_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.render = _context_vue_vue_type_template_id_5fa901a8__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_context_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.__file = \"assets/core/components/context.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_context_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/context.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/context.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/context.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models */ \"./assets/core/models.js\");\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables.js\");\n\n\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        ..._composables__WEBPACK_IMPORTED_MODULE_1__.useContextById.props,\n    },\n\n    setup(props, context) {\n        const propsRefs = (0,vue__WEBPACK_IMPORTED_MODULE_2__.toRefs)(props)\n        const contextId = (0,vue__WEBPACK_IMPORTED_MODULE_2__.ref)(propsRefs.contextId && propsRefs.contextId.value)\n        const contextComp = _composables__WEBPACK_IMPORTED_MODULE_1__.useContextById({...propsRefs, contextId, fetch: true})\n\n        ;(0,vue__WEBPACK_IMPORTED_MODULE_2__.watch)(propsRefs.contextId, (id) => { contextId.value = id })\n\n        return {...contextComp, contextId}\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/context.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/contextForm.vue":
/*!************************************************!*\
  !*** ./assets/core/components/contextForm.vue ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _contextForm_vue_vue_type_template_id_7e8d2ee8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./contextForm.vue?vue&type=template&id=7e8d2ee8 */ \"./assets/core/components/contextForm.vue?vue&type=template&id=7e8d2ee8\");\n/* harmony import */ var _contextForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contextForm.vue?vue&type=script&lang=js */ \"./assets/core/components/contextForm.vue?vue&type=script&lang=js\");\n\n\n\n_contextForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.render = _contextForm_vue_vue_type_template_id_7e8d2ee8__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_contextForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.__file = \"assets/core/components/contextForm.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_contextForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/contextForm.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/contextForm.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/contextForm.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models */ \"./assets/core/models.js\");\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables.js\");\n/* harmony import */ var _field__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./field */ \"./assets/core/components/field.vue\");\n/* harmony import */ var _fieldRow__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fieldRow */ \"./assets/core/components/fieldRow.vue\");\n/* harmony import */ var _selectRole__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./selectRole */ \"./assets/core/components/selectRole.vue\");\n\n\n\n\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        ..._composables__WEBPACK_IMPORTED_MODULE_1__.form.props({commit:true, constructor: 'context'}),\n    },\n\n    setup(props, context_) {\n        const propsRefs = (0,vue__WEBPACK_IMPORTED_MODULE_5__.toRefs)(props)\n        const formComp  = _composables__WEBPACK_IMPORTED_MODULE_1__.form(propsRef, context_)\n        const contextComp = _composables__WEBPACK_IMPORTED_MODULE_1__.useContext(form.data)\n\n        const {role, roles} = contextComp;\n        const subscriptionRoleChoices = (0,vue__WEBPACK_IMPORTED_MODULE_5__.computed)(() =>\n            role.value && _models__WEBPACK_IMPORTED_MODULE_0__.Subscription.roleChoices(Object.values(roles.value), role.value)\n        )\n        const subscriptionAccessChoices = (0,vue__WEBPACK_IMPORTED_MODULE_5__.computed)(() =>\n            role.value && _models__WEBPACK_IMPORTED_MODULE_0__.Subscription.accessChoices(Object.values(roles.value), role.value)\n        )\n\n        return {...formComp, ...contextComp, subscriptionRoleChoices, subscriptionAccessChoices }\n    },\n\n    components: { PField: _field__WEBPACK_IMPORTED_MODULE_2__.default, PFieldRow: _fieldRow__WEBPACK_IMPORTED_MODULE_3__.default, PSelectRole: _selectRole__WEBPACK_IMPORTED_MODULE_4__.default },\n});\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/contextForm.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/deck.vue":
/*!*****************************************!*\
  !*** ./assets/core/components/deck.vue ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _deck_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./deck.vue?vue&type=script&lang=js */ \"./assets/core/components/deck.vue?vue&type=script&lang=js\");\n\n\n/* hot reload */\nif (false) {}\n\n_deck_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default.__file = \"assets/core/components/deck.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_deck_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/deck.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/deck.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/deck.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables.js\");\n\n// TODO:\n// - history stack of deck\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        default: { type: String, default: 'default' },\n    },\n\n    setup(props, { emit }) {\n        return (0,_composables__WEBPACK_IMPORTED_MODULE_0__.singleSelect)(props, emit)\n    },\n\n    render() {\n        return (this.selected &&\n                this.$slots[this.selected] && this.$slots[this.selected]()) ||\n                (0,vue__WEBPACK_IMPORTED_MODULE_1__.h)('div')\n    },\n});\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/deck.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/field.vue":
/*!******************************************!*\
  !*** ./assets/core/components/field.vue ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _field_vue_vue_type_template_id_d2dad89a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./field.vue?vue&type=template&id=d2dad89a */ \"./assets/core/components/field.vue?vue&type=template&id=d2dad89a\");\n/* harmony import */ var _field_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./field.vue?vue&type=script&lang=js */ \"./assets/core/components/field.vue?vue&type=script&lang=js\");\n\n\n\n_field_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.render = _field_vue_vue_type_template_id_d2dad89a__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_field_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.__file = \"assets/core/components/field.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_field_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/field.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/field.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/field.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        label: String,\n        name: String,\n    },\n\n    setup(props) {\n        const errors = (0,vue__WEBPACK_IMPORTED_MODULE_0__.inject)('errors')\n        const error = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => errors && errors[props.name])\n        return { error, controlClass }\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/field.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/fieldRow.vue":
/*!*********************************************!*\
  !*** ./assets/core/components/fieldRow.vue ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _fieldRow_vue_vue_type_template_id_a0756752__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fieldRow.vue?vue&type=template&id=a0756752 */ \"./assets/core/components/fieldRow.vue?vue&type=template&id=a0756752\");\n/* harmony import */ var _fieldRow_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fieldRow.vue?vue&type=script&lang=js */ \"./assets/core/components/fieldRow.vue?vue&type=script&lang=js\");\n\n\n\n_fieldRow_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.render = _fieldRow_vue_vue_type_template_id_a0756752__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_fieldRow_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.__file = \"assets/core/components/fieldRow.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_fieldRow_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/fieldRow.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/fieldRow.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/fieldRow.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        label: String,\n        name: String,\n        horizontal: { type: Boolean, default: false },\n    },\n\n    setup(props) {\n        const errors = (0,vue__WEBPACK_IMPORTED_MODULE_0__.inject)('errors')\n        const error = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => errors && errors[props.name])\n        return { error, controlClass }\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/fieldRow.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/list.vue":
/*!*****************************************!*\
  !*** ./assets/core/components/list.vue ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _list_vue_vue_type_template_id_39caeef5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./list.vue?vue&type=template&id=39caeef5 */ \"./assets/core/components/list.vue?vue&type=template&id=39caeef5\");\n/* harmony import */ var _list_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./list.vue?vue&type=script&lang=js */ \"./assets/core/components/list.vue?vue&type=script&lang=js\");\n\n\n\n_list_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.render = _list_vue_vue_type_template_id_39caeef5__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_list_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.__file = \"assets/core/components/list.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_list_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/list.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/list.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/list.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        model: Function,\n        // FIXME: db query filters\n        filters: Object,\n        context: Object,\n        contextFilter: { type: String, default: 'context' },\n        orderBy: String,\n        url: String,\n    },\n\n    provide() {\n        return {\n            context: this.context\n        }\n    },\n\n    computed: {\n        itemsQuery() {\n            let query = this.model.query();\n            if(this.orderBy) {\n                let [order, dir] = this.orderBy.startsWith('-') ?\n                    [this.orderBy.slice(1), 'desc'] : [this.orderBy, 'asc'];\n                query = query.orderBy((obj) => obj[order], dir)\n            }\n            if(this.context)\n                query = query.where('context_id', this.context.pk)\n            return query\n        },\n\n        items() {\n            let items = this.itemsQuery.get()\n            return items\n        },\n    },\n\n    methods: {\n        /**\n         * Fetch item from list.\n         */\n        fetch(url, {context=null,filters=null, ...config}={}) {\n            if(context || filters) {\n                let params = new URLSearchParams(filters || {})\n                if(context && this.contextFilter)\n                    params.append(this.contextFilter, context.pk)\n                url = `${url}?${params.toString()}`\n            }\n            return this.model.api().get(url, { dataKey: 'results', ...config})\n                // FIXME: Vuex ORM API bug about using local store?\n                .then(r => this.model.insertOrUpdate({data: r.response.data.results}))\n        },\n\n        /**\n         * Load list using components properties as default fetch's\n         * config.\n         */\n        load({url=null, context=null, filters=null, ...config}) {\n            return this.fetch(url || this.url || this.model.baseURL, {\n                filters: filters || this.filters,\n                context: context || this.context,\n            })\n        }\n    },\n\n    watch: {\n        context(context, old) {\n            this.load({context})\n        },\n\n        filters(filters, old) {\n            this.load({filters})\n        },\n    },\n\n    mounted() {\n        if(this.context)\n            this.load({context: this.context})\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/list.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/modal.vue":
/*!******************************************!*\
  !*** ./assets/core/components/modal.vue ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _modal_vue_vue_type_template_id_67044834__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modal.vue?vue&type=template&id=67044834 */ \"./assets/core/components/modal.vue?vue&type=template&id=67044834\");\n/* harmony import */ var _modal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modal.vue?vue&type=script&lang=js */ \"./assets/core/components/modal.vue?vue&type=script&lang=js\");\n\n\n\n_modal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.render = _modal_vue_vue_type_template_id_67044834__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_modal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.__file = \"assets/core/components/modal.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_modal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/modal.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/modal.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/modal.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _runtimeTemplate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./runtimeTemplate */ \"./assets/core/components/runtimeTemplate.js\");\n\n/* TODO:\n    - modal-card & slots for headers & footers\n */\n\n\n// TODO: 'loading' 'error' state & related slots\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    data() {\n        return {\n            /// Fetch request controller\n            controller: null,\n            /// Html code to show\n            html: '',\n            isActive: false,\n        }\n    },\n\n    methods: {\n        hide(reset=false) {\n            if(reset) this.html = '';\n            this.isActive = false;\n            this.controller && this.controller.abort()\n            this.controller = null;\n        },\n\n        show(reset=false) {\n            if(reset) this.html = ''\n            this.isActive = true;\n\n            const modal = this.$el;\n            if(!modal)\n                return\n\n            modal.focus({ preventScroll: top });\n            modal.scrollTop = 0;\n        },\n\n        toggle(reset=false) {\n            if(this.isActive)\n                this.hide(reset)\n            else\n                this.show(reset)\n        },\n\n        /**\n         * Fetch url and load into modal\n         */\n        load(url, config={}) {\n            if(this.controller)\n                this.controller.abort();\n            this.controller = new AbortController();\n            fetch(url, config)\n                .resolve(response => response.text())\n                .then(text => {\n                    this.html = html\n                    this.controller = null\n                    !this.html && this.hide()\n                }, err => { this.controller = null })\n        },\n    },\n\n    components: { PRuntimeTemplate: _runtimeTemplate__WEBPACK_IMPORTED_MODULE_0__.default },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/modal.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/nav.vue":
/*!****************************************!*\
  !*** ./assets/core/components/nav.vue ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _nav_vue_vue_type_template_id_3d06339c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./nav.vue?vue&type=template&id=3d06339c */ \"./assets/core/components/nav.vue?vue&type=template&id=3d06339c\");\n/* harmony import */ var _nav_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nav.vue?vue&type=script&lang=js */ \"./assets/core/components/nav.vue?vue&type=script&lang=js\");\n\n\n\n_nav_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.render = _nav_vue_vue_type_template_id_3d06339c__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_nav_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.__file = \"assets/core/components/nav.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_nav_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/nav.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/nav.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/nav.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables.js\");\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        default: { type: String, default: 'default' },\n        // deck: { type: Object },\n    },\n\n    setup(props, { emit }) {\n        var select = (0,_composables__WEBPACK_IMPORTED_MODULE_0__.singleSelect)(props, emit)\n\n        function onClick(event) {\n            let el = event.target\n            if(!el.hasAttribute('target'))\n                return\n\n            event.preventDefault()\n            event.stopPropagation()\n\n            select.select(el.getAttribute('target'))\n        }\n        return { ...select, onClick }\n    },\n});\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/nav.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/navItem.vue":
/*!********************************************!*\
  !*** ./assets/core/components/navItem.vue ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _navItem_vue_vue_type_template_id_dd0fa162__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./navItem.vue?vue&type=template&id=dd0fa162 */ \"./assets/core/components/navItem.vue?vue&type=template&id=dd0fa162\");\n/* harmony import */ var _navItem_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./navItem.vue?vue&type=script&lang=js */ \"./assets/core/components/navItem.vue?vue&type=script&lang=js\");\n\n\n\n_navItem_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.render = _navItem_vue_vue_type_template_id_dd0fa162__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_navItem_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.__file = \"assets/core/components/navItem.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_navItem_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/navItem.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/navItem.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/navItem.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        icon: { type: String },\n        target: { type: String },\n        href: { type: String, default: '#' },\n    },\n\n    computed: {\n        isActive() {\n            return this.$parent.selected == this.target\n        },\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/navItem.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/selectRole.vue":
/*!***********************************************!*\
  !*** ./assets/core/components/selectRole.vue ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _selectRole_vue_vue_type_template_id_6f4ba4a9__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./selectRole.vue?vue&type=template&id=6f4ba4a9 */ \"./assets/core/components/selectRole.vue?vue&type=template&id=6f4ba4a9\");\n/* harmony import */ var _selectRole_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./selectRole.vue?vue&type=script&lang=js */ \"./assets/core/components/selectRole.vue?vue&type=script&lang=js\");\n\n\n\n_selectRole_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.render = _selectRole_vue_vue_type_template_id_6f4ba4a9__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_selectRole_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.__file = \"assets/core/components/selectRole.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_selectRole_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/selectRole.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/selectRole.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/selectRole.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    inheritAttrs: false,\n\n    setup(props, context) {\n        const value = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(props.value)\n        return { value }\n    },\n\n    props: {\n        value: [Number,String],\n        roles: { type: [Array,Object], default: [] },\n        filter: { type: Function, default: null },\n    },\n\n    computed: {\n        computedValue: {\n            get() {\n                return this.value\n            },\n            set(value) {\n                this.value = value;\n                this.$emit('update:value', value)\n            }\n        },\n    },\n});\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/selectRole.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/subscription.vue":
/*!*************************************************!*\
  !*** ./assets/core/components/subscription.vue ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _subscription_vue_vue_type_template_id_7f3d10f4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./subscription.vue?vue&type=template&id=7f3d10f4 */ \"./assets/core/components/subscription.vue?vue&type=template&id=7f3d10f4\");\n/* harmony import */ var _subscription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./subscription.vue?vue&type=script&lang=js */ \"./assets/core/components/subscription.vue?vue&type=script&lang=js\");\n\n\n\n_subscription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.render = _subscription_vue_vue_type_template_id_7f3d10f4__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_subscription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.__file = \"assets/core/components/subscription.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_subscription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscription.vue?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _subscriptionButton_vue_vue_type_template_id_2344f646__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./subscriptionButton.vue?vue&type=template&id=2344f646 */ \"./assets/core/components/subscriptionButton.vue?vue&type=template&id=2344f646\");\n/* harmony import */ var _subscriptionButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./subscriptionButton.vue?vue&type=script&lang=js */ \"./assets/core/components/subscriptionButton.vue?vue&type=script&lang=js\");\n\n\n\n_subscriptionButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.render = _subscriptionButton_vue_vue_type_template_id_2344f646__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_subscriptionButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.__file = \"assets/core/components/subscriptionButton.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_subscriptionButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionButton.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionButton.vue?vue&type=script&lang=js":
/*!***************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionButton.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _subscriptionForm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./subscriptionForm */ \"./assets/core/components/subscriptionForm.vue\");\n/* harmony import */ var _subscriptionList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./subscriptionList */ \"./assets/core/components/subscriptionList.vue\");\n/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modal */ \"./assets/core/components/modal.vue\");\n\n\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    inject: ['roles'],\n    props: {\n        context: Object,\n    },\n\n    computed: {\n        role() {\n            return this.context && this.context.role\n        },\n\n        subscription() {\n            return this.context && this.context.subscription\n        },\n    },\n    methods: {\n        edit() {\n            this.$refs.modal.show()\n        },\n\n        subscribe() {\n            return new this.$root.Subscription({\n                context_id: this.context.$id,\n                access: this.context.subscription_default_access,\n                role: this.context.subscription_default_role,\n            }).save()\n        },\n\n        unsubscribe() {\n            confirm(`Unsubscribe from ${this.context.title}?`) &&\n                this.subscription.delete()\n        },\n    },\n\n    components: { PSubscriptionForm: _subscriptionForm__WEBPACK_IMPORTED_MODULE_0__.default, PSubscriptionList: _subscriptionList__WEBPACK_IMPORTED_MODULE_1__.default, PModal: _modal__WEBPACK_IMPORTED_MODULE_2__.default },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionButton.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/subscriptionForm.vue":
/*!*****************************************************!*\
  !*** ./assets/core/components/subscriptionForm.vue ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _subscriptionForm_vue_vue_type_template_id_64461c50__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./subscriptionForm.vue?vue&type=template&id=64461c50 */ \"./assets/core/components/subscriptionForm.vue?vue&type=template&id=64461c50\");\n/* harmony import */ var _subscriptionForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./subscriptionForm.vue?vue&type=script&lang=js */ \"./assets/core/components/subscriptionForm.vue?vue&type=script&lang=js\");\n\n\n\n_subscriptionForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.render = _subscriptionForm_vue_vue_type_template_id_64461c50__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_subscriptionForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.__file = \"assets/core/components/subscriptionForm.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_subscriptionForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionForm.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionForm.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionForm.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var pepr_core_composables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pepr/core/composables */ \"./assets/core/composables.js\");\n/* harmony import */ var _field__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./field */ \"./assets/core/components/field.vue\");\n/* harmony import */ var _fieldRow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fieldRow */ \"./assets/core/components/fieldRow.vue\");\n/* harmony import */ var _selectRole__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./selectRole */ \"./assets/core/components/selectRole.vue\");\n\n\n\n\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        ...pepr_core_composables__WEBPACK_IMPORTED_MODULE_0__.form.props({commit:true, constructor:'subscription'}),\n    },\n\n    setup(props, context) {\n        const propsRefs = (0,vue__WEBPACK_IMPORTED_MODULE_4__.toRefs)(props)\n        const formComp = pepr_core_composables__WEBPACK_IMPORTED_MODULE_0__.form(propsRef, context_)\n        const contextComp = pepr_core_composables__WEBPACK_IMPORTED_MODULE_0__.useParentContext(form.data)\n\n        const model = formComp.constructor\n        const {role, roles} = contextComp;\n        const accessChoices = (0,vue__WEBPACK_IMPORTED_MODULE_4__.computed)(\n            () => role.value && model.value.accessChoices(role.value, roles.value)\n        )\n        const roleChoices = (0,vue__WEBPACK_IMPORTED_MODULE_4__.computed)(\n            () => role.value && model.value.roleChoices(role.value, roles.value)\n        )\n\n        return {...formComp, ...contextComp, accessChoices, roleChoices }\n    },\n\n    components: { PField: _field__WEBPACK_IMPORTED_MODULE_1__.default, PFieldRow: _fieldRow__WEBPACK_IMPORTED_MODULE_2__.default, PSelectRole: _selectRole__WEBPACK_IMPORTED_MODULE_3__.default },\n});\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionForm.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/subscriptionList.vue":
/*!*****************************************************!*\
  !*** ./assets/core/components/subscriptionList.vue ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _subscriptionList_vue_vue_type_template_id_01d618b2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./subscriptionList.vue?vue&type=template&id=01d618b2 */ \"./assets/core/components/subscriptionList.vue?vue&type=template&id=01d618b2\");\n/* harmony import */ var _subscriptionList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./subscriptionList.vue?vue&type=script&lang=js */ \"./assets/core/components/subscriptionList.vue?vue&type=script&lang=js\");\n\n\n\n_subscriptionList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.render = _subscriptionList_vue_vue_type_template_id_01d618b2__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_subscriptionList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.__file = \"assets/core/components/subscriptionList.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_subscriptionList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionList.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionList.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionList.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vuex */ \"./node_modules/vuex/dist/vuex.esm-bundler.js\");\n/* harmony import */ var _list__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./list */ \"./assets/core/components/list.vue\");\n/* harmony import */ var _subscription__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./subscription */ \"./assets/core/components/subscription.vue\");\n\n\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    extends: _list__WEBPACK_IMPORTED_MODULE_0__.default,\n    setup(props) {\n        let model = props.models || (0,vuex__WEBPACK_IMPORTED_MODULE_2__.useStore)().$db().model('subscription')\n        return { model }\n    },\n\n    components: { PSubscription: _subscription__WEBPACK_IMPORTED_MODULE_1__.default },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionList.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/context.vue?vue&type=script&lang=js":
/*!********************************************************************!*\
  !*** ./assets/core/components/context.vue?vue&type=script&lang=js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_context_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_context_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./context.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/context.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/context.vue?");

/***/ }),

/***/ "./assets/core/components/contextForm.vue?vue&type=script&lang=js":
/*!************************************************************************!*\
  !*** ./assets/core/components/contextForm.vue?vue&type=script&lang=js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_contextForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_contextForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./contextForm.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/contextForm.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/contextForm.vue?");

/***/ }),

/***/ "./assets/core/components/deck.vue?vue&type=script&lang=js":
/*!*****************************************************************!*\
  !*** ./assets/core/components/deck.vue?vue&type=script&lang=js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_deck_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_deck_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./deck.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/deck.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/deck.vue?");

/***/ }),

/***/ "./assets/core/components/field.vue?vue&type=script&lang=js":
/*!******************************************************************!*\
  !*** ./assets/core/components/field.vue?vue&type=script&lang=js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_field_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_field_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./field.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/field.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/field.vue?");

/***/ }),

/***/ "./assets/core/components/fieldRow.vue?vue&type=script&lang=js":
/*!*********************************************************************!*\
  !*** ./assets/core/components/fieldRow.vue?vue&type=script&lang=js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_fieldRow_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_fieldRow_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./fieldRow.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/fieldRow.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/fieldRow.vue?");

/***/ }),

/***/ "./assets/core/components/list.vue?vue&type=script&lang=js":
/*!*****************************************************************!*\
  !*** ./assets/core/components/list.vue?vue&type=script&lang=js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_list_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_list_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./list.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/list.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/list.vue?");

/***/ }),

/***/ "./assets/core/components/modal.vue?vue&type=script&lang=js":
/*!******************************************************************!*\
  !*** ./assets/core/components/modal.vue?vue&type=script&lang=js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_modal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_modal_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./modal.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/modal.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/modal.vue?");

/***/ }),

/***/ "./assets/core/components/nav.vue?vue&type=script&lang=js":
/*!****************************************************************!*\
  !*** ./assets/core/components/nav.vue?vue&type=script&lang=js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_nav_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_nav_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./nav.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/nav.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/nav.vue?");

/***/ }),

/***/ "./assets/core/components/navItem.vue?vue&type=script&lang=js":
/*!********************************************************************!*\
  !*** ./assets/core/components/navItem.vue?vue&type=script&lang=js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_navItem_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_navItem_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./navItem.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/navItem.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/navItem.vue?");

/***/ }),

/***/ "./assets/core/components/selectRole.vue?vue&type=script&lang=js":
/*!***********************************************************************!*\
  !*** ./assets/core/components/selectRole.vue?vue&type=script&lang=js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_selectRole_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_selectRole_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./selectRole.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/selectRole.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/selectRole.vue?");

/***/ }),

/***/ "./assets/core/components/subscription.vue?vue&type=script&lang=js":
/*!*************************************************************************!*\
  !*** ./assets/core/components/subscription.vue?vue&type=script&lang=js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_subscription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_subscription_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./subscription.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscription.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscription.vue?");

/***/ }),

/***/ "./assets/core/components/subscriptionButton.vue?vue&type=script&lang=js":
/*!*******************************************************************************!*\
  !*** ./assets/core/components/subscriptionButton.vue?vue&type=script&lang=js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_subscriptionButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_subscriptionButton_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./subscriptionButton.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionButton.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionButton.vue?");

/***/ }),

/***/ "./assets/core/components/subscriptionForm.vue?vue&type=script&lang=js":
/*!*****************************************************************************!*\
  !*** ./assets/core/components/subscriptionForm.vue?vue&type=script&lang=js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_subscriptionForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_subscriptionForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./subscriptionForm.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionForm.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionForm.vue?");

/***/ }),

/***/ "./assets/core/components/subscriptionList.vue?vue&type=script&lang=js":
/*!*****************************************************************************!*\
  !*** ./assets/core/components/subscriptionList.vue?vue&type=script&lang=js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_subscriptionList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_subscriptionList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./subscriptionList.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionList.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionList.vue?");

/***/ }),

/***/ "./assets/core/components/context.vue?vue&type=template&id=5fa901a8":
/*!**************************************************************************!*\
  !*** ./assets/core/components/context.vue?vue&type=template&id=5fa901a8 ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_context_vue_vue_type_template_id_5fa901a8__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_context_vue_vue_type_template_id_5fa901a8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./context.vue?vue&type=template&id=5fa901a8 */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/context.vue?vue&type=template&id=5fa901a8\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/context.vue?");

/***/ }),

/***/ "./assets/core/components/contextForm.vue?vue&type=template&id=7e8d2ee8":
/*!******************************************************************************!*\
  !*** ./assets/core/components/contextForm.vue?vue&type=template&id=7e8d2ee8 ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_contextForm_vue_vue_type_template_id_7e8d2ee8__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_contextForm_vue_vue_type_template_id_7e8d2ee8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./contextForm.vue?vue&type=template&id=7e8d2ee8 */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/contextForm.vue?vue&type=template&id=7e8d2ee8\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/contextForm.vue?");

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

/***/ "./assets/core/components/subscriptionForm.vue?vue&type=template&id=64461c50":
/*!***********************************************************************************!*\
  !*** ./assets/core/components/subscriptionForm.vue?vue&type=template&id=64461c50 ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_subscriptionForm_vue_vue_type_template_id_64461c50__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_subscriptionForm_vue_vue_type_template_id_64461c50__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./subscriptionForm.vue?vue&type=template&id=64461c50 */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionForm.vue?vue&type=template&id=64461c50\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionForm.vue?");

/***/ }),

/***/ "./assets/core/components/subscriptionList.vue?vue&type=template&id=01d618b2":
/*!***********************************************************************************!*\
  !*** ./assets/core/components/subscriptionList.vue?vue&type=template&id=01d618b2 ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_subscriptionList_vue_vue_type_template_id_01d618b2__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_subscriptionList_vue_vue_type_template_id_01d618b2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./subscriptionList.vue?vue&type=template&id=01d618b2 */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionList.vue?vue&type=template&id=01d618b2\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionList.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/context.vue?vue&type=template&id=5fa901a8":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/context.vue?vue&type=template&id=5fa901a8 ***!
  \********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return (_ctx.context)\n    ? (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", { key: 0 })\n    : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/context.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/contextForm.vue?vue&type=template&id=7e8d2ee8":
/*!************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/contextForm.vue?vue&type=template&id=7e8d2ee8 ***!
  \************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"h4\", { class: \"subtitle is-4\" }, \"Main settings\", -1 /* HOISTED */)\nconst _hoisted_2 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"h4\", { class: \"subtitle is-4\" }, \"Subscriptions\", -1 /* HOISTED */)\nconst _hoisted_3 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(\" Subscription requests will not need moderator approval for \")\nconst _hoisted_4 = { class: \"field is-grouped is-grouped-right\" }\nconst _hoisted_5 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"p\", { class: \"control\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"button\", { class: \"button is-link\" }, \"Save\")\n], -1 /* HOISTED */)\nconst _hoisted_6 = { class: \"control\" }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_p_field = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-field\")\n  const _component_p_field_row = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-field-row\")\n  const _component_p_select_role = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-select-role\")\n\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"form\", {\n    ref: \"form\",\n    onSubmit: _cache[8] || (_cache[8] = (...args) => (_ctx.submit && _ctx.submit(...args))),\n    onReset: _cache[9] || (_cache[9] = (...args) => (_ctx.reset && _ctx.reset(...args)))\n  }, [\n    _hoisted_1,\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_field_row, { label: \"Title\" }, {\n      default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_field, { name: \"title\" }, {\n          default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n            ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)((0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDynamicComponent)(\"input\"), {\n              name: \"title\",\n              type: \"text\",\n              value: _ctx.data.title,\n              \"onUpdate:value\": _cache[1] || (_cache[1] = $event => (_ctx.data.title = $event)),\n              placeholder: \"Title\"\n            }, null, 8 /* PROPS */, [\"value\"]))\n          ]),\n          _: 1 /* STABLE */\n        })\n      ]),\n      _: 1 /* STABLE */\n    }),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"main\"),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_field_row, { label: \"Publications' default visibility\" }, {\n      default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_field, { name: \"default_access\" }, {\n          default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_select_role, {\n              roles: _ctx.roles,\n              value: _ctx.data.default_access,\n              \"onUpdate:value\": _cache[2] || (_cache[2] = $event => (_ctx.data.default_access = $event))\n            }, null, 8 /* PROPS */, [\"roles\", \"value\"])\n          ]),\n          _: 1 /* STABLE */\n        })\n      ]),\n      _: 1 /* STABLE */\n    }),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"main\", { data: _ctx.data }),\n    _hoisted_2,\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_field_row, { label: \"Allow subscription request\" }, {\n      default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_field, { name: \"allow_subscription_request\" }, {\n          default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n            ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)((0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveDynamicComponent)(\"input\"), {\n              type: \"checkbox\",\n              name: \"allow_subscription_request\",\n              value: _ctx.data.allow_subscription_request,\n              \"onUpdate:value\": _cache[3] || (_cache[3] = $event => (_ctx.data.allow_subscription_request = $event))\n            }, null, 8 /* PROPS */, [\"value\"]))\n          ]),\n          _: 1 /* STABLE */\n        })\n      ]),\n      _: 1 /* STABLE */\n    }),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\" subscription_accept_role \"),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_field_row, { label: \"Accept subscriptions\" }, {\n      default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_field, { name: \"subscription_accept_role\" }, {\n          help: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n            _hoisted_3,\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", null, [\n              ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($setup.subscriptionRoleChoices, (role) => {\n                return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [\n                  (role.access <= _ctx.data.subscription_accept_role)\n                    ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, { key: 0 }, [\n                        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)((0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(role.name), 1 /* TEXT */)\n                      ], 64 /* STABLE_FRAGMENT */))\n                    : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n                ], 64 /* STABLE_FRAGMENT */))\n              }), 256 /* UNKEYED_FRAGMENT */))\n            ])\n          ]),\n          default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_select_role, {\n              roles: $setup.subscriptionRoleChoices,\n              value: _ctx.data.subscription_accept_role,\n              \"onUpdate:value\": _cache[4] || (_cache[4] = $event => (_ctx.data.subscription_accept_role = $event))\n            }, null, 8 /* PROPS */, [\"roles\", \"value\"])\n          ]),\n          _: 1 /* STABLE */\n        })\n      ]),\n      _: 1 /* STABLE */\n    }),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\" subscription_default_role \"),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_field_row, { label: \"Default role\" }, {\n      default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_field, { name: \"subscription_default_role\" }, {\n          default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_select_role, {\n              roles: $setup.subscriptionRoleChoices,\n              value: _ctx.data.subscription_default_role,\n              \"onUpdate:value\": _cache[5] || (_cache[5] = $event => (_ctx.data.subscription_default_role = $event))\n            }, null, 8 /* PROPS */, [\"roles\", \"value\"])\n          ]),\n          _: 1 /* STABLE */\n        })\n      ]),\n      _: 1 /* STABLE */\n    }),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\" subscription_default_role \"),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_field_row, { label: \"Default visibility\" }, {\n      default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_field, { name: \"subscription_default_access\" }, {\n          default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_select_role, {\n              roles: $setup.subscriptionAccessChoices,\n              value: _ctx.data.subscription_default_access,\n              \"onUpdate:value\": _cache[6] || (_cache[6] = $event => (_ctx.data.subscription_default_access = $event))\n            }, null, 8 /* PROPS */, [\"roles\", \"value\"])\n          ]),\n          _: 1 /* STABLE */\n        })\n      ]),\n      _: 1 /* STABLE */\n    }),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", { data: _ctx.data }),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_4, [\n      _hoisted_5,\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"p\", _hoisted_6, [\n        (_ctx.data)\n          ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"button\", {\n              key: 0,\n              type: \"button\",\n              onClick: _cache[7] || (_cache[7] = $event => (_ctx.reset() || _ctx.$emit('done'))),\n              class: \"button is-link is-light\"\n            }, \" Cancel\"))\n          : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n      ])\n    ])\n  ], 544 /* HYDRATE_EVENTS, NEED_PATCH */))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/contextForm.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/field.vue?vue&type=template&id=d2dad89a":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/field.vue?vue&type=template&id=d2dad89a ***!
  \******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = {\n  key: 0,\n  class: \"label\"\n}\nconst _hoisted_2 = { class: \"{control: true, hasIconsLeft: leftIcons, hasIconsRight: rightIcons\" }\nconst _hoisted_3 = { class: \"icon is-small is-left\" }\nconst _hoisted_4 = { class: \"icon is-small is-right\" }\nconst _hoisted_5 = {\n  key: 1,\n  class: \"help is-danger\"\n}\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", {\n    class: {field: true, 'has-ico': _ctx.horizontal}\n  }, [\n    ($props.label)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"label\", _hoisted_1, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.label), 1 /* TEXT */))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_2, [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", {\n        field: $props.name,\n        error: $setup.error\n      }),\n      (_ctx.leftIcons)\n        ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, { key: 0 }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)(_ctx.leftIcons, (icon) => {\n            return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_3, [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: icon }, null, 2 /* CLASS */)\n            ]))\n          }), 256 /* UNKEYED_FRAGMENT */))\n        : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n      (_ctx.rightIcons)\n        ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, { key: 1 }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)(_ctx.rightIcons, (icon) => {\n            return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_4, [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: icon }, null, 2 /* CLASS */)\n            ]))\n          }), 256 /* UNKEYED_FRAGMENT */))\n        : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n    ]),\n    ($setup.error)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_5, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($setup.error), 1 /* TEXT */))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"help\")\n  ], 2 /* CLASS */))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/field.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/fieldRow.vue?vue&type=template&id=a0756752":
/*!*********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/fieldRow.vue?vue&type=template&id=a0756752 ***!
  \*********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { class: \"field is-horizontal\" }\nconst _hoisted_2 = {\n  key: 0,\n  class: \"field-label\"\n}\nconst _hoisted_3 = { class: \"label\" }\nconst _hoisted_4 = {\n  key: 1,\n  class: \"field-label\"\n}\nconst _hoisted_5 = { class: \"field-body\" }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_1, [\n    ($props.label)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_2, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"label\", _hoisted_3, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.label), 1 /* TEXT */)\n        ]))\n      : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_4)),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_5, [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\")\n    ])\n  ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/fieldRow.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/list.vue?vue&type=template&id=39caeef5":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/list.vue?vue&type=template&id=39caeef5 ***!
  \*****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($options.items, (item, index) => {\n    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"item\", {\n      index: index,\n      item: item,\n      items: $options.items\n    })\n  }), 256 /* UNKEYED_FRAGMENT */))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/list.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/modal.vue?vue&type=template&id=67044834":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/modal.vue?vue&type=template&id=67044834 ***!
  \******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = {\n  class: \"modal-content\",\n  role: \"document\"\n}\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_p_runtime_template = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-runtime-template\")\n\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", {\n    role: \"dialog\",\n    tabindex: -1,\n    \"aria-modal\": \"true\",\n    \"aria-hidden\": !$data.isActive,\n    class: {modal: true, 'is-active': $data.isActive},\n    onKeydown: _cache[3] || (_cache[3] = (0,vue__WEBPACK_IMPORTED_MODULE_0__.withKeys)($event => ($options.hide()), [\"esc\"]))\n  }, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", {\n      class: \"modal-background\",\n      onClick: _cache[1] || (_cache[1] = (0,vue__WEBPACK_IMPORTED_MODULE_0__.withModifiers)($event => ($options.hide()), [\"self\"]))\n    }),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_1, [\n      ($data.html)\n        ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_p_runtime_template, {\n            key: 0,\n            template: $data.html\n          }, null, 8 /* PROPS */, [\"template\"]))\n        : (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", { key: 1 })\n    ]),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"button\", {\n      class: \"modal-close is-large\",\n      \"aria-label\": \"close\",\n      onClick: _cache[2] || (_cache[2] = $event => ($options.hide()))\n    })\n  ], 42 /* CLASS, PROPS, HYDRATE_EVENTS */, [\"aria-hidden\"]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/modal.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/nav.vue?vue&type=template&id=3d06339c":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/nav.vue?vue&type=template&id=3d06339c ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"nav\", {\n    onClick: _cache[1] || (_cache[1] = (...args) => ($setup.onClick && $setup.onClick(...args)))\n  }, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\")\n  ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/nav.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/navItem.vue?vue&type=template&id=dd0fa162":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/navItem.vue?vue&type=template&id=dd0fa162 ***!
  \********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = {\n  key: 0,\n  class: \"icon is-small\"\n}\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"a\", {\n    class: { 'is-active': $options.isActive },\n    href: $props.href,\n    target: $props.target\n  }, [\n    ($props.icon)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_1, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: $props.icon }, null, 2 /* CLASS */)\n        ]))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\")\n  ], 10 /* CLASS, PROPS */, [\"href\", \"target\"]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/navItem.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/selectRole.vue?vue&type=template&id=6f4ba4a9":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/selectRole.vue?vue&type=template&id=6f4ba4a9 ***!
  \***********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { class: \"control has-icons-left\" }\nconst _hoisted_2 = { class: \"select\" }\nconst _hoisted_3 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", { class: \"icon is-left\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: \"mdi mdi-eye\" })\n], -1 /* HOISTED */)\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_1, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_2, [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"select\", (0,vue__WEBPACK_IMPORTED_MODULE_0__.mergeProps)(_ctx.$attrs, {\n        onChange: _cache[1] || (_cache[1] = $event => ($options.computedValue=$event.target.value)),\n        value: $options.computedValue\n      }), [\n        ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($props.roles, (role) => {\n          return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"option\", {\n            value: role.access\n          }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(role.name), 9 /* TEXT, PROPS */, [\"value\"]))\n        }), 256 /* UNKEYED_FRAGMENT */))\n      ], 16 /* FULL_PROPS */, [\"value\"])\n    ]),\n    _hoisted_3\n  ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/selectRole.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscription.vue?vue&type=template&id=7f3d10f4":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscription.vue?vue&type=template&id=7f3d10f4 ***!
  \*************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { key: 0 }\nconst _hoisted_2 = { key: 1 }\nconst _hoisted_3 = { class: \"icon is-large has-text-info\" }\nconst _hoisted_4 = {\n  key: 0,\n  class: \"mdi mdi-account\"\n}\nconst _hoisted_5 = {\n  key: 1,\n  class: \"mdi mdi-account-question\",\n  title: \"Awaiting for approval\"\n}\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", null, [\n    ($props.item.owner && $props.item.owner.title)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_1, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.item.owner.title), 1 /* TEXT */))\n      : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.item.owner_id) + \" (not visible)\", 1 /* TEXT */)),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_3, [\n      ($props.item.isSubscribed)\n        ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_4))\n        : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_5))\n    ])\n  ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscription.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionButton.vue?vue&type=template&id=2344f646":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionButton.vue?vue&type=template&id=2344f646 ***!
  \*******************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { class: \"box\" }\nconst _hoisted_2 = { class: \"title is-2\" }\nconst _hoisted_3 = { key: 0 }\nconst _hoisted_4 = { key: 1 }\nconst _hoisted_5 = { class: \"dropdown is-hoverable is-right\" }\nconst _hoisted_6 = { class: \"dropdown-trigger\" }\nconst _hoisted_7 = { class: \"field has-addons\" }\nconst _hoisted_8 = { class: \"control\" }\nconst _hoisted_9 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", { class: \"icon\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: \"mdi mdi-account-multiple\" })\n], -1 /* HOISTED */)\nconst _hoisted_10 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", null, \"Subscribe\", -1 /* HOISTED */)\nconst _hoisted_11 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", { class: \"icon\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: \"mdi mdi-account-multiple\" })\n], -1 /* HOISTED */)\nconst _hoisted_12 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", { class: \"icon\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: \"mdi mdi-account-question\" })\n], -1 /* HOISTED */)\nconst _hoisted_13 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", null, \"Request sent\", -1 /* HOISTED */)\nconst _hoisted_14 = { class: \"control\" }\nconst _hoisted_15 = { class: \"button is-white\" }\nconst _hoisted_16 = {\n  class: \"dropdown-menu\",\n  role: \"menu\"\n}\nconst _hoisted_17 = {\n  key: 0,\n  class: \"dropdown-content\"\n}\nconst _hoisted_18 = {\n  key: 1,\n  class: \"dropdown-content\"\n}\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_p_subscription_form = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-subscription-form\")\n  const _component_p_modal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-modal\")\n\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_modal, { ref: \"modal\" }, {\n      default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_1, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"h2\", _hoisted_2, [\n            ($options.subscription)\n              ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_3, \"Edit subscription\"))\n              : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_4, \"Subscribe to \" + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.context && $props.context.title), 1 /* TEXT */))\n          ]),\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_subscription_form, {\n            onDone: _cache[1] || (_cache[1] = $event => (_ctx.$refs.modal.hide())),\n            context: $props.context,\n            initial: $options.subscription\n          }, null, 8 /* PROPS */, [\"context\", \"initial\"])\n        ])\n      ]),\n      _: 1 /* STABLE */\n    }, 512 /* NEED_PATCH */),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_5, [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_6, [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_7, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_8, [\n            (!$options.subscription)\n              ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"button\", {\n                  key: 0,\n                  class: \"button is-link\",\n                  onClick: _cache[2] || (_cache[2] = (...args) => ($options.subscribe && $options.subscribe(...args))),\n                  title: `Subscribe as ${$options.roles[$props.context.subscription_default_role]}`\n                }, [\n                  _hoisted_9,\n                  _hoisted_10\n                ], 8 /* PROPS */, [\"title\"]))\n              : ($options.subscription.isSubscribed)\n                ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"button\", {\n                    key: 1,\n                    class: \"button is-info\",\n                    onClick: _cache[3] || (_cache[3] = (...args) => ($options.edit && $options.edit(...args)))\n                  }, [\n                    _hoisted_11,\n                    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($options.roles[$props.context.role.access].name), 1 /* TEXT */)\n                  ]))\n                : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"button\", {\n                    key: 2,\n                    class: \"button is-info\",\n                    onClick: _cache[4] || (_cache[4] = (...args) => ($options.edit && $options.edit(...args)))\n                  }, [\n                    _hoisted_12,\n                    _hoisted_13\n                  ]))\n          ]),\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_14, [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"button\", _hoisted_15, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.context.n_subscriptions), 1 /* TEXT */)\n          ])\n        ])\n      ]),\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_16, [\n        (!$options.subscription)\n          ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_17, [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"a\", {\n                class: \"dropdown-item\",\n                onClick: _cache[5] || (_cache[5] = (...args) => ($options.edit && $options.edit(...args)))\n              }, \"Subscribe...\")\n            ]))\n          : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_18, [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"a\", {\n                class: \"dropdown-item\",\n                onClick: _cache[6] || (_cache[6] = (...args) => ($options.unsubscribe && $options.unsubscribe(...args)))\n              }, \"Unsubscribe\")\n            ]))\n      ])\n    ])\n  ], 64 /* STABLE_FRAGMENT */))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionButton.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionForm.vue?vue&type=template&id=64461c50":
/*!*****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionForm.vue?vue&type=template&id=64461c50 ***!
  \*****************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = {\n  key: 1,\n  class: \"notification is-info\"\n}\nconst _hoisted_2 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", null, \" Your subscription request is awaiting for approval (you still can update it). \", -1 /* HOISTED */)\nconst _hoisted_3 = {\n  key: 0,\n  class: \"help is-info\"\n}\nconst _hoisted_4 = { class: \"field is-grouped is-grouped-right\" }\nconst _hoisted_5 = { class: \"control\" }\nconst _hoisted_6 = { class: \"button is-link\" }\nconst _hoisted_7 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(\"Save\")\nconst _hoisted_8 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(\"Subscribe\")\nconst _hoisted_9 = { class: \"control\" }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_p_select_role = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-select-role\")\n  const _component_p_field = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-field\")\n  const _component_p_field_row = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-field-row\")\n\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"form\", {\n    ref: \"form\",\n    onSubmit: _cache[4] || (_cache[4] = (...args) => (_ctx.submit && _ctx.submit(...args))),\n    onReset: _cache[5] || (_cache[5] = (...args) => (_ctx.reset && _ctx.reset(...args)))\n  }, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"input\", {\n      type: \"hidden\",\n      name: \"context_id\",\n      value: _ctx.context && _ctx.context.pk\n    }, null, 8 /* PROPS */, [\"value\"]),\n    (_ctx.data.owner_id)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"input\", {\n          key: 0,\n          type: \"hidden\",\n          name: \"owner_id\",\n          value: _ctx.data.owner_id\n        }, null, 8 /* PROPS */, [\"value\"]))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n    (_ctx.data.isRequest)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_1, [\n          _hoisted_2\n        ]))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_field_row, { label: \"Role\" }, {\n      default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_field, { name: \"role\" }, {\n          help: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n            (_ctx.data.role > _ctx.context.subscription_accept_role)\n              ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_3, \" This role requires approval from moderation \"))\n              : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n          ]),\n          default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_select_role, {\n              name: \"role\",\n              value: _ctx.data.role,\n              \"onUpdate:value\": _cache[1] || (_cache[1] = $event => (_ctx.data.role = $event)),\n              roles: $setup.roleChoices,\n              title: \"Role\"\n            }, null, 8 /* PROPS */, [\"value\", \"roles\"])\n          ]),\n          _: 1 /* STABLE */\n        })\n      ]),\n      _: 1 /* STABLE */\n    }),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_field_row, { label: \"Visibility\" }, {\n      default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_field, { name: \"access\" }, {\n          default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_select_role, {\n              name: \"access\",\n              value: _ctx.data.access,\n              \"onUpdate:value\": _cache[2] || (_cache[2] = $event => (_ctx.data.access = $event)),\n              roles: $setup.accessChoices,\n              title: \"People being able to see you are subscribed.\"\n            }, null, 8 /* PROPS */, [\"value\", \"roles\"])\n          ]),\n          _: 1 /* STABLE */\n        })\n      ]),\n      _: 1 /* STABLE */\n    }),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_4, [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"p\", _hoisted_5, [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"button\", _hoisted_6, [\n          (_ctx.data)\n            ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, { key: 0 }, [\n                _hoisted_7\n              ], 64 /* STABLE_FRAGMENT */))\n            : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, { key: 1 }, [\n                _hoisted_8\n              ], 64 /* STABLE_FRAGMENT */))\n        ])\n      ]),\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"p\", _hoisted_9, [\n        (_ctx.data)\n          ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"button\", {\n              key: 0,\n              type: \"button\",\n              onClick: _cache[3] || (_cache[3] = $event => (_ctx.reset() || _ctx.$emit('done'))),\n              class: \"button is-link is-light\"\n            }, \" Cancel\"))\n          : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n      ])\n    ])\n  ], 544 /* HYDRATE_EVENTS, NEED_PATCH */))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionForm.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionList.vue?vue&type=template&id=01d618b2":
/*!*****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionList.vue?vue&type=template&id=01d618b2 ***!
  \*****************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_p_subscription = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-subscription\")\n\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)(_ctx.items, (item, index) => {\n    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"item\", {\n      index: index,\n      item: item,\n      items: _ctx.items\n    }, () => [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_subscription, {\n        id: item.pk,\n        item: item\n      }, null, 8 /* PROPS */, [\"id\", \"item\"])\n    ])\n  }), 256 /* UNKEYED_FRAGMENT */))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionList.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
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
/******/ 	// the startup function
/******/ 	// It's empty as some runtime module handles the default behavior
/******/ 	__webpack_require__.x = x => {};
/************************************************************************/
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
/******/ 		// Promise = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"core": 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			["./assets/core/index.js","vendor"]
/******/ 		];
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
/******/ 		var checkDeferredModules = x => {};
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime, executeModules] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0, resolves = [];
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					resolves.push(installedChunks[chunkId][0]);
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			while(resolves.length) {
/******/ 				resolves.shift()();
/******/ 			}
/******/ 		
/******/ 			// add entry modules from loaded chunk to deferred list
/******/ 			if(executeModules) deferredModules.push.apply(deferredModules, executeModules);
/******/ 		
/******/ 			// run deferred modules when all chunks ready
/******/ 			return checkDeferredModules();
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkpepr_assets"] = self["webpackChunkpepr_assets"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 		
/******/ 		function checkDeferredModulesImpl() {
/******/ 			var result;
/******/ 			for(var i = 0; i < deferredModules.length; i++) {
/******/ 				var deferredModule = deferredModules[i];
/******/ 				var fulfilled = true;
/******/ 				for(var j = 1; j < deferredModule.length; j++) {
/******/ 					var depId = deferredModule[j];
/******/ 					if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferredModules.splice(i--, 1);
/******/ 					result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 				}
/******/ 			}
/******/ 			if(deferredModules.length === 0) {
/******/ 				__webpack_require__.x();
/******/ 				__webpack_require__.x = x => {};
/******/ 			}
/******/ 			return result;
/******/ 		}
/******/ 		var startup = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			// reset startup function so it can be called again when more startup code is added
/******/ 			__webpack_require__.x = startup || (x => {});
/******/ 			return (checkDeferredModules = checkDeferredModulesImpl)();
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ })()
;