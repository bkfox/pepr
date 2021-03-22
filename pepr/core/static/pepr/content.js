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

/***/ "./assets/content/components/index.js":
/*!********************************************!*\
  !*** ./assets/content/components/index.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   \"PContentForm\": () => (/* reexport safe */ _contentForm__WEBPACK_IMPORTED_MODULE_1__.default),\n/* harmony export */   \"PContentList\": () => (/* reexport safe */ _contentList__WEBPACK_IMPORTED_MODULE_2__.default)\n/* harmony export */ });\n/* harmony import */ var _content__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./content */ \"./assets/content/components/content.vue\");\n/* harmony import */ var _contentForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contentForm */ \"./assets/content/components/contentForm.vue\");\n/* harmony import */ var _contentList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./contentList */ \"./assets/content/components/contentList.vue\");\n\n\n\n\nconst defaults = { PContentForm: _contentForm__WEBPACK_IMPORTED_MODULE_1__.default, PContentList: _contentList__WEBPACK_IMPORTED_MODULE_2__.default }\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defaults);\n\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/index.js?");

/***/ }),

/***/ "./assets/content/index.js":
/*!*********************************!*\
  !*** ./assets/content/index.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var pepr_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pepr/core */ \"./assets/core/index.js\");\n/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components */ \"./assets/content/components/index.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./models */ \"./assets/content/models.js\");\n\n\n\n\n\n\n\nconst config = {\n    extends: pepr_core__WEBPACK_IMPORTED_MODULE_0__.App,\n    components: {..._components__WEBPACK_IMPORTED_MODULE_1__.default, ...pepr_core__WEBPACK_IMPORTED_MODULE_0__.components},\n}\n\nvar app = null;\n\n(0,pepr_core__WEBPACK_IMPORTED_MODULE_0__.loadConfig)('#app-config').then(props => {\n    let store = props.store\n    delete props.store\n\n    app = (0,vue__WEBPACK_IMPORTED_MODULE_3__.createApp)(config, props)\n    app.use(pepr_core__WEBPACK_IMPORTED_MODULE_0__.ormPlugin, {baseURL: '/api', models: {..._models__WEBPACK_IMPORTED_MODULE_2__.default, ...pepr_core__WEBPACK_IMPORTED_MODULE_0__.models}})\n    let vm = app.mount(\"#app\");\n    store && (0,pepr_core__WEBPACK_IMPORTED_MODULE_0__.loadStore)(vm.$store, store)\n})\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (app);\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/index.js?");

/***/ }),

/***/ "./assets/content/models.js":
/*!**********************************!*\
  !*** ./assets/content/models.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Content\": () => (/* binding */ Content),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var pepr_core_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pepr/core/models */ \"./assets/core/models.js\");\n\n\n\nclass Content extends pepr_core_models__WEBPACK_IMPORTED_MODULE_0__.Owned {\n    static get entity() { return 'content' }\n    static get baseURL() { return '/pepr/content/content/' }\n\n    static fields() {\n        return { ...super.fields(),\n            text: this.string(''),\n            html: this.string(''),\n            created: this.attr(null),\n            modified: this.attr(null),\n            modifier: this.attr(null),\n            meta: this.attr(null),\n        }\n    }\n\n    get createdDate() {\n        return this.created && new Date(this.created)\n    }\n\n    get modifiedDate() {\n        return this.modified && new Date(this.modified)\n    }\n}\n\n\nconst defaults = { Content }\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defaults);\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/models.js?");

/***/ }),

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   \"loadConfig\": () => (/* binding */ loadConfig),\n/* harmony export */   \"mount\": () => (/* binding */ mount)\n/* harmony export */ });\n/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components */ \"./assets/core/components/index.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models */ \"./assets/core/models.js\");\n\n\n\n\n\n\n\n\n\n\n/// Base Pepr's Vue applications\nconst App = {\n    delimiters: ['[[', ']]'],\n    components: _components__WEBPACK_IMPORTED_MODULE_0__.default,\n\n    provide() {\n        return {\n            baseURL: this.baseURL,\n            roles: this.roles,\n            context: this.context,\n        }\n    },\n\n    props: {\n        roles: Object,\n        // FIXME: should be updatable -> setup?\n        contextId: String,\n        baseUrl: String,\n        /// User's identity's pk if any\n        identity: String,\n    },\n\n    computed: {\n        /// Current Context\n        context() {\n            let model = this.$store.$db().model('context')\n            return this.contextId && model.query().with('subscription').find(this.contextId)\n        },\n\n        /// User's subscription\n        subscription() {\n            return this.identity &&\n                this.$root.Subscription.query().where('owner_id', this.identity)\n                    .first()\n        }\n    },\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);\n\n\n/**\n * Load application config from json script element (using querySelector).\n * Return a promise resolving to the config object.\n *\n * If `async` is true, resolve on document `load` event.\n */\nfunction loadConfig(el, {async=true}={}) {\n    return new Promise((resolve, reject) => {\n        let func = () => {\n            try {\n                let elm = document.querySelector(el)\n                if(elm.text) {\n                    const data = JSON.parse(elm.text)\n                    if(data)\n                        resolve(data)\n                }\n                reject(null)\n            } catch(error) {\n                reject(error)\n            }\n        }\n        async ? window.addEventListener('load', func, { once: true }) : func()\n    })\n}\n\n\n/// Mount Vue application (if async, mount when document is loaded).\n/// Returns a Promise resolving to vm.\nfunction mount(app, el, {async=true,content=null,title=null}={}) {\n    return new Promise((resolve, reject) => {\n        let func = () => {\n            try {\n                let elm = document.querySelector(el)\n                if(!elm)\n                    return reject(`Error: can't get element ${el}`)\n\n                // update content\n                if(content)\n                    elm.innerHTML = content\n\n                // update title\n                if(title)\n                    document.title = title\n\n                window.scroll(0, 0)\n\n                let vm = app.mount(el)\n                resolve(vm)\n            } catch(error) {\n                reject(error)\n            }\n        }\n        async ? window.addEventListener('load', func, { once: true }) : func()\n    })\n}\n\n/**\n    /// Fetch application from server and load.\n    /// TODO/FIXME: handling new application config and models etc.\n    fetch(url, {el='app', ...options}={}) {\n        return fetch(url, options).then(response => response.text())\n            .then(content => {\n                let doc = new DOMParser().parseFromString(content, 'text/html')\n                let app = doc.getElementById('app')\n                content = app ? app.innerHTML : content\n                return this.load({sync: true, content, title: doc.title, url })\n            })\n    }\n\n    /// Save application state into browser history\n    historySave(url,replace=false) {\n        const el = document.querySelector(this.config.el)\n        const state = {\n            // TODO: el: this.config.el,\n            content: el.innerHTML,\n            title: document.title,\n        }\n\n        if(replace)\n            history.replaceState(state, '', url)\n        else\n            history.pushState(state, '', url)\n    }\n\n    /// Load application from browser history's state\n    historyLoad(state) {\n        return this.load({ content: state.content, title: state.title })\n    }\n*/\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/app.js?");

/***/ }),

