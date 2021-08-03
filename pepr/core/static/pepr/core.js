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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Action)\n/* harmony export */ });\n\nclass Action {\n    constructor(name, permissions, exec=null) {\n        this.name = name\n        this.permissions = Array.isArray(permissions) ? permissions : [permissions]\n        if(exec)\n            this.exec = exec\n    }\n\n    isGranted(role, item) {\n        return role.isGranted(this.permissions, item)\n    }\n\n    trigger(context, item, ...args) {\n        let role = context && context.role\n        if(role && this.isGranted(role, item))\n            this.exec(item, ...args)\n    }\n}\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/action.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"copyProps\": () => (/* binding */ copyProps),\n/* harmony export */   \"PField\": () => (/* reexport safe */ _field__WEBPACK_IMPORTED_MODULE_0__.default),\n/* harmony export */   \"PFieldRow\": () => (/* reexport safe */ _fieldRow__WEBPACK_IMPORTED_MODULE_1__.default),\n/* harmony export */   \"PForm\": () => (/* reexport safe */ _form__WEBPACK_IMPORTED_MODULE_2__.default),\n/* harmony export */   \"PDeck\": () => (/* reexport safe */ _deck__WEBPACK_IMPORTED_MODULE_3__.default),\n/* harmony export */   \"PList\": () => (/* reexport safe */ _list__WEBPACK_IMPORTED_MODULE_4__.default),\n/* harmony export */   \"PModal\": () => (/* reexport safe */ _modal__WEBPACK_IMPORTED_MODULE_5__.default),\n/* harmony export */   \"PNav\": () => (/* reexport safe */ _nav__WEBPACK_IMPORTED_MODULE_6__.default),\n/* harmony export */   \"PNavItem\": () => (/* reexport safe */ _navItem__WEBPACK_IMPORTED_MODULE_7__.default),\n/* harmony export */   \"PRuntimeTemplate\": () => (/* reexport safe */ _runtimeTemplate__WEBPACK_IMPORTED_MODULE_8__.default),\n/* harmony export */   \"PContext\": () => (/* reexport safe */ _context__WEBPACK_IMPORTED_MODULE_9__.default),\n/* harmony export */   \"PSelectRole\": () => (/* reexport safe */ _selectRole__WEBPACK_IMPORTED_MODULE_10__.default),\n/* harmony export */   \"PSubscription\": () => (/* reexport safe */ _subscription__WEBPACK_IMPORTED_MODULE_11__.default),\n/* harmony export */   \"PSubscriptionButton\": () => (/* reexport safe */ _subscriptionButton__WEBPACK_IMPORTED_MODULE_12__.default),\n/* harmony export */   \"PSubscriptionForm\": () => (/* reexport safe */ _subscriptionForm__WEBPACK_IMPORTED_MODULE_13__.default)\n/* harmony export */ });\n/* harmony import */ var _field__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./field */ \"./assets/core/components/field.vue\");\n/* harmony import */ var _fieldRow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fieldRow */ \"./assets/core/components/fieldRow.vue\");\n/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./form */ \"./assets/core/components/form.vue\");\n/* harmony import */ var _deck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./deck */ \"./assets/core/components/deck.vue\");\n/* harmony import */ var _list__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./list */ \"./assets/core/components/list.vue\");\n/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modal */ \"./assets/core/components/modal.vue\");\n/* harmony import */ var _nav__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./nav */ \"./assets/core/components/nav.vue\");\n/* harmony import */ var _navItem__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./navItem */ \"./assets/core/components/navItem.vue\");\n/* harmony import */ var _runtimeTemplate__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./runtimeTemplate */ \"./assets/core/components/runtimeTemplate.js\");\n/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./context */ \"./assets/core/components/context.vue\");\n/* harmony import */ var _selectRole__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./selectRole */ \"./assets/core/components/selectRole.vue\");\n/* harmony import */ var _subscription__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./subscription */ \"./assets/core/components/subscription.vue\");\n/* harmony import */ var _subscriptionButton__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./subscriptionButton */ \"./assets/core/components/subscriptionButton.vue\");\n/* harmony import */ var _subscriptionForm__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./subscriptionForm */ \"./assets/core/components/subscriptionForm.vue\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nfunction copyProps(source, override) {\n    const props = {}\n    for(const key in source) {\n        const value = source[key]\n        const ovalue = override[key]\n        if(ovalue instanceof Object && value instanceof Object)\n            props[key] = { ...value, ...ovalue }\n        else\n            props[key] = ovalue\n    }\n    return props\n}\n\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/index.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"form\": () => (/* binding */ form),\n/* harmony export */   \"singleSelect\": () => (/* binding */ singleSelect)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models */ \"./assets/core/models.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ \"./assets/core/composables/utils.js\");\n\n\n\n\n\n\n/**\n * Composable handling form, handling both Model and regular objects.\n * It sends data using XmlHttpRequest.\n *\n * Provides: 'errors' (errors returned by the server)\n *\n * @param {Ref({})} initial         initial data of form's fields\n * @param {Ref({})} defaults        default values of form's fields\n * @param bool      commit          use Model.save and commit changes to store\n * @param {}        submitConfig    extra config to pass to submit method\n *\n * @fires form#success\n * @fires form#error\n * @fires form#reset\n *\n */\nfunction form({initial: initial_, defaults = null,\n                      model = null, commit=false,\n                      submitConfig={}, ...ctx}, { emit })\n{\n    // TODO: include usage of optional 'action' props\n    const initial = (0,vue__WEBPACK_IMPORTED_MODULE_2__.computed)(() => initial_.value || (defaults && defaults.value) || {})\n    const constructor = (0,vue__WEBPACK_IMPORTED_MODULE_2__.computed)(() => model && model.value ? model.value\n                                                            : initial.value.constructor)\n    const data = (0,vue__WEBPACK_IMPORTED_MODULE_2__.reactive)(new constructor.value({...initial.value}))\n    const errors = (0,vue__WEBPACK_IMPORTED_MODULE_2__.reactive)({})\n    ;(0,vue__WEBPACK_IMPORTED_MODULE_2__.provide)('errors', errors)\n\n\n    function reset(value=null) {\n        for(var k in data)\n            delete data[k]\n\n        resetErrors()\n\n        Object.assign(data, value || initial.value)\n        emit('reset', data)\n    }\n\n    function resetErrors(value=null) {\n        for(var k in errors)\n            delete errors[k]\n\n        if(value) {\n            Object.assign(errors, value)\n            emit('error', value)\n        }\n    }\n\n    function submitForm(ev, form=null) {\n        if(ev) {\n            ev.preventDefault()\n            ev.stopPropagation()\n        }\n\n        form = form || ev.target\n        const [url, method] = [form.action, form.getAttribute('method')]\n        const res = (commit.value && model && model.value) ?\n            data.save({form, url, method, ...submitConfig}) :\n            (0,_models__WEBPACK_IMPORTED_MODULE_0__.submit)({form, url, method, ...submitConfig})\n\n        return res.then(r => {\n            if(200 <= r.status < 300) {\n                reset(r.data)\n                emit('success', r.data)\n            }\n            else if(r.errors)\n                resetErrors(r.data)\n            return r\n        })\n    }\n\n    reset()\n    ;(0,vue__WEBPACK_IMPORTED_MODULE_2__.watch)(initial, reset)\n    ;(0,vue__WEBPACK_IMPORTED_MODULE_2__.watch)(constructor, reset)\n    return { ...ctx, initial, data, errors, reset, resetErrors,\n             constructor: constructor,\n             submit: submitForm }\n}\n\nform.emits = ['success', 'error', 'reset']\n\n/**\n * Return components' props for form\n */\nform.props = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.makeProps)({\n    action: { type: String, default: '' },\n    initial: { type: Object, default: null },\n    commit: { type: Boolean, default: true },\n})\n\n\n/**\n * Select item\n */\nfunction singleSelect(props, emit) {\n    const selected = (0,vue__WEBPACK_IMPORTED_MODULE_2__.ref)(props.default)\n    function select(value=null) {\n        value = value === null ? props.default : value\n        if(value != selected.value) {\n            selected.value = value\n            emit('select', selected.value)\n        }\n    }\n    return { selected, select }\n}\n\nsingleSelect.emits = ['select']\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/composables/forms.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"filters\": () => (/* binding */ filters),\n/* harmony export */   \"Filter\": () => (/* binding */ Filter),\n/* harmony export */   \"Filters\": () => (/* binding */ Filters),\n/* harmony export */   \"getList\": () => (/* binding */ getList),\n/* harmony export */   \"fetchList\": () => (/* binding */ fetchList)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./assets/core/composables/utils.js\");\n\n\n\n\n\nconst filters = {\n    eq: (x, y) => x == y,\n    gt: (x, y) => x > y,\n    gte: (x, y) => x >= y,\n    lt: (x, y) => x < y,\n    lte: (x, y) => x <= y,\n    in: (x, y) => y.indexOf(x) != -1,\n    isnull: (x, y) => y ? (x === null || x === undefined)\n                        : (x !== null && x !== undefined),\n    startswith: (x, y) => x.startswith(y),\n    endswith: (x, y) => x.endswith(y),\n}\n\nclass Filter {\n    constructor(key, value) {\n        let path = key.split('__')\n        let last = path.length > 1 && path[path.length-1]\n        if(last && filters[last])\n            path = path.slice(0, filters.length-1)\n        else\n            last = 'eq'\n\n        this.path = path\n        this.pred = filters[last]\n        this.value = value\n    }\n\n    test(left) {\n        for(const p of this.path) {\n            if(left === undefined)\n                return false\n            left = left[p]\n        }\n        const right = (this.value instanceof Function && this.value(left)) || this.value\n        return this.pred(left, right)\n    }\n}\n\nclass Filters {\n    constructor(filters=null) {\n        this.set(filters, true)\n    }\n\n    get length() {\n        return this._length\n    }\n\n    test(value) {\n        for(let filter of Object.values(this.all))\n            if(!filter.test(value))\n                return false\n        return true\n    }\n\n    urlParams(params=null) {\n        params = params || new URLSearchParams()\n        for(let [key, filter] of Object.entries(this.all))\n            params.set(key, filter.value)\n        return params\n    }\n\n    set(filters, reset=false) {\n        if(!this.all || reset)\n            [this.all, this._length] = [{}, 0]\n\n        if(filters)\n            for(let [key, filter] of Object.entries(filters))\n                this.all[key] = new Filter(key, filter)\n\n        this._length = filters ? Object.keys(filters).length : 0\n    }\n\n    setValues(values) {\n        for(let [key, value] of Object.entries(values))\n            if(this.all[key])\n                this.all[key].value = value\n    }\n}\n\n\n\nfunction getList({model, filters, orderBy=null}) {\n    const listFilters = new Filters(filters.value)\n    const listQuery = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => {\n        if(!model.value)\n            return null\n\n        const ob = orderBy && orderBy.value ? orderBy.value.startsWith('-')\n                                            ? [orderBy.value.slice(1), 'desc']\n                                            : [orderBy.value, 'asc']\n                                            : null\n        let query = model.value.query()\n        if(listFilters.length)\n            query = query.where(x => listFilters.test(x))\n        if(ob)\n            query = query.orderBy((obj) => obj[ob[0], ob[1]])\n        return query\n    })\n    const list = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => {\n        return listQuery.value && listQuery.value.get()\n    })\n\n    ;(0,vue__WEBPACK_IMPORTED_MODULE_1__.watch)(filters, (v) => listFilters.set(v, true))\n    return {model, filters, orderBy, list, listFilters, listQuery}\n}\n\n\ngetList.props = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.makeProps)({\n    filters: { type: Object, default: null },\n    orderBy: { type: String, default: '' },\n})\n\n\nfunction fetchList({model, listFilters, url=null}) {\n    const pagination = (0,vue__WEBPACK_IMPORTED_MODULE_1__.reactive)({\n        count: null, next: null, prev:null\n    })\n\n    function fetch({filters=null, ...config}={}) {\n        if(!config.url && url && url.value)\n            config.url = url.value\n\n        config.urlParams = new URLSearchParams(config.url ? (new URL(config.url)).search\n                                                          : undefined)\n        if(listFilters.length) {\n            if(filters)\n                listFilters.setValues(filters)\n            listFilters.urlParams(config.urlParams)\n        }\n\n        return model.value.fetch({ ...config }).then(r => {\n            const data = r.response.data\n            pagination.count = data.count\n            pagination.next = data.next\n            pagination.prev = data.prev\n            return r\n        })\n    }\n\n    function fetchNext(config={}) {\n        return pagination.next ? fetch({...config, url: pagination.next})\n                               : new Promise((resolve) => resolve(null))\n    }\n\n    function fetchPrev(config={}) {\n        return pagination.prev ? fetch({...config, url: pagination.prev})\n                               : new Promise((resolve) => resolve(null))\n    }\n\n    return { url, pagination, fetch, fetchNext, fetchPrev }\n}\n\nfetchList.props = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.makeProps)({\n    url: { type: String, default: null },\n})\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/composables/lists.js?");

