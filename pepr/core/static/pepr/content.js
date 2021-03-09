/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/content/index.js":
/*!*********************************!*\
  !*** ./assets/content/index.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var pepr_core_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pepr/core/app */ \"./assets/core/app.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./models */ \"./assets/content/models.js\");\n/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_models__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\n\nconst config = {\n    props: {\n        apiUrl: { type: String, default: '/api/' },\n    },\n}\nconst app = new pepr_core_app__WEBPACK_IMPORTED_MODULE_0__.default(config, {models: _models__WEBPACK_IMPORTED_MODULE_1__});\n\napp.load({async:true}).then(app => {\n    window.app = app;\n})\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (app);\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/content/index.js?");

/***/ }),

/***/ "./assets/content/models.js":
/*!**********************************!*\
  !*** ./assets/content/models.js ***!
  \**********************************/
/***/ (() => {

eval("throw new Error(\"Module parse failed: Unexpected token (3:7)\\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\\n| import { Owned, Context, Subscription } from 'pepr/core/models'\\n| \\n> export Subscription;\\n| \\n| export class Container extends Context {\");\n\n//# sourceURL=webpack://pepr-assets/./assets/content/models.js?");

/***/ }),

/***/ "./assets/core/app.js":
/*!****************************!*\
  !*** ./assets/core/app.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"defaultConfig\": () => (/* binding */ defaultConfig),\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ \"./node_modules/vue/dist/vue.esm-browser.js\");\n/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuex */ \"./node_modules/vuex/dist/vuex.esm.js\");\n/* harmony import */ var _vuex_orm_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vuex-orm/core */ \"./node_modules/@vuex-orm/core/dist/vuex-orm.esm.js\");\n/* harmony import */ var _vuex_orm_plugin_axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @vuex-orm/plugin-axios */ \"./node_modules/@vuex-orm/plugin-axios/dist/vuex-orm-axios.esm-browser.js\");\n\n\n\n\n\n\nconst defaultConfig = {\n    el: '#app',\n    delimiters: ['[[', ']]'],\n}\n\n\n//! Application class for used in Pepr.\n//!\n//! Provides:\n//! - Vue application config and load with promises\n//! - Load remote page and reload application, handling history\n//! - Vuex store and Vuex-ORM models\n//\nclass App {\n    constructor(config={}, {storeConfig=null,models={}}={} ) {\n        this.title = null;\n        this.app = null;\n\n        this.config = config;\n        this.storeConfig = storeConfig;\n        this.models = models;\n    }\n\n    get config() {\n        return this._config;\n    }\n\n    set config(config) {\n        for(var k of new Set([...Object.keys(config || {}), ...Object.keys(defaultConfig)])) {\n            if(config[k] === undefined && defaultConfig[k])\n                config[k] = defaultConfig[k]\n            else if(config[k] instanceof Object)\n                config[k] = {...defaultConfig[k], ...config[k]}\n        }\n\n        var self = this;\n        config['computed'] = {\n            app() { return self },\n            ...config['computed'],\n        }\n        this._config = value;\n    }\n\n    /// Add Vuex Store to config if required (when store config is null)\n    addStore(config) {\n        if(this.storeConfig!==null || Object.keys(this.models).length) {\n            // ensure Vue uses Vuex\n            vue__WEBPACK_IMPORTED_MODULE_0__.default.use(vuex__WEBPACK_IMPORTED_MODULE_1__.default);\n\n            let storeConfig = { ...this.storeConfig };\n            if(self.models) {\n                // use VuexOrm and VuexORMAxios: add database to store\n                _vuex_orm_core__WEBPACK_IMPORTED_MODULE_2__.default.use(_vuex_orm_plugin_axios__WEBPACK_IMPORTED_MODULE_3__.default, { axios })\n\n                const database = new _vuex_orm_core__WEBPACK_IMPORTED_MODULE_2__.default.Database()\n                const computed = { ...config.computed }\n                for(let modelName in self.models) {\n                    var model = self.models[modelName]\n                    database.register(model)\n                    if(!computed[model.name])\n                        computed[model.name] = function() {\n                            return this.$store.$db.model(model.entity)\n                        }\n                }\n                config.computed = computed\n                storeConfig.plugins = [ ...storeConfig.plugins, _vuex_orm_core__WEBPACK_IMPORTED_MODULE_2__.default.install(database) ]\n            }\n            config.store = VuexStore(storeConfig);\n        }\n        return config\n    }\n\n    /// Destroy application\n    destroy() {\n        self.app && self.app.$destroy();\n        self.app = null;\n    }\n\n    /// Fetch application from server and load.\n    /// TODO/FIXME: handling new application config and models etc.\n    fetch(url, {el='app', ...options}={}) {\n        return fetch(url, options).then(response => response.text())\n            .then(content => {\n                let doc = new DOMParser().parseFromString(content, 'text/html');\n                let app = doc.getElementById('app');\n                content = app ? app.innerHTML : content;\n                return this.load({sync: true, content, title: doc.title, url })\n            })\n    }\n\n    /// Load Vue application, updating page title and content.\n    /// Return promise resolving to Vue application.\n    load({async=false,content=null,title=null,el='app'}={}) {\n        var self = this;\n        return new Promise((resolve, reject) => {\n            let func = () => {\n                try {\n                    let config = self.config;\n                    this.addStore(config);\n\n                    const el = document.querySelector(config.el);\n                    if(!el)\n                        return reject(`Error: can't get element ${config.el}`)\n\n                    if(content)\n                        el.innerHTML = content\n                    if(title)\n                        document.title = title;\n                    this.app = new vue__WEBPACK_IMPORTED_MODULE_0__.default(config);\n                    window.scroll(0, 0);\n                    resolve(self.app)\n                } catch(error) {\n                    self.destroy();\n                    reject(error)\n                }};\n            async ? window.addEventListener('load', func) : func();\n        });\n    }\n\n    /// Save application state into browser history\n    historySave(url,replace=false) {\n        const el = document.querySelector(this.config.el);\n        const state = {\n            // TODO: el: this.config.el,\n            content: el.innerHTML,\n            title: document.title,\n        };\n\n        if(replace)\n            history.replaceState(state, '', url)\n        else\n            history.pushState(state, '', url)\n    }\n\n    /// Load application from browser history's state\n    historyLoad(state) {\n        return this.load({ content: state.content, title: state.title });\n    }\n}\n\n\n\n\n//# sourceURL=webpack://pepr-assets/./assets/core/app.js?");

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