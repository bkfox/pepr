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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Content\": () => (/* reexport safe */ _content__WEBPACK_IMPORTED_MODULE_0__.default),\n/* harmony export */   \"ContentForm\": () => (/* reexport safe */ _contentForm__WEBPACK_IMPORTED_MODULE_1__.default),\n/* harmony export */   \"ContentList\": () => (/* reexport safe */ _contentList__WEBPACK_IMPORTED_MODULE_2__.default),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _content__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./content */ \"./assets/content/components/content.vue\");\n/* harmony import */ var _contentForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./contentForm */ \"./assets/content/components/contentForm.vue\");\n/* harmony import */ var _contentList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./contentList */ \"./assets/content/components/contentList.vue\");\n\n\n\n\n;\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    'p-content': _content__WEBPACK_IMPORTED_MODULE_0__.default,\n    'p-content-form': _contentForm__WEBPACK_IMPORTED_MODULE_1__.default,\n    'p-content-list': _contentList__WEBPACK_IMPORTED_MODULE_2__.default,\n});\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/index.js?");

/***/ }),

/***/ "./assets/content/index.js":
/*!*********************************!*\
  !*** ./assets/content/index.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var pepr_core_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pepr/core/app */ \"./assets/core/app.js\");\n/* harmony import */ var pepr_core_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pepr/core/components */ \"./assets/core/components/index.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./models */ \"./assets/content/models.js\");\n/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components */ \"./assets/content/components/index.js\");\n\n\n\n\n\n\n\nconst app = new pepr_core_app__WEBPACK_IMPORTED_MODULE_0__.default({}, {\n    models: _models__WEBPACK_IMPORTED_MODULE_2__,\n    components: { ...pepr_core_components__WEBPACK_IMPORTED_MODULE_1__.default, ..._components__WEBPACK_IMPORTED_MODULE_3__.default },\n});\nconst props = {\n    contextModel: _models__WEBPACK_IMPORTED_MODULE_2__.Container,\n}\n\napp.load({async:true, props}).then((vm) => {\n    window.contentVm = vm\n})\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (app);\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/index.js?");

/***/ }),

/***/ "./assets/content/models.js":
/*!**********************************!*\
  !*** ./assets/content/models.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Container\": () => (/* binding */ Container),\n/* harmony export */   \"Subscription\": () => (/* binding */ Subscription),\n/* harmony export */   \"Content\": () => (/* binding */ Content)\n/* harmony export */ });\n/* harmony import */ var pepr_core_models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pepr/core/models */ \"./assets/core/models.js\");\n\n\n\nclass Container extends pepr_core_models__WEBPACK_IMPORTED_MODULE_0__.Context {\n    static get entity() { return 'contexts' }\n    static get contextModel() { return Container }\n\n    static fields() {\n        return { ...super.fields(),\n            description: this.string(null),\n        }\n    }\n}\n\nclass Subscription extends pepr_core_models__WEBPACK_IMPORTED_MODULE_0__.Subscription {\n    static get contextModel() { return Container }\n}\n\nclass Content extends pepr_core_models__WEBPACK_IMPORTED_MODULE_0__.Owned {\n    static get entity() { return 'contents' }\n    static get contextModel() { return Container }\n\n    static fields() {\n        return { ...super.fields(),\n            text: this.string(null),\n            html: this.string(null),\n            created: this.attr(null),\n            modified: this.attr(null),\n            modifier: this.attr(null),\n            meta: this.attr(null),\n        }\n    }\n\n    get createdDate() {\n        return this.created && new Date(this.created)\n    }\n\n    get modifiedDate() {\n        return this.modified && new Date(this.modified)\n    }\n}\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/models.js?");

/***/ }),