/***/ }),

/***/ "./assets/core/composables/models.js":
/*!*******************************************!*\
  !*** ./assets/core/composables/models.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"useModel\": () => (/* binding */ useModel),\n/* harmony export */   \"getObject\": () => (/* binding */ getObject),\n/* harmony export */   \"getOrFetch\": () => (/* binding */ getOrFetch),\n/* harmony export */   \"useContext\": () => (/* binding */ useContext),\n/* harmony export */   \"useContextById\": () => (/* binding */ useContextById),\n/* harmony export */   \"useParentContext\": () => (/* binding */ useParentContext)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vuex */ \"./node_modules/vuex/dist/vuex.esm-bundler.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./assets/core/composables/utils.js\");\n\n\n\n\n\n/**\n *  Provide model class using component's store\n */\nfunction useModel({entity=null, item=null}={}) {\n    const model = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() =>\n        (entity && entity.value) ? (0,vuex__WEBPACK_IMPORTED_MODULE_2__.useStore)().$db().model(entity.value)\n                                 : item && item.value ? item.value.constructor : null)\n    return { model, entity }\n}\n\nuseModel.props = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.makeProps)({\n    entity: { type: String, default: null }\n})\n\n/**\n * Get model instance by id. If not present, fetch from remote server.\n */\nfunction getObject(id, entity) {\n    const model = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => entity.value && (0,vuex__WEBPACK_IMPORTED_MODULE_2__.useStore)().$db().model(entity.value))\n    const object = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => model.value && model.value.find(id.value))\n    return { model, object }\n}\n\n/**\n * Get model instance by id. If not present, fetch from remote server.\n */\nfunction getOrFetch(id, entity) {\n    const { model, object } = getObject(id, entity)\n\n    function fetch(id, force=false) {\n        if(!id.value || !model.value)\n            return\n        var obj = model.value.find(id.value)\n        if(force || obj == null || obj.value == null)\n            model.value.fetch({id: id.value})\n    }\n    (0,vue__WEBPACK_IMPORTED_MODULE_1__.watch)(id, fetch)\n    ;(0,vue__WEBPACK_IMPORTED_MODULE_1__.nextTick)().then(() => fetch(id))\n\n    return { model, object }\n}\n\n\n/**\n *  Add context's information to component. Use injected values when no\n *  context reference is provided.\n *\n *  Context:\n *  - context: current context\n *  - role: user's role\n *  - roles: available roles (injected from App)\n *\n *  Provide:\n *  - context: provided context (if any)\n *\n *  @param {Ref({})} [context=null]\n */\nfunction useContext(context=null) {\n    // TODO: context as Model or reactive\n    if(context != null) {\n        const { role, roles, subscription } = (0,vue__WEBPACK_IMPORTED_MODULE_1__.toRefs)(context)\n        // FIXME context is a reactive object, break api with other case\n        ;(0,vue__WEBPACK_IMPORTED_MODULE_1__.provide)('context', (0,vue__WEBPACK_IMPORTED_MODULE_1__.readonly)(context))\n        return { context, role, roles, subscription }\n    }\n\n    if(context==null)\n        context = (0,vue__WEBPACK_IMPORTED_MODULE_1__.inject)('context')\n\n    const role = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => context.value && context.value.role)\n    const roles = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => context.value && context.value.roles)\n    const subscription = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => context.value && context.value.subscription)\n\n    return { context, role, roles, subscription }\n}\n\nuseContext.props = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.makeProps)({\n    context: { type: Object, required: true },\n})\n\n\n/**\n * Use context by id.\n */\nfunction useContextById({contextId: id, contextEntity: entity, fetch=false}) {\n    const { object: context } = fetch ? getOrFetch(id, entity) : getObject(id, entity)\n    return useContext(context)\n}\n\nuseContextById.props = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.makeProps)({\n    contextId: { type: String, default: null },\n    contextEntity: { type: String, default: 'context' },\n})\n\n/**\n *  Use context of an Accessible instance\n */\nfunction useParentContext(item) {\n    const context = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => item.value && item.value.context)\n    return useContext(context)\n}\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/composables/models.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Action\": () => (/* reexport safe */ _action__WEBPACK_IMPORTED_MODULE_1__.default),\n/* harmony export */   \"App\": () => (/* reexport safe */ _app__WEBPACK_IMPORTED_MODULE_2__.default),\n/* harmony export */   \"createApp\": () => (/* reexport safe */ _app__WEBPACK_IMPORTED_MODULE_2__.createApp),\n/* harmony export */   \"getScriptData\": () => (/* reexport safe */ _app__WEBPACK_IMPORTED_MODULE_2__.getScriptData),\n/* harmony export */   \"components\": () => (/* reexport module object */ _components__WEBPACK_IMPORTED_MODULE_3__),\n/* harmony export */   \"models\": () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_4__.default),\n/* harmony export */   \"importDatabase\": () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_4__.importDatabase),\n/* harmony export */   \"Role\": () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_4__.Role),\n/* harmony export */   \"modelsPlugin\": () => (/* reexport safe */ _plugins__WEBPACK_IMPORTED_MODULE_5__.modelsPlugin),\n/* harmony export */   \"addGlobals\": () => (/* binding */ addGlobals)\n/* harmony export */ });\n/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.scss */ \"./assets/core/styles.scss\");\n/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action */ \"./assets/core/action.js\");\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app */ \"./assets/core/app.js\");\n/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components */ \"./assets/core/components/index.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./models */ \"./assets/core/models.js\");\n/* harmony import */ var _plugins__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./plugins */ \"./assets/core/plugins.js\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n/**\n *  Add items into `window.pepr[namespace]` object.\n */\nfunction addGlobals(namespace, globals) {\n    if(!window.pepr)\n        window.pepr = {}\n    window.pepr[namespace] = { ...(window.pepr[namespace] || {}), ...globals }\n}\n\naddGlobals('core', {\n    createApp(props) {\n        return (0,_app__WEBPACK_IMPORTED_MODULE_2__.createApp)(_app__WEBPACK_IMPORTED_MODULE_2__.default, props)\n    },\n    getScriptData: _app__WEBPACK_IMPORTED_MODULE_2__.getScriptData, importDatabase: _models__WEBPACK_IMPORTED_MODULE_4__.importDatabase\n})\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/index.js?");