/***/ "./assets/core/components/index.js":
/*!*****************************************!*\
  !*** ./assets/core/components/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   \"PList\": () => (/* reexport safe */ _list__WEBPACK_IMPORTED_MODULE_0__.default),\n/* harmony export */   \"PModal\": () => (/* reexport safe */ _modal__WEBPACK_IMPORTED_MODULE_1__.default),\n/* harmony export */   \"PRuntimeTemplate\": () => (/* reexport safe */ _runtimeTemplate__WEBPACK_IMPORTED_MODULE_2__.default),\n/* harmony export */   \"PSelectRole\": () => (/* reexport safe */ _selectRole__WEBPACK_IMPORTED_MODULE_3__.default),\n/* harmony export */   \"PSubscriptionButton\": () => (/* reexport safe */ _subscriptionButton__WEBPACK_IMPORTED_MODULE_4__.default)\n/* harmony export */ });\n/* harmony import */ var _list__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./list */ \"./assets/core/components/list.vue\");\n/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modal */ \"./assets/core/components/modal.vue\");\n/* harmony import */ var _runtimeTemplate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./runtimeTemplate */ \"./assets/core/components/runtimeTemplate.js\");\n/* harmony import */ var _selectRole__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./selectRole */ \"./assets/core/components/selectRole.vue\");\n/* harmony import */ var _subscriptionButton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./subscriptionButton */ \"./assets/core/components/subscriptionButton.vue\");\n/* harmony import */ var _subscriptionForm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./subscriptionForm */ \"./assets/core/components/subscriptionForm.vue\");\n\n\n\n\n\n\n\nconst defaults = {\n    PList: _list__WEBPACK_IMPORTED_MODULE_0__.default, PModal: _modal__WEBPACK_IMPORTED_MODULE_1__.default, PRuntimeTemplate: _runtimeTemplate__WEBPACK_IMPORTED_MODULE_2__.default, PSelectRole: _selectRole__WEBPACK_IMPORTED_MODULE_3__.default, PSubscriptionButton: _subscriptionButton__WEBPACK_IMPORTED_MODULE_4__.default,\n    PSubscriptionForm: _subscriptionForm__WEBPACK_IMPORTED_MODULE_5__.default,\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defaults);\n\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/index.js?");

/***/ }),

/***/ "./assets/core/components/runtimeTemplate.js":
/*!***************************************************!*\
  !*** ./assets/core/components/runtimeTemplate.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/**\n * This code originally comes from v-runtime-template by Alex Jovern. It includes\n * PR#33 and is adapted to Vue 3.\n * The following code is under MIT license (Copyright (c) 2018 Alex Jover).\n */\n\n\nconst defineDescriptor = (src, dest, name) => {\n  if (!dest.hasOwnProperty(name)) {\n    const descriptor = Object.getOwnPropertyDescriptor(src, name);\n    Object.defineProperty(dest, name, descriptor);\n  }\n};\n\nconst merge = objs => {\n  const res = {};\n  objs.forEach(obj => {\n    obj &&\n      Object.getOwnPropertyNames(obj).forEach(name =>\n        defineDescriptor(obj, res, name)\n      );\n  });\n  return res;\n};\n\nconst buildFromProps = (obj, props) => {\n  const res = {};\n  props.forEach(prop => defineDescriptor(obj, res, prop));\n  return res;\n};\n\nconst buildPassthrough = (self, source, target, attr) => {\n    [self, source] = [self[attr], source[attr] || {}];\n    let dest = target[attr] || {};\n    for(var key of Object.keys(source))\n        if(self === undefined || self[key] === undefined)\n            dest[key] = source[key];\n    target[attr] = dest;\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  props: {\n    template: String\n  },\n  render() {\n    if (this.template) {\n      let passthrough = {};\n      buildPassthrough(self, this.$parent, passthrough, '$data');\n      buildPassthrough(self, this.$parent, passthrough, '$props');\n      buildPassthrough(self, this.$parent.$options, passthrough, 'components');\n      buildPassthrough(self, this.$parent.$options, passthrough, 'computed');\n      buildPassthrough(self, this.$parent.$options, passthrough, 'methods');\n\n      const methodKeys = Object.keys(passthrough.methods);\n      const dataKeys = Object.keys(passthrough.$data);\n      const propKeys = Object.keys(passthrough.$props);\n      const allKeys = dataKeys.concat(propKeys).concat(methodKeys);\n      const methodsFromProps = buildFromProps(this.$parent, methodKeys);\n      const props = merge([passthrough.$data, passthrough.$props, methodsFromProps]);\n\n      const dynamic = {\n        template: this.template || \"<div></div>\",\n        props: allKeys,\n        computed: passthrough.computed,\n        components: passthrough.components\n      };\n\n      return (0,vue__WEBPACK_IMPORTED_MODULE_0__.h)(dynamic, {\n        props\n      });\n    }\n  }\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/runtimeTemplate.js?");

/***/ }),

/***/ "./assets/core/composables/form.js":
/*!*****************************************!*\
  !*** ./assets/core/composables/form.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"modelForm\": () => (/* binding */ modelForm)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\n\n\n\n/**\n * Model form\n * @fires ModelForm#done\n * @fires ModelForm#error\n *\n */\nfunction modelForm(defaultItem, props, { emit }) {\n    const initial = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => props.initial || defaultItem.value)\n    const itemModel = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => initial.constructor)\n    const item = (0,vue__WEBPACK_IMPORTED_MODULE_0__.reactive)(new itemModel.value())\n\n    const method = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => initial.value.$id ? 'PUT' : 'POST')\n    const url = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => initial.value.$url)\n    const context = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => initial.value.context)\n    const role = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => context.value.role)\n\n    function reset(value=null, form=null) {\n        for(var k in item) delete item[k]\n        Object.assign(item, value || initial.value)\n    }\n\n    reset()\n    ;(0,vue__WEBPACK_IMPORTED_MODULE_0__.watch)(initial, reset, {deep: true})\n\n    function submit(ev, form=null) {\n        if(ev) {\n            ev.preventDefault()\n            ev.stopPropagation()\n        }\n\n        form = form || ev.target\n        return initial.value.save({form}).then(\n            r => {\n                reset()\n                form && form.reset()\n                emit('done', r);\n                return r\n            },\n            r => emit('error', r)\n        )\n    }\n\n    return {\n        initial, item, context, role, method, url, reset, submit,\n        model: itemModel,\n    }\n}\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/composables/form.js?");

/***/ }),

/***/ "./assets/core/composables/index.js":
/*!******************************************!*\
  !*** ./assets/core/composables/index.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"modelForm\": () => (/* reexport safe */ _form__WEBPACK_IMPORTED_MODULE_0__.modelForm)\n/* harmony export */ });\n/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form */ \"./assets/core/composables/form.js\");\n\n\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/composables/index.js?");

/***/ }),

