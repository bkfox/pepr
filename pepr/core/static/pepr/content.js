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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"PContent\": () => (/* reexport safe */ _content__WEBPACK_IMPORTED_MODULE_0__.default),\n/* harmony export */   \"PContentForm\": () => (/* reexport safe */ _contentForm__WEBPACK_IMPORTED_MODULE_1__.default),\n/* harmony export */   \"PContentList\": () => (/* reexport safe */ _contentList__WEBPACK_IMPORTED_MODULE_2__.default)\n/* harmony export */ });\n/* harmony import */ var _content__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./content */ \"./assets/content/components/content.vue\");\n/* harmony import */ var _contentForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contentForm */ \"./assets/content/components/contentForm.vue\");\n/* harmony import */ var _contentList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./contentList */ \"./assets/content/components/contentList.vue\");\n\n\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/index.js?");

/***/ }),

/***/ "./assets/content/index.js":
/*!*********************************!*\
  !*** ./assets/content/index.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var pepr_core_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pepr/core/app */ \"./assets/core/app.js\");\n/* harmony import */ var pepr_core_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pepr/core/components */ \"./assets/core/components/index.js\");\n/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components */ \"./assets/content/components/index.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./models */ \"./assets/content/models.js\");\n\n\n\n\n\n\nconst app = new pepr_core_app__WEBPACK_IMPORTED_MODULE_0__.default({}, {\n    models: _models__WEBPACK_IMPORTED_MODULE_3__,\n    components: { ...pepr_core_components__WEBPACK_IMPORTED_MODULE_1__, ..._components__WEBPACK_IMPORTED_MODULE_2__ },\n});\nconst props = {\n    appData: '#app-data',\n}\n\napp.load({async:true, props});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (app);\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/index.js?");

/***/ }),