/***/ }),

/***/ "./assets/core/models.js":
/*!*******************************!*\
  !*** ./assets/core/models.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getSubmitConfig\": () => (/* binding */ getSubmitConfig),\n/* harmony export */   \"submit\": () => (/* binding */ submit),\n/* harmony export */   \"importDatabase\": () => (/* binding */ importDatabase),\n/* harmony export */   \"Model\": () => (/* binding */ Model),\n/* harmony export */   \"Role\": () => (/* binding */ Role),\n/* harmony export */   \"Context\": () => (/* binding */ Context),\n/* harmony export */   \"Accessible\": () => (/* binding */ Accessible),\n/* harmony export */   \"Owned\": () => (/* binding */ Owned),\n/* harmony export */   \"Subscription\": () => (/* binding */ Subscription),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-cookie */ \"./node_modules/js-cookie/src/js.cookie.js\");\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(js_cookie__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _vuex_orm_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vuex-orm/core */ \"./node_modules/@vuex-orm/core/dist/vuex-orm.esm.js\");\n\n\n\n\n\nfunction getSubmitConfig({url=null, data={}, form=null, ...config}) {\n    url = url || form && form.getAttribute('action')\n\n    if(!Object.keys(data).length)\n        data = new FormData(form)\n    else if(!(data instanceof FormData)) {\n        const formData = new FormData()\n        for(let key in data)\n            formData.append(key, data[key])\n        data = formData\n    }\n\n    config.method = config.method || form.getAttribute('method') || 'POST'\n    config.headers = {...(config.headers || {}),\n        'Content-Type': 'multipart/form-data',\n        'X-CSRFToken': js_cookie__WEBPACK_IMPORTED_MODULE_0___default().get('csrftoken'),\n    }\n    return {...config, url, body: data}\n}\n\n\n\n/**\n * Submit data to server.\n */\nfunction submit({bodyType='json', ...config}) {\n    const { url, ...config_ } = getSubmitConfig(config)\n    return fetch(url, config_).then(\n        r => r[bodyType]().then(d => {\n            d = { status: r.status, data: d, response: r }\n            if(400 <= d.status)\n                throw(d)\n            return d\n        })\n    )\n}\n\n\n/**\n * Load models from data, as an Object of `{ entity: insertOrUpdateData }`\n */\nfunction importDatabase(store, data) {\n    let db = store.$db();\n    for(var entity in data) {\n        let model = db.model(entity)\n        model ? model.insertOrUpdate({ data: data[entity] })\n              : console.warn(`model ${entity} is not a registered model`)\n    }\n}\n\n\n/**\n * Base model class\n */\nclass Model extends _vuex_orm_core__WEBPACK_IMPORTED_MODULE_1__.Model {\n    /**\n     * Default model's api entry point\n     */\n    static get url() { return '' }\n    static get fullUrl() { return `${this.store().baseURL}${this.url}`.replace('//','/') }\n\n    static get primaryKey() { return 'pk' }\n    static get apiConfig() {\n        return {\n            headers: { 'X-CSRFToken': js_cookie__WEBPACK_IMPORTED_MODULE_0___default().get('csrftoken') },\n        }\n    }\n\n    static fields() {\n        return {\n            pk: this.string(null),\n            access: this.number(null),\n        }\n    }\n\n    /**\n     * Item's url (PUT or POST url)\n     */\n    get $url() {\n        return this.$id ? `${this.constructor.url}${this.$id}/`\n                        :  this.constructor.url;\n    }\n\n    get $fullUrl() {\n        const url = this.$store.baseURL;\n        return url ? `${url}/${this.$url}` : this.$url\n    }\n\n    /**\n     * Return other model in the same database.\n     */\n    $model(model) {\n        model = model.prototype instanceof Model ? model.entity : model\n        return this.$store().$db().model(model)\n    }\n\n    /**\n     * Fetch one or more entities from server.\n     */\n    static fetch({id='', url=null, urlParams=null, ...config}={}) {\n        if(!url)\n            url = id ? `${this.url}${id}/` : this.url\n        if(urlParams)\n            url = `${url}?${urlParams.toString()}`\n\n        // django drf results\n        if(!id && config.dataKey === undefined)\n            config.dataKey = 'results'\n\n        return this.api().get(url, config)\n    }\n\n    /**\n     * Reload item from the server\n     */\n    fetch(config) {\n        if(!this.$id)\n            throw \"item is not on server\"\n        return this.$id && this.constructor.api().get(this.$url, config)\n            .then(r => {\n                if(200 <= r < 400)\n                    this.constructor.insertOrUpdate({data: r.response.data})\n                return r\n            })\n    }\n\n    /**\n     * Save item to server and return promise\n     */\n    save(config = {}) {\n        if(!config.data && !config.form) {\n            // FIXME: exclude relations / use data\n            config.data = {}\n            const fields = this.constructor.fields()\n            for(var key in fields)\n                if(this[key] !== undefined)\n                    config.data[key] = this[key]\n        }\n        if(!config.method)\n            config.method = self.$id ? 'PUT': 'POST'\n        config.url = this.$url\n\n        let {body, method, url, ...config_} = getSubmitConfig(config)\n        method = method.toLowerCase()\n\n        return this.constructor.api()[method](url, body, config_)\n    }\n\n    /**\n     * Delete item from server and return promise\n     */\n    delete(config) {\n        config.delete = true\n        if(this.$url)\n            return this.constructor.api().delete(this.$url, config).then(r => {\n                this.constructor.delete(this.$id)\n                return r\n            })\n        else\n            throw \"no api url for item\"\n    }\n}\n\n\nclass Role {\n    /* static fields() {\n        return {\n            context_id: this.string(null),\n            subscription_id: this.string(null),\n            identity_id: this.string(null),\n            access: this.number(null),\n            is_anonymous: this.boolean(false),\n            is_subscribed: this.boolean(false),\n            is_moderator: this.boolean(false),\n            is_admin: this.boolean(false),\n            permissions: this.attr(null)\n       }\n    } */\n\n    static subclass(name, statics, prototype={}) {\n        class ChildClass extends this {}\n        for(var key in statics)\n            ChildClass[key] = statics[key]\n\n        ChildClass.prototype = {...ChildClass.prototype, ...prototype}\n        return ChildClass\n    }\n\n    constructor(data=null) {\n        data && Object.assign(this, data)\n    }\n\n    /**\n     * True if all permissions are granted for this role\n     */\n    isGranted(permissions, item=null) {\n        if(!this.permissions)\n            return false\n        if(item && item instanceof Owned && this.identity == item.owner)\n            return true\n\n        for(var name of permissions)\n            if(!this.permissions[name])\n                return false\n        return true\n    }\n}\n\n\nclass Context extends Model {\n    static get entity() { return 'context' }\n    static get url() { return '/pepr/core/context/' }\n\n    static fields() {\n        return { ...super.fields(),\n            default_access: this.number(null),\n            allow_subscription_request: this.attr(null),\n            subscription_accept_role: this.number(null),\n            subscription_default_access: this.number(null),\n            subscription_default_role: this.number(null),\n            // subsciption: this.attr(null),\n            subsciptions: this.hasMany(Subscription, 'context'),\n            n_subscriptions: this.number(0),\n            role: this.attr(null, value => new Role(value)),\n        }\n    }\n\n    static fetchRoles() {\n        if(this.roles !== undefined)\n            return new Promise(resolve => resolve(this.roles))\n        const url = `${this.fullUrl}roles/`\n        return fetch(url).then(r => r.json(), r => console.error(r))\n                         .then(r => { this.roles = this._validate_roles(r) })\n    }\n\n    static _validate_roles(value) {\n        if(!value)\n            return {}\n\n        const roles = {}\n        for(var role of value)\n            roles[role.access] = role\n        return roles\n    }\n\n    /**\n     * Return user's identity\n     */\n    get identity() {\n        let id = this.role && this.role.identity_id\n        return id && this.$model('context').find(id)\n    }\n\n    /**\n     * Return user's subscription\n     */\n    get subscription() {\n        let id = this.role && this.role.identity_id\n        return id && this.$model('subscription').query()\n            .where({ context_id: this.$id, owner_id: id }).first()\n    }\n\n    get roles() {\n        return this.constructor.roles\n    }\n}\n\n\n\nclass Accessible extends Model {\n    static get entity() { return 'accessible' }\n\n    static fields() {\n        return { ...super.fields(),\n            context_id: this.attr(null),\n            // context: this.belongsTo(Context, 'context_id'),\n        }\n    }\n\n    /**\n     * Available choices for 'access' attribute.\n     */\n    static accessChoices(roles, role=null) {\n        if(!Array.isArray(roles))\n            roles = Object.values(roles)\n        return role ? roles.filter((r) => r.access <= role.access) : roles\n    }\n\n    /**\n     * Parent context object.\n     */\n    get context() {\n        return this.context_id && this.constructor.contextModel.find(this.context_id)\n    }\n\n    // FIXME: wtf\n    granted(permissions) {\n        let role_perms = this.context.role.permissions\n        if(!Array.isArray(perms))\n            return !!role_perms[permissions]\n\n        for(var permission of permissions)\n            if(!role_perms[permission])\n                return false\n        return true\n    }\n}\n\nclass Owned extends Accessible {\n    static get entity() { return 'owned' }\n\n    static fields() {\n        return { ...super.fields(),\n            owner_id: this.attr(null),\n        //    owner: this.belongsTo(Context, 'owner_id'),\n        }\n    }\n\n    /**\n     * Related owner object\n     */\n    get owner() {\n        return null; // Context.find(this.owner_id)\n    }\n}\n\nclass Subscription extends Owned {\n    static get entity() { return 'subscription' }\n    static get url() { return '/pepr/core/subscription/' }\n\n    static fields() {\n        return { ...super.fields(),\n            status: this.number(),\n            access: this.number(),\n            role: this.number(),\n        }\n    }\n\n    static accessChoices(roles, role=null) {\n        if(roles.prototype instanceof Context)\n            roles = roles.roles\n        return super.accessChoices(roles, role)\n                    .filter(role => role.status != 'moderator' && role.status != 'admin')\n    }\n\n    /**\n     * Available choices for the 'role' attribute\n     */\n    static roleChoices(roles, role=null) {\n        return this.accessChoices(roles, role)\n                   .filter(role => role.status != 'anonymous' &&\n                                   role.status != 'registered')\n    }\n\n    save(config) {\n        return super.save(config).then(\n            r => {\n                this.context && this.context.fetch()\n                return r\n            }\n        )\n    }\n\n    delete(config) {\n        const context = this.context\n        return super.delete(config).then(\n            r => {\n                context && context.fetch()\n                return r\n            },\n        )\n    }\n\n    /**\n     * Subscription is an invitation\n     */\n    get isInvite() { return this.status == Subscription.INVITE }\n\n    /**\n     * Subscription is a request\n     */\n    get isRequest() { return this.status == Subscription.REQUEST }\n\n    /**\n     * Subscription is validated\n     */\n    get isSubscribed() { return this.status == Subscription.SUBSCRIBED }\n}\nSubscription.INVITE = 1\nSubscription.REQUEST = 2\nSubscription.SUBSCRIBED = 3\n\n\nconst defaults = { Context, Subscription }\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defaults);\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/models.js?");