/***/ "./assets/core/index.js":
/*!******************************!*\
  !*** ./assets/core/index.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Action\": () => (/* reexport safe */ _action__WEBPACK_IMPORTED_MODULE_1__.default),\n/* harmony export */   \"App\": () => (/* reexport safe */ _app__WEBPACK_IMPORTED_MODULE_2__.default),\n/* harmony export */   \"loadConfig\": () => (/* reexport safe */ _app__WEBPACK_IMPORTED_MODULE_2__.loadConfig),\n/* harmony export */   \"mount\": () => (/* reexport safe */ _app__WEBPACK_IMPORTED_MODULE_2__.mount),\n/* harmony export */   \"components\": () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_3__.default),\n/* harmony export */   \"models\": () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_4__.default),\n/* harmony export */   \"loadStore\": () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_4__.loadStore),\n/* harmony export */   \"Role\": () => (/* reexport safe */ _models__WEBPACK_IMPORTED_MODULE_4__.Role),\n/* harmony export */   \"ormPlugin\": () => (/* reexport safe */ _plugins__WEBPACK_IMPORTED_MODULE_5__.ormPlugin)\n/* harmony export */ });\n/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.scss */ \"./assets/core/styles.scss\");\n/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./action */ \"./assets/core/action.js\");\n/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app */ \"./assets/core/app.js\");\n/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components */ \"./assets/core/components/index.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./models */ \"./assets/core/models.js\");\n/* harmony import */ var _plugins__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./plugins */ \"./assets/core/plugins.js\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/index.js?");

/***/ }),

/***/ "./assets/core/models.js":
/*!*******************************!*\
  !*** ./assets/core/models.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"loadStore\": () => (/* binding */ loadStore),\n/* harmony export */   \"Base\": () => (/* binding */ Base),\n/* harmony export */   \"Role\": () => (/* binding */ Role),\n/* harmony export */   \"Context\": () => (/* binding */ Context),\n/* harmony export */   \"Accessible\": () => (/* binding */ Accessible),\n/* harmony export */   \"Owned\": () => (/* binding */ Owned),\n/* harmony export */   \"Subscription\": () => (/* binding */ Subscription),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! js-cookie */ \"./node_modules/js-cookie/src/js.cookie.js\");\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(js_cookie__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _vuex_orm_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vuex-orm/core */ \"./node_modules/@vuex-orm/core/dist/vuex-orm.esm.js\");\n\n\n\n\n\n\n/**\n * Load models from data, as an Object of `{ entity: insertOrUpdateData }`\n */\nfunction loadStore(store, data) {\n    let db = store.$db();\n    for(var entity in data) {\n        let model = db.model(entity)\n        model ? model.insertOrUpdate({ data: data[entity] })\n              : console.warn(`model ${entity} is not a registered model`)\n    }\n}\n\n\n/**\n * Base model class\n */\nclass Base extends _vuex_orm_core__WEBPACK_IMPORTED_MODULE_0__.Model {\n    /**\n     * Default model's api entry point\n     */\n    static get baseURL() { return '' }\n\n    static get primaryKey() { return 'pk' }\n    static get apiConfig() {\n        return {\n            headers: { 'X-CSRFToken': js_cookie__WEBPACK_IMPORTED_MODULE_1___default().get('csrftoken') },\n            delete: true,\n        }\n    }\n\n    static fields() {\n        return {\n            pk: this.string(null),\n            access: this.number(null),\n        }\n    }\n\n    /**\n     * Item's url (PUT or POST url)\n     */\n    get $url() {\n        return this.$id ? `${this.constructor.baseURL}${this.$id}/`\n                        :  this.constructor.baseURL;\n    }\n\n    /**\n     * Return other model using the same database a this.\n     */\n    $model(model) {\n        model = model.prototype instanceof _vuex_orm_core__WEBPACK_IMPORTED_MODULE_0__.Model ? model.entity : model\n        return this.$store().$db().model(model)\n    }\n\n    /// Reload item from the server\n    fetch(config) {\n        if(!this.$id)\n            throw \"item is not on server\"\n        return this.$id && this.constructor.api().get(this.$url, config)\n            .then(r => {\n                this.constructor.insertOrUpdate({data: r.response.data})\n                return r\n            })\n    }\n\n    /// Save item to server and return promise\n    save({form=null, ...config}= {}) {\n        config.headers = {...(config.headers || {}),\n            'Content-Type': 'multipart/form-data',\n            'X-CSRFToken': js_cookie__WEBPACK_IMPORTED_MODULE_1___default().get('csrftoken'),\n        }\n        const data = form ? new FormData(form) : new FormData()\n        if(!form)\n            Object.keys(this).forEach(key => data.append(this[key]))\n\n        if(this.$url)\n            return (this.$id ? this.constructor.api().put(this.$url, data, config)\n                            : this.constructor.api().post(this.$url, data, config))\n                .then(r => {\n                    this.constructor.insertOrUpdate({data: r.response.data})\n                    return r\n                })\n        else\n            throw \"no api url for item\"\n    }\n\n    /// Delete item from server and return promise\n    delete(config) {\n        if(this.$url)\n            return this.constructor.api().delete(this.$url, config).then(r => {\n                this.constructor.delete(this.$id)\n                return r\n            })\n        else\n            throw \"no api url for item\"\n    }\n}\n\n\nclass Role {\n    /* static fields() {\n        return {\n            context_id: this.string(null),\n            subscription_id: this.string(null),\n            identity_id: this.string(null),\n            access: this.number(null),\n            is_anonymous: this.boolean(false),\n            is_subscribed: this.boolean(false),\n            is_moderator: this.boolean(false),\n            is_admin: this.boolean(false),\n            permissions: this.attr(null)\n       }\n    } */\n\n    constructor(data=null) {\n        data && Object.assign(this, data)\n    }\n\n    isGranted(permissions, item) {\n        if(!this.permissions)\n            return false\n        if(item instanceof Owned && this.identity == item.owner)\n            return true\n\n        for(var name of permissions)\n            if(!this.permissions[name])\n                return false\n        return true\n    }\n}\n\n\nclass Context extends Base {\n    static get entity() { return 'context' }\n    static get baseURL() { return '/pepr/core/context/' }\n\n\n    static fields() {\n        return { ...super.fields(),\n            title: this.string(''),\n            default_access: this.number(null),\n            allow_subscription_request: this.attr(null),\n            subscription_accept_role: this.number(null),\n            subscription_default_access: this.number(null),\n            subscription_default_role: this.number(null),\n            // subsciption: this.attr(null),\n            subsciptions: this.hasMany(Subscription, 'context'),\n            role: this.attr(null, value => new Role(value))\n        }\n    }\n\n    /// Return user's identity\n    get identity() {\n        let id = this.role && this.role.identity_id\n        return id && this.$model('context').find(id)\n    }\n\n    /// Return user's subscription\n    get subscription() {\n        let id = this.role && this.role.identity_id\n        return id && this.$model('subscription').query()\n            .where({ context_id: this.$id, owner_id: id }).first()\n    }\n}\n\n\n\nclass Accessible extends Base {\n    static get entity() { return 'accessible' }\n    static get contextModel() { return Context }\n\n    static fields() {\n        return { ...super.fields(),\n            context_id: this.attr(null),\n            // context: this.belongsTo(Context, 'context_id'),\n        }\n    }\n\n    get context() {\n        return this.context_id && this.constructor.contextModel.find(this.context_id)\n    }\n\n    granted(permissions) {\n        let role_perms = this.context.role.permissions\n        if(!Array.isArray(perms))\n            return !!role_perms[permissions]\n\n        for(var permission of permissions)\n            if(!role_perms[permission])\n                return false\n        return true\n    }\n}\n\nclass Owned extends Accessible {\n    static get entity() { return 'owned' }\n\n    static fields() {\n        return { ...super.fields(),\n            owner_id: this.attr(null),\n        //    owner: this.belongsTo(Context, 'owner_id'),\n        }\n    }\n\n    get owner() {\n        return Context.find(this.owner_id)\n    }\n}\n\nclass Subscription extends Owned {\n    static get entity() { return 'subscription' }\n    static get baseURL() { return '/pepr/core/subscription/' }\n\n    static fields() {\n        return { ...super.fields(),\n            status: this.number(),\n            access: this.number(),\n            role: this.number(),\n        }\n    }\n\n    save(config) {\n        return super.save(config).then(\n            r => {\n                this.context && this.context.fetch()\n                return r\n            }\n        )\n    }\n\n    delete(config) {\n        const context = this.context\n        return super.delete(config).then(\n            r => {\n                context && context.fetch()\n                return r\n            },\n        )\n    }\n\n\n    get isInvite() { return this.status == Subscription.INVITE }\n    get isRequest() { return this.status == Subscription.REQUEST }\n    get isSubscribed() { return this.status == Subscription.SUBSCRIBED }\n}\nSubscription.INVITE = 1\nSubscription.REQUEST = 2\nSubscription.SUBSCRIBED = 3\n\n\nconst defaults = { Context, Subscription }\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defaults);\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/models.js?");