/***/ "./assets/core/app.js":
/*!****************************!*\
  !*** ./assets/core/app.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"appMixin\": () => (/* binding */ appMixin),\n/* harmony export */   \"defaultConfig\": () => (/* binding */ defaultConfig),\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! vuex */ \"./node_modules/vuex/dist/vuex.esm-bundler.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! axios */ \"./node_modules/axios/lib/axios.js\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _vuex_orm_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vuex-orm/core */ \"./node_modules/@vuex-orm/core/dist/vuex-orm.esm.js\");\n/* harmony import */ var _vuex_orm_plugin_axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @vuex-orm/plugin-axios */ \"./node_modules/@vuex-orm/plugin-axios/dist/vuex-orm-axios.esm-browser.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models */ \"./assets/core/models.js\");\n\n\n\n\n\n\n\n\n\n/// Mixin for applications components\nconst appMixin = {\n    data() {\n        return {\n            consts: {},\n            contextId: null,\n        }\n    },\n\n    props: {\n        /// loadData from JSON <scripts> data once `mounted()`\n        /// For more information, see ``loadData()``.\n        appData: String,\n        /// Context model's entity\n        contextModel: {type: Function, default: _models__WEBPACK_IMPORTED_MODULE_0__.Context},\n        /// User's identity's pk if any\n        identity: String,\n        /// Initial context id if any\n        initContextId: String,\n    },\n\n    computed: {\n        /// Current Context\n        context() {\n            console.log(this.contextId, '---', this.contextModel.query().find(this.contextId))\n            return this.contextId && this.contextModel.query().find(this.contextId)\n        },\n\n        /// User's subscription\n        subscription() {\n            return this.identity &&\n                this.$root.Subscription.query().where('owner_id', this.identity)\n                    .first()\n        }\n    },\n\n    methods: {\n        /// Load data from elements matching provided selector under\n        /// application's DOM node.\n        loadAppData(selector) {\n            for(const el of document.querySelectorAll(selector)) {\n                if(el.text)\n                    try {\n                        const data = JSON.parse(el.text)\n                        if(data)\n                            this.loadData(data)\n                    }\n                    catch(e) { console.error(e); }\n            }\n        },\n\n        /// Load data into application.\n        ///\n        /// Data is an object with:\n        /// - 'models': list of models' data, by model entity;\n        /// - 'consts': application consts\n        loadData(data) {\n            console.log(data.store)\n            if(data.store)\n                for(let entity in data.store) {\n                    let model = this.$store.$db().model(entity)\n                    model ? model.insertOrUpdate({ data: data.store[entity] })\n                          : console.warn(`model ${entity} is not a registered model`)\n                }\n\n            if(data.consts)\n                this.consts = data.consts\n\n            if(data.context)\n                this.contextId = data.context\n        },\n    },\n\n    mounted() {\n        if(this.appData)\n            this.loadAppData(this.appData)\n    },\n}\n\nconst defaultConfig = {\n    el: '#app',\n    delimiters: ['[[', ']]'],\n    ...appMixin\n}\n\n\n//! Application class used in Pepr.\n//!\n//! Provides:\n//! - Vue application config and load with promises\n//! - Add components\n//! - Load remote page and reload application, handling history\n//! - Vuex store and Vuex-ORM models\n//\nclass App {\n    constructor(config={}, {storeConfig=null,models={},components={}}={} ) {\n        this.title = null\n        this.app = null\n\n        this.config = config\n        this.components = components\n        this.storeConfig = storeConfig\n        this.models = models\n    }\n\n    get defaultConfig() {\n        return defaultConfig\n    }\n\n    get config() {\n        return this._config\n    }\n\n    set config(config) {\n        let defaultConfig = this.defaultConfig\n        for(var k of new Set([...Object.keys(config || {}), ...Object.keys(defaultConfig)])) {\n            if(config[k] === undefined && defaultConfig[k])\n                config[k] = defaultConfig[k]\n            else if(Array.isArray(config[k]))\n                config[k] = [...defaultConfig[k], ...config[k]]\n            else if(config[k] instanceof Object)\n                config[k] = {...defaultConfig[k], ...config[k]}\n        }\n\n        var self = this\n        config['computed'] = {\n            app() { return self },\n            ...config['computed'],\n        }\n        this._config = config\n    }\n\n    /// Destroy application\n    destroy() {\n        // TODO/FIXME: adapt to Vue3 new app/vm lifecycle\n        this.app && this.app.unmount()\n        this.vm = null\n    }\n\n    mount() {\n        el = el || this.config.el\n        this.vm = el\n    }\n\n    /// Load Vue application, updating page title and content.\n    /// Return promise resolving to Vue's vm.\n    load({async=false,content=null,title=null,el='',mount=true,props={}}={}) {\n        return new Promise((resolve, reject) => {\n            let func = () => {\n                try {\n                    const config = this.config\n                    el = el || config.el\n                    el = document.querySelector(el)\n                    if(!el)\n                        return reject(`Error: can't get element ${config.el}`)\n\n                    // update content\n                    if(content)\n                        el.innerHTML = content\n\n                    // update title\n                    if(title)\n                        document.title = title\n\n                    // create app\n                    let store = this._createStore(config, this.storeConfig)\n                    let app = (0,vue__WEBPACK_IMPORTED_MODULE_1__.createApp)(config, {\n                        appData: el.getAttribute('app-data'),\n                        ...props\n                    })\n                    this.app = app\n                    store && app.use(store)\n                    this.components && this._addComponents(app, this.components)\n                    let vm = mount && app.mount(config.el)\n\n                    window.scroll(0, 0)\n                    resolve(vm)\n                } catch(error) {\n                    console.error(error)\n                    reject(error)\n                }}\n            async ? window.addEventListener('load', func) : func()\n        })\n    }\n\n    /// Return Vuex Store config if required (when store config is provided).\n    ///\n    /// `app_config.computed` will be updated with property to access each model\n    /// of the store (by class name).\n    _createStore(appConfig, storeConfig) {\n        storeConfig = { plugins: [], ...storeConfig }\n        if(this.models) {\n            // use VuexOrm and VuexORMAxios: add database to store\n            _vuex_orm_core__WEBPACK_IMPORTED_MODULE_2__.default.use(_vuex_orm_plugin_axios__WEBPACK_IMPORTED_MODULE_3__.default, { axios: (axios__WEBPACK_IMPORTED_MODULE_4___default()) })\n\n            const database = new _vuex_orm_core__WEBPACK_IMPORTED_MODULE_2__.default.Database()\n            const computed = { ...appConfig.computed }\n            for(let modelName in this.models) {\n                var model = this.models[modelName]\n                database.register(model)\n                if(!computed[model.name])\n                    computed[model.name] = function() {\n                        return this.$store.$db().model(model.entity)\n                    }\n            }\n            appConfig.computed = computed\n            storeConfig.plugins = [ ...storeConfig.plugins, _vuex_orm_core__WEBPACK_IMPORTED_MODULE_2__.default.install(database) ]\n        }\n        return storeConfig && (0,vuex__WEBPACK_IMPORTED_MODULE_5__.createStore)(storeConfig) || null\n    }\n\n    /// Add default components and provided ones (if any) to app.\n    _addComponents(app, components={}) {\n        for(var key in components)\n            app.component(key, components[key])\n    }\n\n    /// Fetch application from server and load.\n    /// TODO/FIXME: handling new application config and models etc.\n    fetch(url, {el='app', ...options}={}) {\n        return fetch(url, options).then(response => response.text())\n            .then(content => {\n                let doc = new DOMParser().parseFromString(content, 'text/html')\n                let app = doc.getElementById('app')\n                content = app ? app.innerHTML : content\n                return this.load({sync: true, content, title: doc.title, url })\n            })\n    }\n\n    /// Save application state into browser history\n    historySave(url,replace=false) {\n        const el = document.querySelector(this.config.el)\n        const state = {\n            // TODO: el: this.config.el,\n            content: el.innerHTML,\n            title: document.title,\n        }\n\n        if(replace)\n            history.replaceState(state, '', url)\n        else\n            history.pushState(state, '', url)\n    }\n\n    /// Load application from browser history's state\n    historyLoad(state) {\n        return this.load({ content: state.content, title: state.title })\n    }\n}\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/app.js?");