/***/ }),

/***/ "./assets/core/plugins.js":
/*!********************************!*\
  !*** ./assets/core/plugins.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"modelsPlugin\": () => (/* binding */ modelsPlugin),\n/* harmony export */   \"initModelsPlugin\": () => (/* binding */ initModelsPlugin)\n/* harmony export */ });\n/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vuex */ \"./node_modules/vuex/dist/vuex.esm-bundler.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! axios */ \"./node_modules/axios/lib/axios.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _vuex_orm_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vuex-orm/core */ \"./node_modules/@vuex-orm/core/dist/vuex-orm.esm.js\");\n/* harmony import */ var _vuex_orm_plugin_axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vuex-orm/plugin-axios */ \"./node_modules/@vuex-orm/plugin-axios/dist/vuex-orm-axios.esm-browser.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models */ \"./assets/core/models.js\");\n\n\n\n\n\n\n\n\n\n\n/**\n * Create Vuex ORM database using provided models. Add model getters to\n * application global properties.\n */\nconst modelsPlugin = {\n    install(app, {models={}, baseURL='', storeConfig={}}={}) {\n        _vuex_orm_core__WEBPACK_IMPORTED_MODULE_1__.default.use(_vuex_orm_plugin_axios__WEBPACK_IMPORTED_MODULE_2__.default, { axios: (axios__WEBPACK_IMPORTED_MODULE_3___default()), baseURL })\n\n        // store\n        const database = new _vuex_orm_core__WEBPACK_IMPORTED_MODULE_1__.default.Database()\n        for(let model of models)\n            database.register(model)\n\n        storeConfig.plugins = [ ...(storeConfig.plugins || []), _vuex_orm_core__WEBPACK_IMPORTED_MODULE_1__.default.install(database) ]\n        const store = (0,vuex__WEBPACK_IMPORTED_MODULE_4__.createStore)(storeConfig)\n        store['baseURL'] = baseURL.toString()\n        app.use(store)\n\n        // getters\n        const target = app.config.globalProperties;\n        for(let key in models) {\n            let model = models[key]\n            if(!target[model.name])\n                target[model.name] = target.$store.$db().model(model.entity)\n        }\n    }\n}\n\n\n/**\n * Perform initialization of provided models\n */\nconst initModelsPlugin = {\n    install(app, {models={}, tasks=[]}) {\n        const target = app.config.globalProperties\n        for(let model of models) {\n            model = target.$store.$db().model(model.entity)\n            if(!model)\n                throw `model '${model.entity}' is not declared on app`\n            if(model.prototype instanceof _models__WEBPACK_IMPORTED_MODULE_0__.Context)\n                tasks.push(model.fetchRoles())\n        }\n    }\n}\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/plugins.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables/index.js\");\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        ..._composables__WEBPACK_IMPORTED_MODULE_0__.useContextById.props(),\n    },\n\n    setup(props) {\n        const propsRefs = (0,vue__WEBPACK_IMPORTED_MODULE_1__.toRefs)(props)\n        const contextId = (0,vue__WEBPACK_IMPORTED_MODULE_1__.ref)(propsRefs.contextId && propsRefs.contextId.value)\n        const contextComp = _composables__WEBPACK_IMPORTED_MODULE_0__.useContextById({...propsRefs, contextId, fetch: true})\n\n        ;(0,vue__WEBPACK_IMPORTED_MODULE_1__.watch)(propsRefs.contextId, (id) => { contextId.value = id })\n\n        return {...contextComp, contextId}\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/context.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables/index.js\");\n\n// TODO:\n// - history stack of deck\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    emits: _composables__WEBPACK_IMPORTED_MODULE_0__.singleSelect.emits,\n    props: {\n        default: { type: String, default: 'default' },\n    },\n\n    setup(props, { emit }) {\n        return (0,_composables__WEBPACK_IMPORTED_MODULE_0__.singleSelect)(props, emit)\n    },\n\n    render() {\n        return (this.selected &&\n                this.$slots[this.selected] && this.$slots[this.selected]()) ||\n                (0,vue__WEBPACK_IMPORTED_MODULE_1__.h)('div')\n    },\n});\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/deck.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        label: String,\n        name: String,\n        leftIcons: Array,\n        rightIcons: Array,\n    },\n\n    setup(props) {\n        const errors = (0,vue__WEBPACK_IMPORTED_MODULE_0__.inject)('errors')\n        const error = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => errors && errors[props.name])\n        return { error }\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/field.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        label: String,\n        name: String,\n    },\n\n    setup(props) {\n        const errors = (0,vue__WEBPACK_IMPORTED_MODULE_0__.inject)('errors')\n        const error = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => errors && errors[props.name])\n        return { error }\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/fieldRow.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/form.vue":