/***/ }),

/***/ "./assets/core/plugins.js":
/*!********************************!*\
  !*** ./assets/core/plugins.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ormPlugin\": () => (/* binding */ ormPlugin)\n/* harmony export */ });\n/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vuex */ \"./node_modules/vuex/dist/vuex.esm-bundler.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ \"./node_modules/axios/lib/axios.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _vuex_orm_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vuex-orm/core */ \"./node_modules/@vuex-orm/core/dist/vuex-orm.esm.js\");\n/* harmony import */ var _vuex_orm_plugin_axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vuex-orm/plugin-axios */ \"./node_modules/@vuex-orm/plugin-axios/dist/vuex-orm-axios.esm-browser.js\");\n\n\n\n\n\n\n\n/**\n * Create Vuex database using provided models, and use created store for app.\n */\nconst ormPlugin = {\n    install(app, {models={}, baseURL='', storeConfig={}}={}) {\n        _vuex_orm_core__WEBPACK_IMPORTED_MODULE_0__.default.use(_vuex_orm_plugin_axios__WEBPACK_IMPORTED_MODULE_1__.default, { axios: (axios__WEBPACK_IMPORTED_MODULE_2___default()), baseURL })\n\n        // store\n        const database = new _vuex_orm_core__WEBPACK_IMPORTED_MODULE_0__.default.Database()\n        for(let key in models)\n            database.register(models[key])\n\n        storeConfig.plugins = [ ...(storeConfig.plugins || []), _vuex_orm_core__WEBPACK_IMPORTED_MODULE_0__.default.install(database) ]\n        app.use((0,vuex__WEBPACK_IMPORTED_MODULE_3__.createStore)(storeConfig))\n\n        // getters\n        const target = app.config.globalProperties;\n        for(let key in models) {\n            let model = models[key]\n            if(!target[model.name])\n                target[model.name] = target.$store.$db().model(model.entity)\n        }\n    }\n}\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/plugins.js?");

/***/ }),

/***/ "./assets/core/styles.scss":
/*!*********************************!*\
  !*** ./assets/core/styles.scss ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/styles.scss?");

/***/ }),

/***/ "./assets/content/components/content.vue":
/*!***********************************************!*\
  !*** ./assets/content/components/content.vue ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"actions\": () => (/* reexport safe */ _content_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.actions),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _content_vue_vue_type_template_id_76205d44__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./content.vue?vue&type=template&id=76205d44 */ \"./assets/content/components/content.vue?vue&type=template&id=76205d44\");\n/* harmony import */ var _content_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./content.vue?vue&type=script&lang=js */ \"./assets/content/components/content.vue?vue&type=script&lang=js\");\n\n\n\n_content_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.render = _content_vue_vue_type_template_id_76205d44__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_content_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.__file = \"assets/content/components/content.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_content_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default);\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/content.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/content.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/content.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"actions\": () => (/* binding */ actions),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var pepr_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pepr/core */ \"./assets/core/index.js\");\n/* harmony import */ var _contentForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contentForm */ \"./assets/content/components/contentForm.vue\");\n\n\n\n\nconst actions = [\n    new pepr_core__WEBPACK_IMPORTED_MODULE_0__.Action('Edit', ['update'], (item, comp) => {\n        comp.edit = true\n    }),\n    new pepr_core__WEBPACK_IMPORTED_MODULE_0__.Action('Delete', ['destroy'], (item, comp) => {\n        if(confirm('Delete?'))\n            item.delete({ delete: 1})\n    }),\n]\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        item: Object,\n    },\n\n    data() {\n        return {\n            /// If true, show edit form\n            edit: false,\n            // TODO: as prop or optional injection?\n            actions,\n        }\n    },\n\n    computed: {\n        allowedActions() {\n            if(!this.item.context)\n                return []\n\n            let role = this.item.context.role\n            return this.actions.filter(action => action.isGranted(role, this.item))\n        },\n\n        createdString() {\n            let date = this.item.createdDate;\n            return date ? date.toLocaleDateString() + ' ' + date.toLocaleTimeString()\n                        : '';\n        },\n\n        modifiedString() {\n            let date = this.item.modifiedDate;\n            return date ? date.toLocaleDateString() + ' ' + date.toLocaleTimeString()\n                        : '';\n        },\n    },\n\n    methods: {\n        triggerAction(action, ...args) {\n            action.trigger(this.item, this, ...args)\n        },\n    },\n\n    components: { PContentForm: _contentForm__WEBPACK_IMPORTED_MODULE_1__.default },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/content.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/content/components/contentForm.vue":
/*!***************************************************!*\
  !*** ./assets/content/components/contentForm.vue ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _contentForm_vue_vue_type_template_id_62bcd3b0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./contentForm.vue?vue&type=template&id=62bcd3b0 */ \"./assets/content/components/contentForm.vue?vue&type=template&id=62bcd3b0\");\n/* harmony import */ var _contentForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contentForm.vue?vue&type=script&lang=js */ \"./assets/content/components/contentForm.vue?vue&type=script&lang=js\");\n\n\n\n_contentForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.render = _contentForm_vue_vue_type_template_id_62bcd3b0__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_contentForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.__file = \"assets/content/components/contentForm.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_contentForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default);\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentForm.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentForm.vue?vue&type=script&lang=js":