/***/ "./assets/content/models.js":
/*!**********************************!*\
  !*** ./assets/content/models.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Context\": () => (/* reexport safe */ pepr_core_models__WEBPACK_IMPORTED_MODULE_0__.Context),\n/* harmony export */   \"Subscription\": () => (/* reexport safe */ pepr_core_models__WEBPACK_IMPORTED_MODULE_0__.Subscription),\n/* harmony export */   \"Content\": () => (/* binding */ Content)\n/* harmony export */ });\n/* harmony import */ var pepr_core_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pepr/core/models */ \"./assets/core/models.js\");\n\n\n\n\nclass Content extends pepr_core_models__WEBPACK_IMPORTED_MODULE_0__.Owned {\n    static get entity() { return 'contents' }\n\n    static fields() {\n        return { ...super.fields(),\n            text: this.string(null),\n            html: this.string(null),\n            created: this.attr(null),\n            modified: this.attr(null),\n            modifier: this.attr(null),\n            meta: this.attr(null),\n        }\n    }\n\n    get createdDate() {\n        return this.created && new Date(this.created)\n    }\n\n    get modifiedDate() {\n        return this.modified && new Date(this.modified)\n    }\n}\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/models.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"appMixin\": () => (/* binding */ appMixin),\n/* harmony export */   \"defaultConfig\": () => (/* binding */ defaultConfig),\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! vuex */ \"./node_modules/vuex/dist/vuex.esm-bundler.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! axios */ \"./node_modules/axios/lib/axios.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _vuex_orm_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vuex-orm/core */ \"./node_modules/@vuex-orm/core/dist/vuex-orm.esm.js\");\n/* harmony import */ var _vuex_orm_plugin_axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @vuex-orm/plugin-axios */ \"./node_modules/@vuex-orm/plugin-axios/dist/vuex-orm-axios.esm-browser.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models */ \"./assets/core/models.js\");\n\n\n\n\n\n\n\n\n\n/// Mixin for applications components\nconst appMixin = {\n    data() {\n        return {\n            // Consts\n            consts: {},\n            // API root url\n            apiRoot: null,\n            // Current context id\n            contextId: null,\n        }\n    },\n\n    provide() {\n        return {\n            // FIXME: not reactive\n            apiRoot: this.apiRoot,\n            consts: this.consts,\n            context: this.context,\n        }\n    },\n\n    props: {\n        /// loadData from JSON <scripts> data once `mounted()`\n        /// For more information, see ``loadData()``.\n        appData: String,\n        /// Context model's entity\n        contextModel: {type: Function, default: _models__WEBPACK_IMPORTED_MODULE_0__.Context},\n        /// User's identity's pk if any\n        identity: String,\n        /// Initial context id if any\n        initContextId: String,\n    },\n\n    computed: {\n        /// Current Context\n        context() {\n            return this.contextId && this.contextModel.query().find(this.contextId)\n        },\n\n        /// User's subscription\n        subscription() {\n            return this.identity &&\n                this.$root.Subscription.query().where('owner_id', this.identity)\n                    .first()\n        }\n    },\n\n    methods: {\n        /// Load data from elements matching provided selector under\n        /// application's DOM node.\n        loadAppData(selector) {\n            for(const el of document.querySelectorAll(selector)) {\n                if(el.text)\n                    try {\n                        const data = JSON.parse(el.text)\n                        if(data)\n                            this.loadData(data)\n                    }\n                    catch(e) { console.error(e); }\n            }\n        },\n\n        /// Load data into application.\n        ///\n        /// Data is an object with:\n        /// - 'models': list of models' data, by model entity;\n        /// - 'consts': application consts\n        loadData(data) {\n            if(data.store)\n                for(let entity in data.store) {\n                    let model = this.$store.$db().model(entity)\n                    model ? model.insertOrUpdate({ data: data.store[entity] })\n                          : console.warn(`model ${entity} is not a registered model`)\n                }\n\n            if(data.api_root)\n                this.apiRoot = data.api_root\n            if(data.consts)\n                Object.assign(this.consts, data.consts)\n            if(data.context)\n                this.contextId = data.context\n        },\n    },\n\n    mounted() {\n        if(this.appData)\n            this.loadAppData(this.appData)\n    },\n}\n\nconst defaultConfig = {\n    el: '#app',\n    delimiters: ['[[', ']]'],\n    ...appMixin\n}\n\n\n//! Application class used in Pepr.\n//!\n//! Provides:\n//! - Vue application config and load with promises\n//! - Add components\n//! - Load remote page and reload application, handling history\n//! - Vuex store and Vuex-ORM models\n//\nclass App {\n    constructor(config={}, {components={},models={},storeConfig=null,uses=[]}={} ) {\n        this.title = null\n        this.app = null\n\n        this.config = config\n        this.components = components\n        this.models = models\n        this.storeConfig = storeConfig\n        this.uses = uses\n    }\n\n    get defaultConfig() {\n        return defaultConfig\n    }\n\n    get config() {\n        return this._config\n    }\n\n    set config(config) {\n        let defaultConfig = this.defaultConfig\n        for(var k of new Set([...Object.keys(config || {}), ...Object.keys(defaultConfig)])) {\n            if(config[k] === undefined && defaultConfig[k])\n                config[k] = defaultConfig[k]\n            else if(Array.isArray(config[k]))\n                config[k] = [...defaultConfig[k], ...config[k]]\n            else if(config[k] instanceof Object)\n                config[k] = {...defaultConfig[k], ...config[k]}\n        }\n\n        var self = this\n        config['computed'] = {\n            app() { return self },\n            ...config['computed'],\n        }\n        this._config = config\n    }\n\n    /// Destroy application\n    destroy() {\n        // TODO/FIXME: adapt to Vue3 new app/vm lifecycle\n        this.app && this.app.unmount()\n        this.vm = null\n    }\n\n    mount() {\n        el = el || this.config.el\n        this.vm = el\n    }\n\n    /// Load Vue application, updating page title and content.\n    /// Return promise resolving to Vue's vm.\n    load({async=false,content=null,title=null,el='',mount=true,props={}}={}) {\n        return new Promise((resolve, reject) => {\n            let func = () => {\n                try {\n                    const config = this.config\n                    if(mount || content) {\n                        el = el || config.el\n                        let elm = document.querySelector(el)\n                        if(!elm)\n                            return reject(`Error: can't get element ${el}`)\n\n                        // update content\n                        if(content)\n                            elm.innerHTML = content\n                    }\n\n                    // update title\n                    if(title)\n                        document.title = title\n\n                    window.scroll(0, 0)\n\n                    let app = this.app = this.createApp(config, props)\n                    if(mount) {\n                        let vm = app.mount(el)\n                        resolve([app, vm])\n                    }\n                    else\n                        resolve(app)\n                } catch(error) {\n                    console.error(error)\n                    reject(error)\n                }}\n            async ? window.addEventListener('load', func) : func()\n        })\n    }\n\n    /// Create application using provided config\n    createApp(config, props) {\n        let store = this._createStore(config, this.storeConfig)\n        let app = (0,vue__WEBPACK_IMPORTED_MODULE_1__.createApp)(config, props)\n\n        // store\n        store && app.use(store)\n        // use\n        for(let use of this.uses)\n            app.use(use[0], use[1])\n        // components\n        this.components && this._addComponents(app, this.components)\n        return app\n    }\n\n    /// Return Vuex Store config if required (when store config is provided).\n    ///\n    /// `app_config.computed` will be updated with property to access each model\n    /// of the store (by class name).\n    _createStore(appConfig, storeConfig) {\n        storeConfig = { plugins: [], ...storeConfig }\n        if(this.models) {\n            // use VuexOrm and VuexORMAxios: add database to store\n            _vuex_orm_core__WEBPACK_IMPORTED_MODULE_2__.default.use(_vuex_orm_plugin_axios__WEBPACK_IMPORTED_MODULE_3__.default, { axios: (axios__WEBPACK_IMPORTED_MODULE_4___default()) })\n\n            const database = new _vuex_orm_core__WEBPACK_IMPORTED_MODULE_2__.default.Database()\n            const computed = { ...appConfig.computed }\n            for(let modelName in this.models) {\n                var model = this.models[modelName]\n                database.register(model)\n                if(!computed[model.name])\n                    computed[model.name] = function() {\n                        return this.$store.$db().model(model.entity)\n                    }\n            }\n            appConfig.computed = computed\n            storeConfig.plugins = [ ...storeConfig.plugins, _vuex_orm_core__WEBPACK_IMPORTED_MODULE_2__.default.install(database) ]\n        }\n        return storeConfig && (0,vuex__WEBPACK_IMPORTED_MODULE_5__.createStore)(storeConfig) || null\n    }\n\n    /// Add default components and provided ones (if any) to app.\n    _addComponents(app, components={}) {\n        for(var key in components)\n            app.component(key, components[key])\n    }\n\n    /// Fetch application from server and load.\n    /// TODO/FIXME: handling new application config and models etc.\n    fetch(url, {el='app', ...options}={}) {\n        return fetch(url, options).then(response => response.text())\n            .then(content => {\n                let doc = new DOMParser().parseFromString(content, 'text/html')\n                let app = doc.getElementById('app')\n                content = app ? app.innerHTML : content\n                return this.load({sync: true, content, title: doc.title, url })\n            })\n    }\n\n    /// Save application state into browser history\n    historySave(url,replace=false) {\n        const el = document.querySelector(this.config.el)\n        const state = {\n            // TODO: el: this.config.el,\n            content: el.innerHTML,\n            title: document.title,\n        }\n\n        if(replace)\n            history.replaceState(state, '', url)\n        else\n            history.pushState(state, '', url)\n    }\n\n    /// Load application from browser history's state\n    historyLoad(state) {\n        return this.load({ content: state.content, title: state.title })\n    }\n}\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/app.js?");