/*!*****************************************!*\
  !*** ./assets/core/components/form.vue ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _form_vue_vue_type_template_id_05d1c81b__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form.vue?vue&type=template&id=05d1c81b */ \"./assets/core/components/form.vue?vue&type=template&id=05d1c81b\");\n/* harmony import */ var _form_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form.vue?vue&type=script&lang=js */ \"./assets/core/components/form.vue?vue&type=script&lang=js\");\n\n\n\n_form_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.render = _form_vue_vue_type_template_id_05d1c81b__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_form_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.__file = \"assets/core/components/form.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_form_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default);\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/form.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/form.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/form.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables/index.js\");\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    emits: [..._composables__WEBPACK_IMPORTED_MODULE_0__.form.emits],\n    props: {\n        ..._composables__WEBPACK_IMPORTED_MODULE_0__.useModel.props(),\n        ..._composables__WEBPACK_IMPORTED_MODULE_0__.form.props({commit:true}),\n    },\n\n    setup(props, context_) {\n        const propsRefs = (0,vue__WEBPACK_IMPORTED_MODULE_1__.toRefs)(props)\n        // const contextComp = composables.useContext()\n        const modelComp = _composables__WEBPACK_IMPORTED_MODULE_0__.useModel(propsRefs);\n        const formComp  = _composables__WEBPACK_IMPORTED_MODULE_0__.form({...propsRefs, ...modelComp}, context_)\n        const data = formComp.data;\n        const method = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => modelComp.model ? data.value && data.value.$id ? 'PUT' : 'POST'\n                                                      : props.method || 'POST')\n        return {...modelComp, ...formComp, method}\n    },\n\n\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/form.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables/index.js\");\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        ..._composables__WEBPACK_IMPORTED_MODULE_0__.useModel.props(),\n        ..._composables__WEBPACK_IMPORTED_MODULE_0__.getList.props(),\n        ..._composables__WEBPACK_IMPORTED_MODULE_0__.fetchList.props(),\n        fetchAuto: { type: Boolean, default: true },\n    },\n\n    setup(props) {\n        let propsRefs = (0,vue__WEBPACK_IMPORTED_MODULE_1__.toRefs)(props)\n        let modelComp = _composables__WEBPACK_IMPORTED_MODULE_0__.useModel(propsRefs)\n        let listComp = _composables__WEBPACK_IMPORTED_MODULE_0__.getList({...propsRefs, ...modelComp})\n        let fetchComp = _composables__WEBPACK_IMPORTED_MODULE_0__.fetchList(listComp)\n\n        ;(0,vue__WEBPACK_IMPORTED_MODULE_1__.watch)(propsRefs.url, (url) => props.fetchAuto && fetchComp.fetch({url}))\n        ;(0,vue__WEBPACK_IMPORTED_MODULE_1__.watch)(propsRefs.filters, (filters) => props.fetchAuto && fetchComp.fetch({filters}))\n        return {...modelComp, ...listComp, ...fetchComp}\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/list.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables/index.js\");\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        default: { type: String, default: 'default' },\n        // deck: { type: Object },\n    },\n\n    setup(props, { emit }) {\n        var select = (0,_composables__WEBPACK_IMPORTED_MODULE_0__.singleSelect)(props, emit)\n\n        function onClick(event) {\n            let el = event.target\n            if(!el.hasAttribute('target'))\n                return\n\n            event.preventDefault()\n            event.stopPropagation()\n\n            select.select(el.getAttribute('target'))\n        }\n        return { ...select, onClick }\n    },\n});\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/nav.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables/index.js\");\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    inheritAttrs: false,\n    emits: ['update:value'],\n\n    props: {\n        value: { type: [Number,String], default: null },\n        roles: { type: Array, default: null },\n        filter: { type: Function, default: null },\n    },\n\n    setup(props) {\n        const {roles, filter} = (0,vue__WEBPACK_IMPORTED_MODULE_1__.toRefs)(props)\n        const contextComp = _composables__WEBPACK_IMPORTED_MODULE_0__.useContext()\n        const value = (0,vue__WEBPACK_IMPORTED_MODULE_1__.ref)(Number(props.value))\n        const options = (0,vue__WEBPACK_IMPORTED_MODULE_1__.computed)(() => {\n            var roles_ = roles.value ? roles.value : contextComp.roles.value\n            if(!filter.value)\n                return roles_\n\n            const options = []\n            if(roles) {\n                for(var role of Object.values(roles_)) {\n                    if(filter.value(role))\n                        options.push(role)\n                }\n                options.sort((x, y) => x.access < y.access)\n            }\n            return options\n        })\n        return { ...contextComp, value, options }\n    },\n\n    computed: {\n        computedValue: {\n            get() {\n                return this.value\n            },\n            set(value) {\n                this.value = value;\n                this.$emit('update:value', value)\n            }\n        },\n    },\n});\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/selectRole.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _subscriptionForm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./subscriptionForm */ \"./assets/core/components/subscriptionForm.vue\");\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables/index.js\");\n/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modal */ \"./assets/core/components/modal.vue\");\n\n\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        noText: { type: Boolean, default: false },\n        isSmall: { type: Boolean, default: false },\n    },\n\n    setup() {\n        const contextComp = _composables__WEBPACK_IMPORTED_MODULE_1__.useContext()\n        return { ...contextComp }\n    },\n\n    methods: {\n        edit() {\n            this.$refs.modal.show()\n        },\n\n        subscribe() {\n            return new this.$root.Subscription({\n                context_id: this.context.$id,\n                access: this.context.subscription_default_access,\n                role: this.context.subscription_default_role,\n            }).save()\n        },\n\n        unsubscribe() {\n            confirm(`Unsubscribe from ${this.context.title}?`) &&\n                this.subscription.delete()\n        },\n    },\n\n    components: { PSubscriptionForm: _subscriptionForm__WEBPACK_IMPORTED_MODULE_0__.default, PModal: _modal__WEBPACK_IMPORTED_MODULE_2__.default },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionButton.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var pepr_core_composables__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pepr/core/composables */ \"./assets/core/composables/index.js\");\n/* harmony import */ var _field__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./field */ \"./assets/core/components/field.vue\");\n/* harmony import */ var _fieldRow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fieldRow */ \"./assets/core/components/fieldRow.vue\");\n/* harmony import */ var _selectRole__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./selectRole */ \"./assets/core/components/selectRole.vue\");\n\n\n\n\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        ...pepr_core_composables__WEBPACK_IMPORTED_MODULE_0__.useModel.props({entity:'subscription'}),\n        ...pepr_core_composables__WEBPACK_IMPORTED_MODULE_0__.form.props({commit:true}),\n    },\n\n    setup(props, context_) {\n        const propsRefs = (0,vue__WEBPACK_IMPORTED_MODULE_4__.toRefs)(props)\n        const contextComp = pepr_core_composables__WEBPACK_IMPORTED_MODULE_0__.useContext()\n        const modelComp = pepr_core_composables__WEBPACK_IMPORTED_MODULE_0__.useModel(propsRefs);\n        const formComp = pepr_core_composables__WEBPACK_IMPORTED_MODULE_0__.form({...propsRefs, ...modelComp}, context_)\n\n        const model = formComp.constructor\n        const {role, roles} = contextComp;\n        const accessChoices = (0,vue__WEBPACK_IMPORTED_MODULE_4__.computed)(\n            () => role.value && model.value.accessChoices(roles.value, role.value)\n        )\n        const roleChoices = (0,vue__WEBPACK_IMPORTED_MODULE_4__.computed)(\n            () => role.value && model.value.roleChoices(roles.value, role.value)\n        )\n\n        return {...formComp, ...contextComp, accessChoices, roleChoices }\n    },\n\n    components: { PField: _field__WEBPACK_IMPORTED_MODULE_1__.default, PFieldRow: _fieldRow__WEBPACK_IMPORTED_MODULE_2__.default, PSelectRole: _selectRole__WEBPACK_IMPORTED_MODULE_3__.default },\n});\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionForm.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/core/components/context.vue?vue&type=script&lang=js":