/*!***********************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentForm.vue?vue&type=script&lang=js ***!
  \***********************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vuex */ \"./node_modules/vuex/dist/vuex.esm-bundler.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models */ \"./assets/content/models.js\");\n/* harmony import */ var pepr_core_composables__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pepr/core/composables */ \"./assets/core/composables/index.js\");\n/* harmony import */ var pepr_core_components_selectRole__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pepr/core/components/selectRole */ \"./assets/core/components/selectRole.vue\");\n\n\n\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    inject: ['roles'],\n    props: {\n        /// Show access field\n        showAccess: { type: Boolean, default: true },\n        context: { type: Object, required: true },\n        initial: Object,\n    },\n\n    setup(props, context) {\n        const model = (0,vuex__WEBPACK_IMPORTED_MODULE_3__.useStore)().$db().model('content')\n        const item = (0,vue__WEBPACK_IMPORTED_MODULE_4__.computed)(() => new model({\n            context_id: props.context && props.context.pk,\n            access: props.context && Math.min(props.context.default_access,\n                                              props.context.role.access),\n        }))\n        return (0,pepr_core_composables__WEBPACK_IMPORTED_MODULE_1__.modelForm)(item, props, context)\n    },\n\n    methods: {\n        accessFilter(role) {\n            return this.context && role.access <= this.role.access\n        },\n    },\n\n    components: { PSelectRole: pepr_core_components_selectRole__WEBPACK_IMPORTED_MODULE_2__.default },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentForm.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/content/components/contentList.vue":
/*!***************************************************!*\
  !*** ./assets/content/components/contentList.vue ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _contentList_vue_vue_type_template_id_029abd02__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./contentList.vue?vue&type=template&id=029abd02 */ \"./assets/content/components/contentList.vue?vue&type=template&id=029abd02\");\n/* harmony import */ var _contentList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contentList.vue?vue&type=script&lang=js */ \"./assets/content/components/contentList.vue?vue&type=script&lang=js\");\n\n\n\n_contentList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.render = _contentList_vue_vue_type_template_id_029abd02__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_contentList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.__file = \"assets/content/components/contentList.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_contentList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default);\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentList.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentList.vue?vue&type=script&lang=js":
/*!***********************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentList.vue?vue&type=script&lang=js ***!
  \***********************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var pepr_core_action__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pepr/core/action */ \"./assets/core/action.js\");\n/* harmony import */ var pepr_core_components_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pepr/core/components/list */ \"./assets/core/components/list.vue\");\n/* harmony import */ var _content__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./content */ \"./assets/content/components/content.vue\");\n\n\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    extends: pepr_core_components_list__WEBPACK_IMPORTED_MODULE_1__.default,\n\n    components: { PContent: _content__WEBPACK_IMPORTED_MODULE_2__.default },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentList.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        model: Function,\n        // FIXME: db query filters\n        filters: Object,\n        context: Object,\n        contextFilter: { type: String, default: 'context' },\n        orderBy: String,\n        url: String,\n    },\n\n    provide() {\n        return {\n            context: this.context\n        }\n    },\n\n    computed: {\n        itemsQuery() {\n            let query = this.model.query();\n            if(this.orderBy) {\n                let [order, dir] = this.orderBy.startsWith('-') ?\n                    [this.orderBy.slice(1), 'desc'] : [this.orderBy, 'asc'];\n                query = query.orderBy((obj) => obj[order], dir)\n            }\n            if(this.context)\n                query = query.where('context_id', this.context.pk)\n            return query\n        },\n\n        items() {\n            let items = this.itemsQuery.get()\n            return items\n        },\n    },\n\n    methods: {\n        /**\n         * Fetch item from list.\n         */\n        fetch(url, {context=null,filters=null, ...config}={}) {\n            if(context || filters) {\n                let params = new URLSearchParams(filters || {})\n                if(context && this.contextFilter)\n                    params.append(this.contextFilter, context.pk)\n                url = `${url}?${params.toString()}`\n            }\n            return this.model.api().get(url, { dataKey: 'results', ...config})\n                // FIXME: Vuex ORM API bug about using local store?\n                .then(r => this.model.insertOrUpdate({data: r.response.data.results}))\n        },\n\n        /**\n         * Load list using components properties as default fetch's\n         * config.\n         */\n        load({url=null, context=null, filters=null, ...config}) {\n            return this.fetch(url || this.url || this.model.baseURL, {\n                filters: filters || this.filters,\n                context: context || this.context,\n            })\n        }\n    },\n\n    watch: {\n        context(context, old) {\n            this.load({context})\n        },\n\n        filters(filters, old) {\n            this.load({filters})\n        },\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/list.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _runtimeTemplate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./runtimeTemplate */ \"./assets/core/components/runtimeTemplate.js\");\n\n/* TODO:\n    - ok, cancel button\n    - fire events\n */\n\n\n// TODO: 'loading' 'error' state & related slots\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    data() {\n        return {\n            /// Fetch request controller\n            controller: null,\n            /// Html code to show\n            html: '',\n            isActive: false,\n        }\n    },\n\n    methods: {\n        hide(reset=false) {\n            if(reset) this.html = '';\n            this.isActive = false;\n            this.controller && this.controller.abort()\n            this.controller = null;\n        },\n\n        show(reset=false) {\n            if(reset) this.html = ''\n            this.isActive = true;\n\n            const modal = this.$el;\n            if(!modal)\n                return\n\n            modal.focus({ preventScroll: top });\n            modal.scrollTop = 0;\n        },\n\n        toggle(reset=false) {\n            if(this.isActive)\n                this.hide(reset)\n            else\n                this.show(reset)\n        },\n\n        /**\n         * Fetch url and load into modal\n         */\n        load(url, config={}) {\n            if(this.controller)\n                this.controller.abort();\n            this.controller = new AbortController();\n            fetch(url, config)\n                .resolve(response => response.text())\n                .then(text => {\n                    this.html = html\n                    this.controller = null\n                    !this.html && this.hide()\n                }, err => { this.controller = null })\n        },\n    },\n\n    components: { PRuntimeTemplate: _runtimeTemplate__WEBPACK_IMPORTED_MODULE_0__.default },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/modal.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    inheritAttrs: false,\n\n    setup(props, context) {\n        const appRoles = (0,vue__WEBPACK_IMPORTED_MODULE_0__.inject)('roles')\n        const value = (0,vue__WEBPACK_IMPORTED_MODULE_0__.ref)(props.value)\n        const roles = (0,vue__WEBPACK_IMPORTED_MODULE_0__.computed)(() => {\n            let roles = Object.values(appRoles)\n            if(props.filter)\n                roles = roles.filter(props.filter)\n            return roles.sort((a,b) => a.access < b.access)\n        })\n        return { roles, value }\n    },\n\n    props: {\n        value: [Number,String],\n        filter: { type: Function, default: null },\n    },\n\n    computed: {\n        computedValue: {\n            get() {\n                return this.value\n            },\n            set(value) {\n                this.value = value;\n                this.$emit('update:value', value)\n            }\n        },\n    },\n});\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/selectRole.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _subscriptionForm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./subscriptionForm */ \"./assets/core/components/subscriptionForm.vue\");\n/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modal */ \"./assets/core/components/modal.vue\");\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    inject: ['roles'],\n    props: {\n        context: Object,\n    },\n\n    computed: {\n        role() {\n            return this.context && this.context.role\n        },\n\n        subscription() {\n            return this.context && this.context.subscription\n        },\n    },\n    methods: {\n        edit() {\n            this.$refs.modal.show()\n        },\n\n        unsubscribe() {\n            this.subscription.delete()\n        },\n    },\n\n    components: { PSubscriptionForm: _subscriptionForm__WEBPACK_IMPORTED_MODULE_0__.default, PModal: _modal__WEBPACK_IMPORTED_MODULE_1__.default },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionButton.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! vuex */ \"./node_modules/vuex/dist/vuex.esm-bundler.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models */ \"./assets/core/models.js\");\n/* harmony import */ var _composables__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../composables */ \"./assets/core/composables/index.js\");\n/* harmony import */ var _selectRole__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selectRole */ \"./assets/core/components/selectRole.vue\");\n\n\n\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: { \n        context: { type: Object, required: true },\n        initial: Object,\n    },\n\n    setup(props, context) {\n        const model = (0,vuex__WEBPACK_IMPORTED_MODULE_3__.useStore)().$db().model('subscription')\n        const item = (0,vue__WEBPACK_IMPORTED_MODULE_4__.computed)(() => new model({\n            context_id: props.context && props.context.pk,\n            access: props.context && props.context.subscription_default_access,\n            role: props.context && props.context.subscription_default_role,\n        }))\n        const form = (0,_composables__WEBPACK_IMPORTED_MODULE_1__.modelForm)(item, props, context)\n\n        function accessFilter(role) {\n            if(role.status != 'moderator' && role.status != 'admin')\n                return true\n            return form.context.value && role.access <= form.role.value.access\n        }\n\n        function roleFilter(role) {\n            return role.status != 'anonymous' && role.status != 'registered' &&\n                    accessFilter(role)\n        }\n\n        return {...form, accessFilter, roleFilter }\n    },\n\n    components: { PSelectRole: _selectRole__WEBPACK_IMPORTED_MODULE_2__.default },\n});\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionForm.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/content/components/content.vue?vue&type=script&lang=js":