/***/ }),

/***/ "./assets/core/components/index.js":
/*!*****************************************!*\
  !*** ./assets/core/components/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"PSelectRole\": () => (/* reexport safe */ _selectRole__WEBPACK_IMPORTED_MODULE_0__.default),\n/* harmony export */   \"PForm\": () => (/* reexport safe */ _form__WEBPACK_IMPORTED_MODULE_1__.default),\n/* harmony export */   \"PList\": () => (/* reexport safe */ _list__WEBPACK_IMPORTED_MODULE_2__.default),\n/* harmony export */   \"PModal\": () => (/* reexport safe */ _modal__WEBPACK_IMPORTED_MODULE_3__.default),\n/* harmony export */   \"PRuntimeTemplate\": () => (/* reexport safe */ _runtimeTemplate__WEBPACK_IMPORTED_MODULE_4__.default),\n/* harmony export */   \"PSubscriptionButton\": () => (/* reexport safe */ _subscriptionButton__WEBPACK_IMPORTED_MODULE_5__.default)\n/* harmony export */ });\n/* harmony import */ var _selectRole__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./selectRole */ \"./assets/core/components/selectRole.vue\");\n/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form */ \"./assets/core/components/form.vue\");\n/* harmony import */ var _list__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./list */ \"./assets/core/components/list.vue\");\n/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modal */ \"./assets/core/components/modal.vue\");\n/* harmony import */ var _runtimeTemplate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./runtimeTemplate */ \"./assets/core/components/runtimeTemplate.js\");\n/* harmony import */ var _subscriptionButton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./subscriptionButton */ \"./assets/core/components/subscriptionButton.vue\");\n\n\n\n\n\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/index.js?");

/***/ }),