/***/ }),

/***/ "./assets/core/components/index.js":
/*!*****************************************!*\
  !*** ./assets/core/components/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Form\": () => (/* reexport safe */ _form__WEBPACK_IMPORTED_MODULE_0__.default),\n/* harmony export */   \"List\": () => (/* reexport safe */ _list__WEBPACK_IMPORTED_MODULE_1__.default),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./form */ \"./assets/core/components/form.vue\");\n/* harmony import */ var _list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./list */ \"./assets/core/components/list.vue\");\n\n\n\n;\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    'p-form': _form__WEBPACK_IMPORTED_MODULE_0__.default,\n    'p-list': _list__WEBPACK_IMPORTED_MODULE_1__.default,\n});\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/index.js?");

/***/ }),

/***/ "./assets/core/models.js":
/*!*******************************!*\
  !*** ./assets/core/models.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Base\": () => (/* binding */ Base),\n/* harmony export */   \"Context\": () => (/* binding */ Context),\n/* harmony export */   \"Accessible\": () => (/* binding */ Accessible),\n/* harmony export */   \"Owned\": () => (/* binding */ Owned),\n/* harmony export */   \"Subscription\": () => (/* binding */ Subscription)\n/* harmony export */ });\n/* harmony import */ var _vuex_orm_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @vuex-orm/core */ \"./node_modules/@vuex-orm/core/dist/vuex-orm.esm.js\");\n\n\n\nclass Base extends _vuex_orm_core__WEBPACK_IMPORTED_MODULE_0__.Model {\n    static get primaryKey() { return 'pk' }\n\n    static fields() {\n        return {\n            pk: this.string(null),\n            api_url: this.string(null),\n            access: this.number(null),\n        }\n    }\n}\n\n\nclass Context extends Base {\n    static get entity() { return 'contexts' }\n\n    static fields() {\n        return { ...super.fields(),\n            title: this.string(null),\n            role: this.attr(null),\n            allow_subscription_request: this.attr(null),\n            subscription_default_access: this.number(null),\n            subscription_default_role: this.number(null),\n            // subsciption: this.attr(null),\n            subsciptions: this.hasMany(Subscription, 'context'),\n        }\n    }\n\n    /// Return user's identity\n    get identity() {\n        let identity = this.role && this.role.identity\n        return identity && this.constructor.find(identity)\n    }\n\n    /// Return user's subscription\n    get subscription() {\n        let identity = this.role && this.role.identity\n        return identity && Subscription.query().where('owner_id', identity).first()\n    }\n}\n\n\nclass Accessible extends Base {\n    static get entity() { return 'accessibles' }\n    static get contextModel() { return Context }\n\n    static fields() {\n        return { ...super.fields(),\n            context_id: this.attr(null),\n            context: this.belongsTo(this.contextModel, 'context_id'),\n        }\n    }\n}\n\nclass Owned extends Accessible {\n    static get entity() { return 'owneds' }\n\n    static fields() {\n        return { ...super.fields(),\n            owner_id: this.attr(null),\n            // owner: this.belongsTo(this.contextModel, 'owner_id'),\n        }\n    }\n\n    get owner() {\n        return this.constructor.contextModel.find(this.owner_id)\n    }\n}\n\nclass Subscription extends Owned {\n    static get entity() { return 'subscriptions' }\n\n    static fields() {\n        return { ...super.fields(),\n            status: this.number(),\n            access: this.number(),\n            role: this.number(),\n        }\n    }\n}\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/models.js?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        messages: { type: Object },\n        item: { type: Object },\n    },\n\n    computed: {\n        modifiedString() {\n            let date = this.item.modifiedDate;\n            return date ? date.toLocaleDateString() + ' ' + date.toLocaleTimeString()\n                        : '';\n        }\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/content.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var pepr_core_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pepr/core/components */ \"./assets/core/components/index.js\");\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    extends: pepr_core_components__WEBPACK_IMPORTED_MODULE_0__.Form,\n    props: {\n        context: Object,\n        item: Object,\n    },\n\n    computed: {\n        consts() {\n            return this.$root.consts\n        },\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentForm.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var pepr_core_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pepr/core/components */ \"./assets/core/components/index.js\");\n/* harmony import */ var _content__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./content */ \"./assets/content/components/content.vue\");\n\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        model: Function,\n        context: Object,\n        contextUrl: String,\n        apiUrl: String,\n        showForm: Boolean,\n    },\n\n    components: {\n        ...pepr_core_components__WEBPACK_IMPORTED_MODULE_0__.default, ..._content__WEBPACK_IMPORTED_MODULE_1__.default\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentList.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-cookie */ \"./node_modules/js-cookie/src/js.cookie.js\");\n/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(js_cookie__WEBPACK_IMPORTED_MODULE_0__);\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        model: Function,\n        item: Object,\n        apiUrl: String,\n        action: String,\n        method: {type:String, default:'POST'},\n    },\n\n    computed: {\n        targetMethod() {\n            return this.item ? 'PUT' : this.method\n        },\n\n        targetUrl() {\n            return this.item ? this.item.api_url : this.apiUrl\n        },\n    },\n\n    methods: {\n        onSubmit(ev) {\n            if(!this.targetUrl || !this.model || ev.target != this.$refs.form)\n                return\n\n            ev.preventDefault()\n            ev.stopPropagation()\n\n            let data = new FormData(event.target);\n            let config = {\n                headers: {\n                    'Content-Type': 'multipart/form-data',\n                    'X-CSRFToken': js_cookie__WEBPACK_IMPORTED_MODULE_0___default().get('csrftoken'),\n                }\n            }\n            let method = this.method.toLowerCase()\n            this.model.api()[method](this.targetUrl, data, config)\n                //.reject((err) => console.error(\n                //    `XHR request to ${this.apiUrl} failed (config: ${config}): `,\n                //    error))\n        },\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/form.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({\n    props: {\n        model: Function,\n        context: Object,\n        contextUrl: String,\n        contextFilter: { type: String, default: 'context' },\n        orderBy: String,\n        apiUrl: String\n    },\n\n    computed: {\n        itemsQuery() {\n            let query = this.model.query();\n            if(this.orderBy) {\n                query = this.orderBy.startsWith('-') ?\n                        query.orderBy(this.orderBy.slice(1), 'desc') :\n                        query.orderBy(this.orderBy)\n\n            }\n            if(this.context)\n                query = query.where('context_id', this.context.pk)\n            return query\n        },\n\n        items() {\n            let items = this.itemsQuery.get()\n            return items\n        },\n    },\n\n    methods: {\n        fetchContext(url, {context=null, search={}, ...config}={}) {\n            context = context || this.context\n            if(!context)\n                return\n            let params = new URLSearchParams(search)\n            params.append(this.contextFilter, context.pk)\n            return this.fetch(`${url}?${params.toString()}`, config)\n        },\n\n        fetch(url, config={}) {\n            return this.model.api().get(url, { dataKey: 'results', ...config})\n        },\n    },\n\n    watch: {\n        context(context, oldContext) {\n            this.fetchContext(this.apiUrl, {context});\n        }\n    },\n});\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/list.vue?./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* reexport safe */ _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_contentList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__.default)\n/* harmony export */ });\n/* harmony import */ var _node_modules_vue_loader_dist_index_js_ruleSet_1_rules_5_use_0_contentList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./contentList.vue?vue&type=script&lang=js */ \"./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentList.vue?vue&type=script&lang=js\");\n \n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentList.vue?");

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

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/content.vue?vue&type=template&id=76205d44":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/content.vue?vue&type=template&id=76205d44 ***!
  \***********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { class: \"media\" }\nconst _hoisted_2 = { class: \"media-content\" }\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", _hoisted_1, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_2, [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", null, [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"strong\", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.item.owner && $props.item.owner.title || \"Anonymous\"), 1 /* TEXT */),\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"small\", null, \" — \" + (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($options.modifiedString), 1 /* TEXT */)\n      ]),\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.item.text), 1 /* TEXT */)\n    ])\n  ]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/content.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentForm.vue?vue&type=template&id=62bcd3b0":
/*!***************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentForm.vue?vue&type=template&id=62bcd3b0 ***!
  \***************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = { class: \"field\" }\nconst _hoisted_2 = { class: \"control\" }\nconst _hoisted_3 = {\n  name: \"text\",\n  class: \"textarea\"\n}\nconst _hoisted_4 = { class: \"columns\" }\nconst _hoisted_5 = { class: \"column\" }\nconst _hoisted_6 = { class: \"field is-grouped\" }\nconst _hoisted_7 = { class: \"control has-icons-left\" }\nconst _hoisted_8 = { class: \"select\" }\nconst _hoisted_9 = {\n  name: \"access\",\n  title: \"Visible to\"\n}\nconst _hoisted_10 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"span\", { class: \"icon is-left\" }, [\n  /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"i\", { class: \"mdi mdi-eye\" })\n], -1 /* HOISTED */)\nconst _hoisted_11 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createStaticVNode)(\"<div class=\\\"column\\\"><div class=\\\"field is-grouped is-grouped-right\\\"><p class=\\\"control\\\"><button type=\\\"submit\\\" class=\\\"button is-link\\\">Publish</button></p><p class=\\\"control\\\"><button type=\\\"reset\\\" class=\\\"button is-link is-light\\\">Reset</button></p></div></div>\", 1)\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"form\", {\n    ref: \"form\",\n    method: _ctx.targetMethod,\n    action: _ctx.action,\n    onSubmit: _cache[1] || (_cache[1] = (...args) => (_ctx.onSubmit && _ctx.onSubmit(...args)))\n  }, [\n    (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"default\", {\n      item: $props.item,\n      context: $props.context,\n      model: _ctx.model\n    }, () => [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"input\", {\n        type: \"hidden\",\n        name: \"context_id\",\n        value: $props.context && $props.context.pk\n      }, null, 8 /* PROPS */, [\"value\"]),\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_1, [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_2, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"textarea\", _hoisted_3, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)($props.item && $props.item.text), 1 /* TEXT */)\n        ])\n      ]),\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_4, [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_5, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_6, [\n            (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_7, [\n              (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", _hoisted_8, [\n                (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"select\", _hoisted_9, [\n                  ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($options.consts.roles, (role) => {\n                    return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"option\", {\n                      value: role.access\n                    }, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(role.name), 9 /* TEXT, PROPS */, [\"value\"]))\n                  }), 256 /* UNKEYED_FRAGMENT */))\n                ])\n              ]),\n              _hoisted_10\n            ])\n          ])\n        ]),\n        _hoisted_11\n      ])\n    ])\n  ], 40 /* PROPS, HYDRATE_EVENTS */, [\"method\", \"action\"]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentForm.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

/***/ }),

/***/ "./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentList.vue?vue&type=template&id=029abd02":
/*!***************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[5].use[0]!./assets/content/components/contentList.vue?vue&type=template&id=029abd02 ***!
  \***************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nconst _hoisted_1 = /*#__PURE__*/(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"br\", null, null, -1 /* HOISTED */)\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  const _component_p_content = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-content\")\n  const _component_p_list = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)(\"p-list\")\n\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_p_list, {\n    ref: \"list\",\n    model: $props.model,\n    context: $props.context,\n    contextUrl: $props.contextUrl,\n    \"api-url\": $props.apiUrl,\n    orderBy: \"-modifiedDate\"\n  }, {\n    item: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(({item, items, index}) => [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"item\", {\n        item: item,\n        items: items,\n        index: index\n      }, () => [\n        (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(\"div\", {\n          id: item.pk,\n          class: \"box\"\n        }, [\n          (0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_p_content, { item: item }, null, 8 /* PROPS */, [\"item\"])\n        ], 8 /* PROPS */, [\"id\"]),\n        _hoisted_1\n      ])\n    ]),\n    _: 1 /* STABLE */\n  }, 8 /* PROPS */, [\"model\", \"context\", \"contextUrl\", \"api-url\"]))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/content/components/contentList.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"render\": () => (/* binding */ render)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n\n\nfunction render(_ctx, _cache, $props, $setup, $data, $options) {\n  return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($options.items, (item, index) => {\n    return ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(\"div\", null, [\n      (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, \"item\", {\n        index: index,\n        item: item,\n        items: $options.items\n      })\n    ]))\n  }), 256 /* UNKEYED_FRAGMENT */))\n}\n\n//# sourceURL=webpack://pepr-assets/./assets/core/components/list.vue?./node_modules/vue-loader/dist/templateLoader.js??ruleSet%5B1%5D.rules%5B1%5D!./node_modules/vue-loader/dist/index.js??ruleSet%5B1%5D.rules%5B5%5D.use%5B0%5D");

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