/*!***********************************************************************!*\
  !*** ./assets/content/components/content.vue?vue&type=script&lang=js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_content_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default),\n/* harmony export */   \"actions\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_content_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.actions)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_content_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./content.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/content.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/content.vue?");

/***/ }),

/***/ "./assets/content/components/contentForm.vue?vue&type=script&lang=js":
/*!***************************************************************************!*\
  !*** ./assets/content/components/contentForm.vue?vue&type=script&lang=js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_contentForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_contentForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./contentForm.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentForm.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentForm.vue?");

/***/ }),

/***/ "./assets/content/components/contentList.vue?vue&type=script&lang=js":
/*!***************************************************************************!*\
  !*** ./assets/content/components/contentList.vue?vue&type=script&lang=js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_contentList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_contentList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./contentList.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentList.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentList.vue?");

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

/***/ "./assets/core/components/selectRole.vue?vue&type=script&lang=js":
/*!***********************************************************************!*\
  !*** ./assets/core/components/selectRole.vue?vue&type=script&lang=js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_selectRole_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_selectRole_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./selectRole.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/selectRole.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/selectRole.vue?");

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

/***/ "./assets/content/components/content.vue?vue&type=template&id=76205d44":
/*!*****************************************************************************!*\
  !*** ./assets/content/components/content.vue?vue&type=template&id=76205d44 ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_content_vue_vue_type_template_id_76205d44__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_content_vue_vue_type_template_id_76205d44__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./content.vue?vue&type=template&id=76205d44 */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/content.vue?vue&type=template&id=76205d44\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/content.vue?");

/***/ }),

/***/ "./assets/content/components/contentForm.vue?vue&type=template&id=62bcd3b0":
/*!*********************************************************************************!*\
  !*** ./assets/content/components/contentForm.vue?vue&type=template&id=62bcd3b0 ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_contentForm_vue_vue_type_template_id_62bcd3b0__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_contentForm_vue_vue_type_template_id_62bcd3b0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./contentForm.vue?vue&type=template&id=62bcd3b0 */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentForm.vue?vue&type=template&id=62bcd3b0\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentForm.vue?");

/***/ }),

/***/ "./assets/content/components/contentList.vue?vue&type=template&id=029abd02":
/*!*********************************************************************************!*\
  !*** ./assets/content/components/contentList.vue?vue&type=template&id=029abd02 ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_contentList_vue_vue_type_template_id_029abd02__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_contentList_vue_vue_type_template_id_029abd02__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./contentList.vue?vue&type=template&id=029abd02 */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentList.vue?vue&type=template&id=029abd02\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentList.vue?");

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