/***/ "./assets/core/components/runtimeTemplate.js":
/*!***************************************************!*\
  !*** ./assets/core/components/runtimeTemplate.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/**\n * This code originally comes from v-runtime-template by Alex Jovern. It includes\n * PR#33 and is adapted to Vue 3.\n * The following code is under MIT license (Copyright (c) 2018 Alex Jover).\n */\n\n\nconst defineDescriptor = (src, dest, name) => {\n  if (!dest.hasOwnProperty(name)) {\n    const descriptor = Object.getOwnPropertyDescriptor(src, name);\n    Object.defineProperty(dest, name, descriptor);\n  }\n};\n\nconst merge = objs => {\n  const res = {};\n  objs.forEach(obj => {\n    obj &&\n      Object.getOwnPropertyNames(obj).forEach(name =>\n        defineDescriptor(obj, res, name)\n      );\n  });\n  return res;\n};\n\nconst buildFromProps = (obj, props) => {\n  const res = {};\n  props.forEach(prop => defineDescriptor(obj, res, prop));\n  return res;\n};\n\nconst buildPassthrough = (self, source, target, attr) => {\n    [self, source] = [self[attr], source[attr] || {}];\n    let dest = target[attr] || {};\n    for(var key of Object.keys(source))\n        if(self === undefined || self[key] === undefined)\n            dest[key] = source[key];\n    target[attr] = dest;\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n  props: {\n    template: String\n  },\n  render() {\n    if (this.template) {\n      let passthrough = {};\n      buildPassthrough(self, this.$parent, passthrough, '$data');\n      buildPassthrough(self, this.$parent, passthrough, '$props');\n      buildPassthrough(self, this.$parent.$options, passthrough, 'components');\n      buildPassthrough(self, this.$parent.$options, passthrough, 'computed');\n      buildPassthrough(self, this.$parent.$options, passthrough, 'methods');\n\n      const methodKeys = Object.keys(passthrough.methods);\n      const dataKeys = Object.keys(passthrough.$data);\n      const propKeys = Object.keys(passthrough.$props);\n      const allKeys = dataKeys.concat(propKeys).concat(methodKeys);\n      const methodsFromProps = buildFromProps(this.$parent, methodKeys);\n      const props = merge([passthrough.$data, passthrough.$props, methodsFromProps]);\n\n      const dynamic = {\n        template: this.template || \"<div></div>\",\n        props: allKeys,\n        computed: passthrough.computed,\n        components: passthrough.components\n      };\n\n      return (0,vue__WEBPACK_IMPORTED_MODULE_0__.h)(dynamic, {\n        props\n      });\n    }\n  }\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/runtimeTemplate.js?");

/***/ }),

/***/ "./assets/core/models.js":
/*!*******************************!*\
  !*** ./assets/core/models.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Base\": () => (/* binding */ Base),\n/* harmony export */   \"Context\": () => (/* binding */ Context),\n/* harmony export */   \"Accessible\": () => (/* binding */ Accessible),\n/* harmony export */   \"Owned\": () => (/* binding */ Owned),\n/* harmony export */   \"Subscription\": () => (/* binding */ Subscription)\n/* harmony export */ });\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! js-cookie */ \"./node_modules/js-cookie/src/js.cookie.js\");\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(js_cookie__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _vuex_orm_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @vuex-orm/core */ \"./node_modules/@vuex-orm/core/dist/vuex-orm.esm.js\");\n/* harmony import */ var _role__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./role */ \"./assets/core/role.js\");\n\n\n\n\n\n\nclass Base extends _vuex_orm_core__WEBPACK_IMPORTED_MODULE_1__.Model {\n    static get primaryKey() { return 'pk' }\n\n    static get apiConfig() {\n        return {\n            headers: { 'X-CSRFToken': js_cookie__WEBPACK_IMPORTED_MODULE_2___default().get('csrftoken') }\n        }\n    }\n\n    static fields() {\n        return {\n            pk: this.string(null),\n            api_url: this.string(null),\n            access: this.number(null),\n        }\n    }\n\n    /// Delete item from server\n    delete(config) {\n        if(this.api_url)\n            this.constructor.api().delete(this.api_url, config)\n        else\n            throw \"no api url for item\"\n    }\n}\n\n\nclass Context extends Base {\n    static get entity() { return 'contexts' }\n\n    static fields() {\n        return { ...super.fields(),\n            title: this.string(null),\n            role: this.attr(null, (value) => new _role__WEBPACK_IMPORTED_MODULE_0__.default(value)),\n            allow_subscription_request: this.attr(null),\n            subscription_default_access: this.number(null),\n            subscription_default_role: this.number(null),\n            // subsciption: this.attr(null),\n            subsciptions: this.hasMany(Subscription, 'context'),\n        }\n    }\n\n    /// Return user's identity\n    get identity() {\n        let identity = this.role && this.role.identity\n        return identity && this.constructor.find(identity)\n    }\n\n    /// Return user's subscription\n    get subscription() {\n        let identity = this.role && this.role.identity\n        return identity && Subscription.query().where('owner_id', identity).first()\n    }\n}\n\n\nclass Accessible extends Base {\n    static get entity() { return 'accessibles' }\n\n    static fields() {\n        return { ...super.fields(),\n            context_id: this.attr(null),\n            // context: this.belongsTo(Context, 'context_id'),\n        }\n    }\n\n    get context() {\n        return this.context_id && Context.find(this.context_id)\n    }\n\n    granted(permissions) {\n        let role_perms = context.role.permissions\n        if(!Array.isArray(perms))\n            return !!role_perms[permissions]\n\n        for(var permission of permissions)\n            if(!role_perms[permission])\n                return false\n        return true\n    }\n}\n\nclass Owned extends Accessible {\n    static get entity() { return 'owneds' }\n\n    static fields() {\n        return { ...super.fields(),\n            owner_id: this.attr(null),\n            // owner: this.belongsTo(this.contextModel, 'owner_id'),\n        }\n    }\n\n    get owner() {\n        return Context.find(this.owner_id)\n    }\n}\n\nclass Subscription extends Owned {\n    static get entity() { return 'subscriptions' }\n\n    static fields() {\n        return { ...super.fields(),\n            status: this.number(),\n            access: this.number(),\n            role: this.number(),\n        }\n    }\n}\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/models.js?");

/***/ }),