/*!********************************************************************!*\
  !*** ./assets/core/components/context.vue?vue&type=script&lang=js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_context_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_context_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./context.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/context.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/context.vue?");

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

/***/ "./assets/core/components/form.vue?vue&type=script&lang=js":
/*!*****************************************************************!*\
  !*** ./assets/core/components/form.vue?vue&type=script&lang=js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_form_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_form_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./form.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/form.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/form.vue?");

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

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/context.vue?vue&type=template&id=5fa901a8":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/context.vue?vue&type=template&id=5fa901a8 ***!
  \********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return (_ctx.context)\n    ? (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", {\n        key: 0,\n        context: _ctx.context,\n        role: _ctx.role,\n        roles: _ctx.roles,\n        subscription: _ctx.subscription\n      })\n    : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/context.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/field.vue?vue&type=template&id=d2dad89a":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/field.vue?vue&type=template&id=d2dad89a ***!
  \******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { class: {field: true} }\nconst _hoisted_2 = {\n  key: 0,\n  class: \"label\"\n}\nconst _hoisted_3 = { class: \"icon is-small is-left\" }\nconst _hoisted_4 = { class: \"icon is-small is-right\" }\nconst _hoisted_5 = {\n  key: 1,\n  class: \"help is-danger\"\n}\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_1, [\n    ($props.label)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"label\", _hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.label), 1 /* TEXT */))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", {\n      class: {control: true, hasIconsLeft: $props.leftIcons, hasIconsRight: $props.rightIcons}\n    }, [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", {\n        field: $props.name,\n        error: $setup.error\n      }),\n      ($props.leftIcons)\n        ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, { key: 0 }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($props.leftIcons, (icon) => {\n            return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_3, [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: icon }, null, 2 /* CLASS */)\n            ]))\n          }), 256 /* UNKEYED_FRAGMENT */))\n        : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n      ($props.rightIcons)\n        ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, { key: 1 }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($props.rightIcons, (icon) => {\n            return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_4, [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: icon }, null, 2 /* CLASS */)\n            ]))\n          }), 256 /* UNKEYED_FRAGMENT */))\n        : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n    ], 2 /* CLASS */),\n    ($setup.error)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_5, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($setup.error), 1 /* TEXT */))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"help\")\n  ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/field.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/fieldRow.vue?vue&type=template&id=a0756752":