/***/ "./assets/core/components/selectRole.vue?vue&type=template&id=6f4ba4a9":
/*!*****************************************************************************!*\
  !*** ./assets/core/components/selectRole.vue?vue&type=template&id=6f4ba4a9 ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* reexport safe */ _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_selectRole_vue_vue_type_template_id_6f4ba4a9__WEBPACK_IMPORTED_MODULE_0__.render)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_1_node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_selectRole_vue_vue_type_template_id_6f4ba4a9__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./selectRole.vue?vue&type=template&id=6f4ba4a9 */ \"./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/selectRole.vue?vue&type=template&id=6f4ba4a9\");\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/selectRole.vue?");

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

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/content.vue?vue&type=template&id=76205d44":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/content.vue?vue&type=template&id=76205d44 ***!
  \***********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { class: \"media\" }\nconst _hoisted_2 = { class: \"media-content\" }\nconst _hoisted_3 = { class: \"level\" }\nconst _hoisted_4 = { class: \"level-left\" }\nconst _hoisted_5 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: \"mdi mdi-pencil-outline\" }, null, -1 /* HOISTED */)\nconst _hoisted_6 = { key: 0 }\nconst _hoisted_7 = {\n  key: 0,\n  class: \"media-right\"\n}\nconst _hoisted_8 = {\n  class: \"dropdown is-hoverable is-right\",\n  \"aria-role\": \"menu\"\n}\nconst _hoisted_9 = { class: \"dropdown-trigger\" }\nconst _hoisted_10 = {\n  class: \"button\",\n  ref: \"menu\"\n}\nconst _hoisted_11 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", { class: \"icon\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: \"mdi mdi-dots-vertical\" })\n], -1 /* HOISTED */)\nconst _hoisted_12 = {\n  class: \"dropdown-menu\",\n  role: \"menu\"\n}\nconst _hoisted_13 = { class: \"dropdown-content\" }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_p_content_form = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-content-form\")\n\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_1, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_2, [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_3, [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_4, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"strong\", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.item.owner && $props.item.owner.title || \"Anonymous\"), 1 /* TEXT */),\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"small\", { title: $options.modifiedString }, [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(\" — \" + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($options.modifiedString) + \" \", 1 /* TEXT */),\n            ($props.item && $props.item.created != $props.item.modified)\n              ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", {\n                  key: 0,\n                  class: \"icon\",\n                  title: 'Created on ' + $options.createdString + ', edited on ' + $options.modifiedString\n                }, [\n                  _hoisted_5\n                ], 8 /* PROPS */, [\"title\"]))\n              : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n          ], 8 /* PROPS */, [\"title\"])\n        ])\n      ]),\n      (!$data.edit)\n        ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_6, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.item.text), 1 /* TEXT */))\n        : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", {\n            key: 1,\n            onDone: _cache[2] || (_cache[2] = $event => ($data.edit=false))\n          }, [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"form\", { item: $props.item }, () => [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_content_form, {\n                context: $props.item.context,\n                initial: $props.item,\n                onDone: _cache[1] || (_cache[1] = $event => ($data.edit=false))\n              }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createSlots)({ _: 2 /* DYNAMIC */ }, [\n                (_ctx.$slots.formFields)\n                  ? {\n                      name: \"fields\",\n                      fn: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(({item,context,model}) => [\n                        (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"formFields\", {\n                          item: item,\n                          context: context\n                        })\n                      ])\n                    }\n                  : undefined,\n                (_ctx.$slots.formDefault)\n                  ? {\n                      name: \"default\",\n                      fn: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(({item,context}) => [\n                        (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"formDefault\", {\n                          item: item,\n                          context: context\n                        })\n                      ])\n                    }\n                  : undefined\n              ]), 1032 /* PROPS, DYNAMIC_SLOTS */, [\"context\", \"initial\"])\n            ])\n          ], 32 /* HYDRATE_EVENTS */))\n    ]),\n    ($options.allowedActions.length)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_7, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\" TODO: access selector here \"),\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_8, [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_9, [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"button\", _hoisted_10, [\n                _hoisted_11\n              ], 512 /* NEED_PATCH */)\n            ]),\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_12, [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_13, [\n                ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($options.allowedActions, (action) => {\n                  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"a\", {\n                    class: \"dropdown-item\",\n                    onClick: $event => ($options.triggerAction(action))\n                  }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(action.name), 9 /* TEXT, PROPS */, [\"onClick\"]))\n                }), 256 /* UNKEYED_FRAGMENT */))\n              ])\n            ])\n          ])\n        ]))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n  ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/content.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentForm.vue?vue&type=template&id=62bcd3b0":
/*!***************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentForm.vue?vue&type=template&id=62bcd3b0 ***!
  \***************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { class: \"field\" }\nconst _hoisted_2 = { class: \"control\" }\nconst _hoisted_3 = {\n  name: \"text\",\n  class: \"textarea\"\n}\nconst _hoisted_4 = { class: \"level\" }\nconst _hoisted_5 = {\n  key: 0,\n  class: \"level-left\"\n}\nconst _hoisted_6 = { class: \"field is-grouped\" }\nconst _hoisted_7 = { class: \"level-right\" }\nconst _hoisted_8 = { class: \"field is-grouped is-grouped-right\" }\nconst _hoisted_9 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"p\", { class: \"control\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"button\", {\n    type: \"submit\",\n    class: \"button is-link\"\n  }, \"Publish\")\n], -1 /* HOISTED */)\nconst _hoisted_10 = { class: \"control\" }\nconst _hoisted_11 = {\n  key: 1,\n  type: \"reset\",\n  class: \"button is-link is-light\"\n}\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_p_select_role = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-select-role\")\n\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"form\", {\n    ref: \"form\",\n    onSubmit: _cache[3] || (_cache[3] = (...args) => (_ctx.submit && _ctx.submit(...args)))\n  }, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", {\n      item: _ctx.item,\n      context: $props.context\n    }, () => [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"input\", {\n        type: \"hidden\",\n        name: \"context_id\",\n        value: $props.context && $props.context.pk\n      }, null, 8 /* PROPS */, [\"value\"]),\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_1, [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_2, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"textarea\", _hoisted_3, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(_ctx.item.text), 1 /* TEXT */)\n        ])\n      ]),\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"fields\", {\n        item: _ctx.item,\n        context: $props.context\n      }),\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_4, [\n        ($props.showAccess)\n          ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_5, [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_6, [\n                (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_select_role, {\n                  name: \"access\",\n                  value: _ctx.item.access,\n                  \"onUpdate:value\": _cache[1] || (_cache[1] = $event => (_ctx.item.access = $event)),\n                  title: \"Visible to\",\n                  filter: $options.accessFilter\n                }, null, 8 /* PROPS */, [\"value\", \"filter\"])\n              ])\n            ]))\n          : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_7, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_8, [\n            _hoisted_9,\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"p\", _hoisted_10, [\n              (_ctx.item)\n                ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"button\", {\n                    key: 0,\n                    type: \"button\",\n                    onClick: _cache[2] || (_cache[2] = $event => (_ctx.$emit('done'))),\n                    class: \"button is-link is-light\"\n                  }, \" Cancel\"))\n                : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"button\", _hoisted_11, \" Reset\"))\n            ])\n          ])\n        ])\n      ])\n    ])\n  ], 544 /* HYDRATE_EVENTS, NEED_PATCH */))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentForm.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentList.vue?vue&type=template&id=029abd02":
/*!***************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentList.vue?vue&type=template&id=029abd02 ***!
  \***************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_p_content = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-content\")\n\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)(_ctx.items, (item, index) => {\n    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"item\", {\n      index: index,\n      item: item,\n      items: _ctx.items\n    }, () => [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_content, {\n        id: item.pk,\n        item: item,\n        class: \"box\"\n      }, null, 8 /* PROPS */, [\"id\", \"item\"])\n    ])\n  }), 256 /* UNKEYED_FRAGMENT */))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentList.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/selectRole.vue?vue&type=template&id=6f4ba4a9":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/selectRole.vue?vue&type=template&id=6f4ba4a9 ***!
  \***********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { class: \"control has-icons-left\" }\nconst _hoisted_2 = { class: \"select\" }\nconst _hoisted_3 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", { class: \"icon is-left\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: \"mdi mdi-eye\" })\n], -1 /* HOISTED */)\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_1, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_2, [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"select\", (0,vue__WEBPACK_IMPORTED_MODULE_0__.mergeProps)(_ctx.$attrs, {\n        onChange: _cache[1] || (_cache[1] = $event => ($options.computedValue=$event.target.value)),\n        value: $options.computedValue\n      }), [\n        ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($setup.roles, (role) => {\n          return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"option\", {\n            value: role.access\n          }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(role.name), 9 /* TEXT, PROPS */, [\"value\"]))\n        }), 256 /* UNKEYED_FRAGMENT */))\n      ], 16 /* FULL_PROPS */, [\"value\"])\n    ]),\n    _hoisted_3\n  ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/selectRole.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionButton.vue?vue&type=template&id=2344f646":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionButton.vue?vue&type=template&id=2344f646 ***!
  \*******************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = {\n  key: 0,\n  class: \"dropdown is-hoverable is-right\"\n}\nconst _hoisted_2 = { class: \"dropdown-trigger\" }\nconst _hoisted_3 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", { class: \"icon\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: \"mdi mdi-account-multiple\" })\n], -1 /* HOISTED */)\nconst _hoisted_4 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", null, \"Subscribe\", -1 /* HOISTED */)\nconst _hoisted_5 = {\n  class: \"dropdown-menu\",\n  role: \"menu\"\n}\nconst _hoisted_6 = { class: \"dropdown-content\" }\nconst _hoisted_7 = {\n  key: 1,\n  class: \"dropdown is-hoverable is-right\"\n}\nconst _hoisted_8 = { class: \"dropdown-trigger\" }\nconst _hoisted_9 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", { class: \"icon\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: \"mdi mdi-account-multiple\" })\n], -1 /* HOISTED */)\nconst _hoisted_10 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", { class: \"icon\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: \"mdi mdi-account-multiple\" })\n], -1 /* HOISTED */)\nconst _hoisted_11 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", null, \"Request sent\", -1 /* HOISTED */)\nconst _hoisted_12 = {\n  class: \"dropdown-menu\",\n  role: \"menu\"\n}\nconst _hoisted_13 = { class: \"dropdown-content\" }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_p_subscription_form = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-subscription-form\")\n  const _component_p_modal = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-modal\")\n\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_modal, { ref: \"modal\" }, {\n      default: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(() => [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_subscription_form, {\n          onDone: _cache[1] || (_cache[1] = $event => (_ctx.$refs.modal.hide())),\n          class: \"box\",\n          context: $props.context,\n          initial: $options.subscription\n        }, null, 8 /* PROPS */, [\"context\", \"initial\"])\n      ]),\n      _: 1 /* STABLE */\n    }, 512 /* NEED_PATCH */),\n    (!$options.subscription)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_1, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_2, [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"button\", {\n              class: \"button is-link\",\n              onClick: _cache[2] || (_cache[2] = (...args) => (_ctx.subscribe && _ctx.subscribe(...args))),\n              title: `Subscribe as ${$options.roles[$props.context.subscription_default_role]}`\n            }, [\n              _hoisted_3,\n              _hoisted_4\n            ], 8 /* PROPS */, [\"title\"])\n          ]),\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_5, [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_6, [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"a\", {\n                class: \"dropdown-item\",\n                onClick: _cache[3] || (_cache[3] = (...args) => ($options.edit && $options.edit(...args)))\n              }, \"Subscribe...\")\n            ])\n          ])\n        ]))\n      : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_7, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_8, [\n            ($options.subscription.isSubscribed)\n              ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"button\", {\n                  key: 0,\n                  class: \"button\",\n                  onClick: _cache[4] || (_cache[4] = (...args) => ($options.edit && $options.edit(...args)))\n                }, [\n                  _hoisted_9,\n                  (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($options.roles[$props.context.role.access].name), 1 /* TEXT */)\n                ]))\n              : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"button\", {\n                  key: 1,\n                  class: \"button is-info\",\n                  onClick: _cache[5] || (_cache[5] = (...args) => ($options.edit && $options.edit(...args)))\n                }, [\n                  _hoisted_10,\n                  _hoisted_11\n                ]))\n          ]),\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_12, [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_13, [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"a\", {\n                class: \"dropdown-item\",\n                onClick: _cache[6] || (_cache[6] = (...args) => ($options.unsubscribe && $options.unsubscribe(...args)))\n              }, \"Unsubscribe\")\n            ])\n          ])\n        ]))\n  ], 64 /* STABLE_FRAGMENT */))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionButton.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionForm.vue?vue&type=template&id=64461c50":
/*!*****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionForm.vue?vue&type=template&id=64461c50 ***!
  \*****************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { class: \"title is-2\" }\nconst _hoisted_2 = { key: 0 }\nconst _hoisted_3 = { key: 1 }\nconst _hoisted_4 = {\n  key: 1,\n  class: \"notification is-info\"\n}\nconst _hoisted_5 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", null, \" Your subscription request is awaiting for approval (you still can update it). \", -1 /* HOISTED */)\nconst _hoisted_6 = { class: \"field is-horizontal\" }\nconst _hoisted_7 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", { class: \"field-label\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"label\", { class: \"label\" }, \"Role\")\n], -1 /* HOISTED */)\nconst _hoisted_8 = { class: \"field-body\" }\nconst _hoisted_9 = { class: \"field\" }\nconst _hoisted_10 = {\n  key: 0,\n  class: \"help is-info\"\n}\nconst _hoisted_11 = { class: \"field is-horizontal\" }\nconst _hoisted_12 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", { class: \"field-label\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"label\", { class: \"label\" }, \"Visibility\")\n], -1 /* HOISTED */)\nconst _hoisted_13 = { class: \"field-body\" }\nconst _hoisted_14 = { class: \"field\" }\nconst _hoisted_15 = { class: \"level-right\" }\nconst _hoisted_16 = { class: \"field is-grouped is-grouped-right\" }\nconst _hoisted_17 = { class: \"control\" }\nconst _hoisted_18 = { class: \"button is-link\" }\nconst _hoisted_19 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(\"Save\")\nconst _hoisted_20 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(\"Subscribe\")\nconst _hoisted_21 = { class: \"control\" }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_p_select_role = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-select-role\")\n\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"form\", {\n    ref: \"form\",\n    onSubmit: _cache[4] || (_cache[4] = (...args) => (_ctx.submit && _ctx.submit(...args))),\n    onReset: _cache[5] || (_cache[5] = (...args) => (_ctx.reset && _ctx.reset(...args)))\n  }, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"input\", {\n      type: \"hidden\",\n      name: \"context_id\",\n      value: $props.context && $props.context.pk\n    }, null, 8 /* PROPS */, [\"value\"]),\n    (_ctx.item.owner_id)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"input\", {\n          key: 0,\n          type: \"hidden\",\n          name: \"owner_id\",\n          value: _ctx.item.owner_id\n        }, null, 8 /* PROPS */, [\"value\"]))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"h2\", _hoisted_1, [\n      (_ctx.item)\n        ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_2, \"Edit subscription\"))\n        : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_3, \"Subscribe to \" + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.context && $props.context.title), 1 /* TEXT */))\n    ]),\n    (_ctx.item.isRequest)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_4, [\n          _hoisted_5\n        ]))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_6, [\n      _hoisted_7,\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_8, [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_9, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_select_role, {\n            name: \"role\",\n            value: _ctx.item.role,\n            \"onUpdate:value\": _cache[1] || (_cache[1] = $event => (_ctx.item.role = $event)),\n            filter: $setup.roleFilter,\n            title: \"Role\"\n          }, null, 8 /* PROPS */, [\"value\", \"filter\"]),\n          (_ctx.item.role > $props.context.subscription_accept_role)\n            ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", _hoisted_10, \" This role requires approval from moderation \"))\n            : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n        ])\n      ])\n    ]),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_11, [\n      _hoisted_12,\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_13, [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_14, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_select_role, {\n            name: \"access\",\n            value: _ctx.item.access,\n            \"onUpdate:value\": _cache[2] || (_cache[2] = $event => (_ctx.item.access = $event)),\n            filter: $setup.accessFilter,\n            title: \"People being able to see you are subscribed.\"\n          }, null, 8 /* PROPS */, [\"value\", \"filter\"])\n        ])\n      ])\n    ]),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_15, [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_16, [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"p\", _hoisted_17, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"button\", _hoisted_18, [\n            (_ctx.item)\n              ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, { key: 0 }, [\n                  _hoisted_19\n                ], 64 /* STABLE_FRAGMENT */))\n              : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, { key: 1 }, [\n                  _hoisted_20\n                ], 64 /* STABLE_FRAGMENT */))\n          ])\n        ]),\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"p\", _hoisted_21, [\n          (_ctx.item)\n            ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"button\", {\n                key: 0,\n                type: \"button\",\n                onClick: _cache[3] || (_cache[3] = $event => (_ctx.reset() || _ctx.$emit('done'))),\n                class: \"button is-link is-light\"\n              }, \" Cancel\"))\n            : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n        ])\n      ])\n    ])\n  ], 544 /* HYDRATE_EVENTS, NEED_PATCH */))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionForm.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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
/******/ 			"content": 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			["./assets/content/index.js","vendor"]
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