/***/ "./assets/core/role.js":
/*!*****************************!*\
  !*** ./assets/core/role.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Role)\n/* harmony export */ });\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models */ \"./assets/core/models.js\");\n\n\nclass Role {\n    constructor(data) {\n        for(let key in data)\n            this[key] = data[key]\n    }\n\n    isGranted(permissions, item) {\n        if(!this.permissions)\n            return false\n        if(item instanceof _models__WEBPACK_IMPORTED_MODULE_0__.Owned && this.identity == item.owner)\n            return true\n\n        for(var name of permissions)\n            if(!this.permissions[name])\n                return false\n        return true\n    }\n}\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/role.js?");

/***/ }),

/***/ "./assets/content/components/content.vue":
/*!***********************************************!*\
  !*** ./assets/content/components/content.vue ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _content_vue_vue_type_template_id_76205d44__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./content.vue?vue&type=template&id=76205d44 */ \"./assets/content/components/content.vue?vue&type=template&id=76205d44\");\n/* harmony import */ var _content_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./content.vue?vue&type=script&lang=js */ \"./assets/content/components/content.vue?vue&type=script&lang=js\");\n\n\n\n_content_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.render = _content_vue_vue_type_template_id_76205d44__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_content_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.__file = \"assets/content/components/content.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_content_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default);\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/content.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/content.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/content.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _contentForm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./contentForm */ \"./assets/content/components/contentForm.vue\");\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    inject: ['actions'],\n    props: {\n        item: Object,\n    },\n\n    data() {\n        return {\n            /// If true, show edit form\n            edit: false,\n        }\n    },\n\n    computed: {\n        allowedActions() {\n            if(!this.item.context)\n                return []\n\n            let role = this.item.context.role;\n            return this.actions.filter((action) => action.isGranted(role, this.item))\n        },\n\n        createdString() {\n            let date = this.item.createdDate;\n            return date ? date.toLocaleDateString() + ' ' + date.toLocaleTimeString()\n                        : '';\n        },\n\n        modifiedString() {\n            let date = this.item.modifiedDate;\n            return date ? date.toLocaleDateString() + ' ' + date.toLocaleTimeString()\n                        : '';\n        },\n    },\n\n    methods: {\n        triggerAction(action) {\n            action.trigger(this.item, this)\n        },\n    },\n\n    components: { PContentForm: _contentForm__WEBPACK_IMPORTED_MODULE_0__.default },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/content.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var pepr_core_components_form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pepr/core/components/form */ \"./assets/core/components/form.vue\");\n/* harmony import */ var pepr_core_components_selectRole__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pepr/core/components/selectRole */ \"./assets/core/components/selectRole.vue\");\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    extends: pepr_core_components_form__WEBPACK_IMPORTED_MODULE_0__.default,\n    inject: ['consts'],\n    props: {\n        /// Show access field\n        showAccess: { type: Boolean, default: true },\n    },\n\n    components: { PSelectRole: pepr_core_components_selectRole__WEBPACK_IMPORTED_MODULE_1__.default },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentForm.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/content/components/contentList.vue":
/*!***************************************************!*\
  !*** ./assets/content/components/contentList.vue ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"actions\": () => (/* reexport safe */ _contentList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.actions),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _contentList_vue_vue_type_template_id_029abd02__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./contentList.vue?vue&type=template&id=029abd02 */ \"./assets/content/components/contentList.vue?vue&type=template&id=029abd02\");\n/* harmony import */ var _contentList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contentList.vue?vue&type=script&lang=js */ \"./assets/content/components/contentList.vue?vue&type=script&lang=js\");\n\n\n\n_contentList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.render = _contentList_vue_vue_type_template_id_029abd02__WEBPACK_IMPORTED_MODULE_0__.render\n/* hot reload */\nif (false) {}\n\n_contentList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default.__file = \"assets/content/components/contentList.vue\"\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_contentList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__.default);\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentList.vue?");

/***/ }),