/*!*********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/fieldRow.vue?vue&type=template&id=a0756752 ***!
  \*********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { class: \"field is-horizontal\" }\nconst _hoisted_2 = {\n  key: 0,\n  class: \"field-label\"\n}\nconst _hoisted_3 = { class: \"label\" }\nconst _hoisted_4 = {\n  key: 1,\n  class: \"field-label\"\n}\nconst _hoisted_5 = { class: \"field-body\" }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_1, [\n    ($props.label)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_2, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"label\", _hoisted_3, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.label), 1 /* TEXT */)\n        ]))\n      : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_4)),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_5, [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\")\n    ])\n  ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/fieldRow.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/form.vue?vue&type=template&id=05d1c81b":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/form.vue?vue&type=template&id=05d1c81b ***!
  \*****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"form\", {\n    method: $setup.method,\n    action: _ctx.action,\n    onSubmit: _cache[1] || (_cache[1] = (...args) => (_ctx.submit && _ctx.submit(...args)))\n  }, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", (0,vue__WEBPACK_IMPORTED_MODULE_0__.mergeProps)({ data: _ctx.data }, _ctx.$attrs))\n  ], 40 /* PROPS, HYDRATE_EVENTS */, [\"method\", \"action\"]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/form.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/list.vue?vue&type=template&id=39caeef5":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/list.vue?vue&type=template&id=39caeef5 ***!
  \*****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return (_ctx.list)\n    ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, { key: 0 }, [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"top\", {\n          list: _ctx.list,\n          pagination: _ctx.pagination,\n          fetch: _ctx.fetch,\n          fetchNext: _ctx.fetchNext,\n          fetchPrev: _ctx.fetchPrev\n        }),\n        ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)(_ctx.list, (item, index) => {\n          return (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"item\", {\n            index: index,\n            item: item,\n            list: _ctx.list,\n            pagination: _ctx.pagination,\n            fetch: _ctx.fetch,\n            fetchNext: _ctx.fetchNext,\n            fetchPrev: _ctx.fetchPrev\n          })\n        }), 256 /* UNKEYED_FRAGMENT */)),\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"bottom\", {\n          list: _ctx.list,\n          pagination: _ctx.pagination,\n          fetch: _ctx.fetch,\n          fetchNext: _ctx.fetchNext,\n          fetchPrev: _ctx.fetchPrev\n        })\n      ], 64 /* STABLE_FRAGMENT */))\n    : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/list.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { class: \"control has-icons-left\" }\nconst _hoisted_2 = { class: \"select\" }\nconst _hoisted_3 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", { class: \"icon is-left\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: \"mdi mdi-eye\" })\n], -1 /* HOISTED */)\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_1, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_2, [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"select\", (0,vue__WEBPACK_IMPORTED_MODULE_0__.mergeProps)(_ctx.$attrs, {\n        onChange: _cache[1] || (_cache[1] = $event => ($options.computedValue=Number($event.target.value))),\n        value: $options.computedValue\n      }), [\n        ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($setup.options, (role) => {\n          return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"option\", {\n            value: role.access,\n            selected: role.access == $options.computedValue\n          }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(role.name), 9 /* TEXT, PROPS */, [\"value\", \"selected\"]))\n        }), 256 /* UNKEYED_FRAGMENT */))\n      ], 16 /* FULL_PROPS */, [\"value\"])\n    ]),\n    _hoisted_3\n  ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/selectRole.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscription.vue?vue&type=template&id=7f3d10f4":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscription.vue?vue&type=template&id=7f3d10f4 ***!
  \*************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { key: 0 }\nconst _hoisted_2 = { key: 1 }\nconst _hoisted_3 = { class: \"icon is-large has-text-info\" }\nconst _hoisted_4 = {\n  key: 0,\n  class: \"mdi mdi-account\"\n}\nconst _hoisted_5 = {\n  key: 1,\n  class: \"mdi mdi-account-question\",\n  title: \"Awaiting for approval\"\n}\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", { item: $props.item }, () => [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", null, [\n      ($props.item.owner && $props.item.owner.title)\n        ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_1, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.item.owner.title), 1 /* TEXT */))\n        : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_2, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.item.owner_id) + \" (not visible)\", 1 /* TEXT */)),\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_3, [\n        ($props.item.isSubscribed)\n          ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_4))\n          : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_5))\n      ])\n    ])\n  ])\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscription.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionButton.vue?vue&type=template&id=2344f646":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionButton.vue?vue&type=template&id=2344f646 ***!
  \*******************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { class: \"box\" }\nconst _hoisted_2 = { class: \"title is-2\" }\nconst _hoisted_3 = { key: 0 }\nconst _hoisted_4 = { key: 1 }\nconst _hoisted_5 = {\n  key: 1,\n  class: \"dropdown is-hoverable\"\n}\nconst _hoisted_6 = { class: \"dropdown-trigger\" }\nconst _hoisted_7 = { class: \"field has-addons\" }\nconst _hoisted_8 = { class: \"control\" }\nconst _hoisted_9 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", { class: \"icon\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: \"mdi mdi-account-multiple\" })\n], -1 /* HOISTED */)\nconst _hoisted_10 = { key: 0 }\nconst _hoisted_11 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", { class: \"icon\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: \"mdi mdi-account-multiple\" })\n], -1 /* HOISTED */)\nconst _hoisted_12 = { key: 0 }\nconst _hoisted_13 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", { class: \"icon\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: \"mdi mdi-account-question\" })\n], -1 /* HOISTED */)\nconst _hoisted_14 = { key: 0 }\nconst _hoisted_15 = {\n  key: 0,\n  class: \"control\"\n}\nconst _hoisted_16 = { class: \"button is-white\" }\nconst _hoisted_17 = {\n  class: \"dropdown-menu\",\n  role: \"menu\"\n}\nconst _hoisted_18 = {\n  key: 0,\n  class: \"dropdown-content\"\n}\nconst _hoisted_19 = {\n  key: 1,\n  class: \"dropdown-content\"\n}\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_p_subscription_form = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-subscription-form\")\n  const _component_p_modal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-modal\")\n\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [\n    (_ctx.context)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_p_modal, {\n          key: 0,\n          ref: \"modal\"\n        }, {\n          default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_1, [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"h2\", _hoisted_2, [\n                (_ctx.subscription)\n                  ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_3, \"Edit subscription\"))\n                  : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_4, \"Subscribe to \" + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(_ctx.context && _ctx.context.title), 1 /* TEXT */))\n              ]),\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_subscription_form, {\n                onDone: _cache[1] || (_cache[1] = $event => (_ctx.$refs.modal.hide())),\n                initial: _ctx.subscription\n              }, null, 8 /* PROPS */, [\"initial\"])\n            ])\n          ]),\n          _: 1 /* STABLE */\n        }, 512 /* NEED_PATCH */))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n    (_ctx.roles)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_5, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_6, [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_7, [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_8, [\n                (!_ctx.subscription)\n                  ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"button\", {\n                      key: 0,\n                      class: ['button is-link', $props.isSmall && 'is-small'],\n                      onClick: _cache[2] || (_cache[2] = (...args) => ($options.subscribe && $options.subscribe(...args))),\n                      title: `Subscribe as ${_ctx.roles[_ctx.context.subscription_default_role].name}`\n                    }, [\n                      _hoisted_9,\n                      (!$props.noText)\n                        ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_10, \"Subscribe\"))\n                        : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n                    ], 10 /* CLASS, PROPS */, [\"title\"]))\n                  : (_ctx.subscription.isSubscribed)\n                    ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"button\", {\n                        key: 1,\n                        class: ['button is-info', $props.isSmall && 'is-small'],\n                        onClick: _cache[3] || (_cache[3] = (...args) => ($options.edit && $options.edit(...args)))\n                      }, [\n                        _hoisted_11,\n                        (!$props.noText)\n                          ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_12, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(_ctx.roles[_ctx.context.role.access].name), 1 /* TEXT */))\n                          : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n                      ], 2 /* CLASS */))\n                    : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"button\", {\n                        key: 2,\n                        class: ['button is-info', $props.isSmall && 'is-small'],\n                        onClick: _cache[4] || (_cache[4] = (...args) => ($options.edit && $options.edit(...args)))\n                      }, [\n                        _hoisted_13,\n                        (!$props.noText)\n                          ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_14, \"Request sent\"))\n                          : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n                      ], 2 /* CLASS */))\n              ]),\n              (!$props.noText)\n                ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_15, [\n                    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"button\", _hoisted_16, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(_ctx.context.n_subscriptions), 1 /* TEXT */)\n                  ]))\n                : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n            ])\n          ]),\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_17, [\n            (!_ctx.subscription)\n              ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_18, [\n                  (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"a\", {\n                    class: \"dropdown-item\",\n                    onClick: _cache[5] || (_cache[5] = (...args) => ($options.edit && $options.edit(...args)))\n                  }, \"Subscribe...\")\n                ]))\n              : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_19, [\n                  (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"a\", {\n                    class: \"dropdown-item\",\n                    onClick: _cache[6] || (_cache[6] = (...args) => ($options.unsubscribe && $options.unsubscribe(...args)))\n                  }, \"Unsubscribe\")\n                ]))\n          ])\n        ]))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n  ], 64 /* STABLE_FRAGMENT */))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionButton.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionForm.vue?vue&type=template&id=64461c50":
/*!*****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionForm.vue?vue&type=template&id=64461c50 ***!
  \*****************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = {\n  key: 1,\n  class: \"notification is-info\"\n}\nconst _hoisted_2 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", null, \" Your subscription request is awaiting for approval (you still can update it). \", -1 /* HOISTED */)\nconst _hoisted_3 = {\n  key: 0,\n  class: \"help is-info\"\n}\nconst _hoisted_4 = { class: \"field is-grouped is-grouped-right\" }\nconst _hoisted_5 = { class: \"control\" }\nconst _hoisted_6 = { class: \"button is-link\" }\nconst _hoisted_7 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(\"Save\")\nconst _hoisted_8 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(\"Subscribe\")\nconst _hoisted_9 = { class: \"control\" }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_p_select_role = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-select-role\")\n  const _component_p_field = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-field\")\n  const _component_p_field_row = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-field-row\")\n\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"form\", {\n    ref: \"form\",\n    onSubmit: _cache[4] || (_cache[4] = (...args) => (_ctx.submit && _ctx.submit(...args))),\n    onReset: _cache[5] || (_cache[5] = (...args) => (_ctx.reset && _ctx.reset(...args)))\n  }, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"input\", {\n      type: \"hidden\",\n      name: \"context_id\",\n      value: _ctx.context && _ctx.context.pk\n    }, null, 8 /* PROPS */, [\"value\"]),\n    (_ctx.data.owner_id)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"input\", {\n          key: 0,\n          type: \"hidden\",\n          name: \"owner_id\",\n          value: _ctx.data.owner_id\n        }, null, 8 /* PROPS */, [\"value\"]))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n    (_ctx.data.isRequest)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_1, [\n          _hoisted_2\n        ]))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_field_row, { label: \"Role\" }, {\n      default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_field, { name: \"role\" }, {\n          help: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n            (_ctx.data.role > _ctx.context.subscription_accept_role)\n              ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_3, \" This role requires approval from moderation \"))\n              : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n          ]),\n          default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_select_role, {\n              name: \"role\",\n              value: _ctx.data.role,\n              \"onUpdate:value\": _cache[1] || (_cache[1] = $event => (_ctx.data.role = $event)),\n              roles: $setup.roleChoices,\n              title: \"Role\"\n            }, null, 8 /* PROPS */, [\"value\", \"roles\"])\n          ]),\n          _: 1 /* STABLE */\n        })\n      ]),\n      _: 1 /* STABLE */\n    }),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_field_row, { label: \"Visibility\" }, {\n      default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_field, { name: \"access\" }, {\n          default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_select_role, {\n              name: \"access\",\n              value: _ctx.data.access,\n              \"onUpdate:value\": _cache[2] || (_cache[2] = $event => (_ctx.data.access = $event)),\n              roles: $setup.accessChoices,\n              title: \"People being able to see you are subscribed.\"\n            }, null, 8 /* PROPS */, [\"value\", \"roles\"])\n          ]),\n          _: 1 /* STABLE */\n        })\n      ]),\n      _: 1 /* STABLE */\n    }),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_4, [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"p\", _hoisted_5, [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"button\", _hoisted_6, [\n          (_ctx.data)\n            ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, { key: 0 }, [\n                _hoisted_7\n              ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))\n            : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, { key: 1 }, [\n                _hoisted_8\n              ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */))\n        ])\n      ]),\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"p\", _hoisted_9, [\n        (_ctx.data)\n          ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"button\", {\n              key: 0,\n              type: \"button\",\n              onClick: _cache[3] || (_cache[3] = $event => (_ctx.reset() || _ctx.$emit('done'))),\n              class: \"button is-link is-light\"\n            }, \" Cancel\"))\n          : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n      ])\n    ])\n  ], 544 /* HYDRATE_EVENTS, NEED_PATCH */))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionForm.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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
/******/ 					result = fn();
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
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) var result = runtime(__webpack_require__);
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