/***/ "./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentList.vue?vue&type=script&lang=js":
/*!***********************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentList.vue?vue&type=script&lang=js ***!
  \***********************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"actions\": () => (/* binding */ actions),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var pepr_core_action__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pepr/core/action */ \"./assets/core/action.js\");\n/* harmony import */ var pepr_core_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pepr/core/components */ \"./assets/core/components/index.js\");\n/* harmony import */ var _content__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./content */ \"./assets/content/components/content.vue\");\n\n\n\n\n\n\nconst actions = [\n    new pepr_core_action__WEBPACK_IMPORTED_MODULE_0__.default('Edit', ['update'], (item, comp) => {\n        comp.edit = true\n    }),\n    new pepr_core_action__WEBPACK_IMPORTED_MODULE_0__.default('Delete', ['destroy'], (item, comp) => {\n        if(confirm('Delete?'))\n            item.delete({ delete: 1})\n    }),\n]\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    data() {\n        return {\n            formItem: null,\n        }\n    },\n\n    provide() {\n        return {\n            actions\n        }\n    },\n\n    props: {\n        model: Function,\n        context: Object,\n        contextUrl: String,\n        apiUrl: String,\n    },\n\n    components: {\n        ...pepr_core_components__WEBPACK_IMPORTED_MODULE_1__, ..._content__WEBPACK_IMPORTED_MODULE_2__\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentList.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-cookie */ \"./node_modules/js-cookie/src/js.cookie.js\");\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(js_cookie__WEBPACK_IMPORTED_MODULE_0__);\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    emits: ['done', 'error'],\n    props: {\n        model: Function,\n        context: Object,\n        item: Object,\n        apiUrl: String,\n        action: String,\n        method: {type:String, default:'POST'},\n    },\n\n    computed: {\n        currentContext() {\n            return (this.item && this.item.context) || this.context\n        },\n\n        currentModel() {\n            return (this.item && this.item.constructor) || this.model\n        },\n\n        targetMethod() {\n            return this.item ? 'PUT' : this.method\n        },\n\n        targetUrl() {\n            return this.item ? this.item.api_url : this.apiUrl\n        },\n    },\n\n    methods: {\n        onSubmit(ev) {\n            if(!this.targetUrl || !this.currentModel || ev.target != this.$refs.form)\n                return\n\n            ev.preventDefault()\n            ev.stopPropagation()\n\n            let data = new FormData(event.target);\n            let config = {\n                headers: {\n                    'Content-Type': 'multipart/form-data',\n                    'X-CSRFToken': js_cookie__WEBPACK_IMPORTED_MODULE_0___default().get('csrftoken'),\n                }\n            }\n            let method = this.targetMethod.toLowerCase()\n            this.currentModel.api()[method](this.targetUrl, data, config)\n                .then(r => this.$emit('done', r),\n                      r => this.$emit('error', r))\n        },\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/form.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        model: Function,\n        context: Object,\n        contextUrl: String,\n        contextFilter: { type: String, default: 'context' },\n        orderBy: String,\n        apiUrl: String\n    },\n\n    computed: {\n        itemsQuery() {\n            let query = this.model.query();\n            if(this.orderBy) {\n                let [order, dir] = this.orderBy.startsWith('-') ?\n                    [this.orderBy.slice(1), 'desc'] : [this.orderBy, 'asc'];\n                query = query.orderBy((obj) => obj[order], dir)\n            }\n            if(this.context)\n                query = query.where('context_id', this.context.pk)\n            return query\n        },\n\n        items() {\n            let items = this.itemsQuery.get()\n            return items\n        },\n    },\n\n    methods: {\n        fetchContext(url, {context=null, search={}, ...config}={}) {\n            context = context || this.context\n            if(!context)\n                return\n            let params = new URLSearchParams(search)\n            params.append(this.contextFilter, context.pk)\n            return this.fetch(`${url}?${params.toString()}`, config)\n        },\n\n        fetch(url, config={}) {\n            return this.model.api().get(url, { dataKey: 'results', ...config})\n        },\n    },\n\n    watch: {\n        context(context, oldContext) {\n            this.fetchContext(this.apiUrl, {context});\n        }\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/list.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    inject: ['consts'],\n    props: {\n        context: Object,\n        name: String,\n        title: { type: String, default: 'Visible to' },\n        limit: { type: Boolean, default: false },\n    },\n});\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/selectRole.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    inject: ['consts'],\n    props: {\n        context: Object,\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionButton.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./assets/content/components/content.vue?vue&type=script&lang=js":
/*!***********************************************************************!*\
  !*** ./assets/content/components/content.vue?vue&type=script&lang=js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_content_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_content_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./content.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/content.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/content.vue?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_contentList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default),\n/* harmony export */   \"actions\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_contentList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.actions)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_contentList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./contentList.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentList.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentList.vue?");

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

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/content.vue?vue&type=template&id=76205d44":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/content.vue?vue&type=template&id=76205d44 ***!
  \***********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { class: \"media\" }\nconst _hoisted_2 = { class: \"media-content\" }\nconst _hoisted_3 = { class: \"level\" }\nconst _hoisted_4 = { class: \"level-left\" }\nconst _hoisted_5 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: \"mdi mdi-pencil-outline\" }, null, -1 /* HOISTED */)\nconst _hoisted_6 = { key: 0 }\nconst _hoisted_7 = {\n  key: 0,\n  class: \"media-right\"\n}\nconst _hoisted_8 = {\n  class: \"dropdown is-hoverable is-right\",\n  \"aria-role\": \"menu\"\n}\nconst _hoisted_9 = { class: \"dropdown-trigger\" }\nconst _hoisted_10 = {\n  class: \"button\",\n  ref: \"menu\"\n}\nconst _hoisted_11 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", { class: \"icon\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: \"mdi mdi-dots-vertical\" })\n], -1 /* HOISTED */)\nconst _hoisted_12 = {\n  class: \"dropdown-menu\",\n  role: \"menu\"\n}\nconst _hoisted_13 = { class: \"dropdown-content\" }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_p_content_form = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-content-form\")\n\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_1, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_2, [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_3, [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_4, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"strong\", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.item.owner && $props.item.owner.title || \"Anonymous\"), 1 /* TEXT */),\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"small\", { title: $options.modifiedString }, [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createTextVNode)(\" — \" + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($options.modifiedString) + \" \", 1 /* TEXT */),\n            ($props.item && $props.item.created != $props.item.modified)\n              ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"span\", {\n                  key: 0,\n                  class: \"icon\",\n                  title: 'Created on ' + $options.createdString + ', edited on ' + $options.modifiedString\n                }, [\n                  _hoisted_5\n                ], 8 /* PROPS */, [\"title\"]))\n              : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n          ], 8 /* PROPS */, [\"title\"])\n        ])\n      ]),\n      (!$data.edit)\n        ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_6, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.item.text), 1 /* TEXT */))\n        : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", {\n            key: 1,\n            onDone: _cache[2] || (_cache[2] = $event => ($data.edit=false))\n          }, [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"form\", { item: $props.item }, () => [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_content_form, {\n                item: $props.item,\n                onDone: _cache[1] || (_cache[1] = $event => ($data.edit=false))\n              }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.createSlots)({ _: 2 /* DYNAMIC */ }, [\n                (_ctx.$slots.formFields)\n                  ? {\n                      name: \"fields\",\n                      fn: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(({item,context,model}) => [\n                        (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"formFields\", {\n                          item: item,\n                          context: context\n                        })\n                      ])\n                    }\n                  : undefined,\n                (_ctx.$slots.formDefault)\n                  ? {\n                      name: \"default\",\n                      fn: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(({item,context}) => [\n                        (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"formDefault\", {\n                          item: item,\n                          context: context\n                        })\n                      ])\n                    }\n                  : undefined\n              ]), 1032 /* PROPS, DYNAMIC_SLOTS */, [\"item\"])\n            ])\n          ], 32 /* HYDRATE_EVENTS */))\n    ]),\n    ($options.allowedActions.length)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_7, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\" TODO: access selector here \"),\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_8, [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_9, [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"button\", _hoisted_10, [\n                _hoisted_11\n              ], 512 /* NEED_PATCH */)\n            ]),\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_12, [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_13, [\n                ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($options.allowedActions, (action) => {\n                  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"a\", {\n                    class: \"dropdown-item\",\n                    onClick: $event => ($options.triggerAction(action))\n                  }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(action.name), 9 /* TEXT, PROPS */, [\"onClick\"]))\n                }), 256 /* UNKEYED_FRAGMENT */))\n              ])\n            ])\n          ])\n        ]))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n  ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/content.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentForm.vue?vue&type=template&id=62bcd3b0":
/*!***************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentForm.vue?vue&type=template&id=62bcd3b0 ***!
  \***************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { class: \"field\" }\nconst _hoisted_2 = { class: \"control\" }\nconst _hoisted_3 = {\n  name: \"text\",\n  class: \"textarea\"\n}\nconst _hoisted_4 = { class: \"columns\" }\nconst _hoisted_5 = {\n  key: 0,\n  class: \"column\"\n}\nconst _hoisted_6 = { class: \"field is-grouped\" }\nconst _hoisted_7 = { class: \"column\" }\nconst _hoisted_8 = { class: \"field is-grouped is-grouped-right\" }\nconst _hoisted_9 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"p\", { class: \"control\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"button\", {\n    type: \"submit\",\n    class: \"button is-link\"\n  }, \"Publish\")\n], -1 /* HOISTED */)\nconst _hoisted_10 = { class: \"control\" }\nconst _hoisted_11 = {\n  key: 1,\n  type: \"reset\",\n  class: \"button is-link is-light\"\n}\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_p_select_role = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-select-role\")\n\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"form\", {\n    ref: \"form\",\n    method: _ctx.targetMethod,\n    action: _ctx.action,\n    onSubmit: _cache[2] || (_cache[2] = (...args) => (_ctx.onSubmit && _ctx.onSubmit(...args)))\n  }, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", {\n      item: _ctx.item,\n      context: _ctx.currentContext\n    }, () => [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"input\", {\n        type: \"hidden\",\n        name: \"context_id\",\n        value: _ctx.currentContext && _ctx.currentContext.pk\n      }, null, 8 /* PROPS */, [\"value\"]),\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"fields\", {\n        item: _ctx.item,\n        context: _ctx.currentContext\n      }),\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_1, [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_2, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"textarea\", _hoisted_3, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(_ctx.item && _ctx.item.text), 1 /* TEXT */)\n        ])\n      ]),\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_4, [\n        ($props.showAccess)\n          ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_5, [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_6, [\n                (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_select_role, {\n                  name: _ctx.access,\n                  context: _ctx.currentContext,\n                  limit: true,\n                  title: \"Visible to\"\n                }, null, 8 /* PROPS */, [\"name\", \"context\"])\n              ])\n            ]))\n          : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_7, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_8, [\n            _hoisted_9,\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"p\", _hoisted_10, [\n              (_ctx.item)\n                ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"button\", {\n                    key: 0,\n                    onClick: _cache[1] || (_cache[1] = $event => (_ctx.$emit('done'))),\n                    class: \"button is-link is-light\"\n                  }, \" Cancel\"))\n                : ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"button\", _hoisted_11, \" Reset\"))\n            ])\n          ])\n        ])\n      ])\n    ])\n  ], 40 /* PROPS, HYDRATE_EVENTS */, [\"method\", \"action\"]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentForm.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentList.vue?vue&type=template&id=029abd02":
/*!***************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentList.vue?vue&type=template&id=029abd02 ***!
  \***************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_p_content = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-content\")\n  const _component_p_list = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-list\")\n\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", null, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_list, {\n      ref: \"list\",\n      model: $props.model,\n      context: $props.context,\n      contextUrl: $props.contextUrl,\n      \"api-url\": $props.apiUrl,\n      orderBy: \"-modified\"\n    }, {\n      item: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(({item, items, index}) => [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"item\", {\n          item: item,\n          items: items,\n          index: index\n        }, () => [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_content, {\n            id: item.pk,\n            item: item,\n            class: \"box\"\n          }, null, 8 /* PROPS */, [\"id\", \"item\"])\n        ])\n      ]),\n      _: 1 /* STABLE */\n    }, 8 /* PROPS */, [\"model\", \"context\", \"contextUrl\", \"api-url\"])\n  ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentList.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/form.vue?vue&type=template&id=05d1c81b":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/form.vue?vue&type=template&id=05d1c81b ***!
  \*****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { class: \"is-bad\" }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"form\", {\n    ref: \"form\",\n    method: $options.targetMethod,\n    action: $props.action,\n    onSubmit: _cache[1] || (_cache[1] = (...args) => ($options.onSubmit && $options.onSubmit(...args)))\n  }, [\n    (_ctx.error)\n      ? (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"error\", {\n          key: 0,\n          message: _ctx.message\n        }, () => [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_1, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(_ctx.message), 1 /* TEXT */)\n        ])\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", { item: $props.item })\n  ], 40 /* PROPS, HYDRATE_EVENTS */, [\"method\", \"action\"]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/form.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { class: \"control has-icons-left\" }\nconst _hoisted_2 = { class: \"select\" }\nconst _hoisted_3 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", { class: \"icon is-left\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: \"mdi mdi-eye\" })\n], -1 /* HOISTED */)\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_1, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_2, [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"select\", {\n        name: $props.name,\n        title: $props.title\n      }, [\n        ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($options.consts.roles, (role) => {\n          return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, [\n            (!$props.limit || !$props.context || role.access <= $props.context.role.access)\n              ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"option\", {\n                  key: 0,\n                  value: role.access\n                }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(role.name), 9 /* TEXT, PROPS */, [\"value\"]))\n              : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n          ], 64 /* STABLE_FRAGMENT */))\n        }), 256 /* UNKEYED_FRAGMENT */))\n      ], 8 /* PROPS */, [\"name\", \"title\"])\n    ]),\n    _hoisted_3\n  ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/selectRole.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionButton.vue?vue&type=template&id=2344f646":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/core/components/subscriptionButton.vue?vue&type=template&id=2344f646 ***!
  \*******************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { class: \"dropdown is-hoverable is-right\" }\nconst _hoisted_2 = { class: \"dropdown-trigger\" }\nconst _hoisted_3 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", { class: \"icon\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: \"mdi mdi-account-multiple\" })\n], -1 /* HOISTED */)\nconst _hoisted_4 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", null, \"Subscribe\", -1 /* HOISTED */)\nconst _hoisted_5 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", { class: \"icon\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: \"mdi mdi-account-multiple\" })\n], -1 /* HOISTED */)\nconst _hoisted_6 = {\n  key: 0,\n  class: \"dropdown-menu\",\n  role: \"menu\"\n}\nconst _hoisted_7 = { class: \"dropdown-content\" }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_1, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_2, [\n      (!$props.context || !$props.context.role.is_subscribed)\n        ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"button\", {\n            key: 0,\n            class: \"button is-link\",\n            onClick: _cache[1] || (_cache[1] = (...args) => (_ctx.subscribe && _ctx.subscribe(...args)))\n          }, [\n            _hoisted_3,\n            _hoisted_4\n          ]))\n        : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true),\n      ($props.context && $props.context.role.is_subscribed)\n        ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"button\", {\n            key: 1,\n            class: \"button\",\n            onClick: _cache[2] || (_cache[2] = (...args) => (_ctx.editSubscription && _ctx.editSubscription(...args)))\n          }, [\n            _hoisted_5,\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($options.consts.roles[$props.context.role.access].name), 1 /* TEXT */)\n          ]))\n        : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n    ]),\n    ($props.context && $props.context.role.is_subscribed)\n      ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_6, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_7, [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"a\", {\n              href: \"\",\n              class: \"dropdown-item\",\n              onClick: _cache[3] || (_cache[3] = (...args) => (_ctx.unsubscribe && _ctx.unsubscribe(...args)))\n            }, \"Unsubscribe\")\n          ])\n        ]))\n      : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)(\"v-if\", true)\n  ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/subscriptionButton.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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