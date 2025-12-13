/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/link */ \"./node_modules/next/link.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n// pages/_app.js\n\n\n\n\nfunction Layout({ children }) {\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n    const navItems = [\n        {\n            href: \"/\",\n            label: \"Prices\"\n        },\n        {\n            href: \"/portfolio\",\n            label: \"Portfolio\"\n        },\n        {\n            href: \"/alerts\",\n            label: \"Alerts\"\n        },\n        {\n            href: \"/watchlist\",\n            label: \"Watchlist\"\n        },\n        {\n            href: \"/charts\",\n            label: \"Charts\"\n        },\n        {\n            href: \"/learn\",\n            label: \"Learn\"\n        }\n    ];\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"nav\", {\n                className: \"nav\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"logo\",\n                        children: \"Precious Metals\"\n                    }, void 0, false, {\n                        fileName: \"/Users/edwardlee/Documents/precious-metals-mvp/pages/_app.js\",\n                        lineNumber: 20,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"nav-links\",\n                        children: navItems.map((item)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(next_link__WEBPACK_IMPORTED_MODULE_2__, {\n                                href: item.href,\n                                legacyBehavior: true,\n                                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"a\", {\n                                    className: router.pathname === item.href ? \"active-nav\" : \"\",\n                                    children: item.label\n                                }, void 0, false, {\n                                    fileName: \"/Users/edwardlee/Documents/precious-metals-mvp/pages/_app.js\",\n                                    lineNumber: 24,\n                                    columnNumber: 15\n                                }, this)\n                            }, item.href, false, {\n                                fileName: \"/Users/edwardlee/Documents/precious-metals-mvp/pages/_app.js\",\n                                lineNumber: 23,\n                                columnNumber: 13\n                            }, this))\n                    }, void 0, false, {\n                        fileName: \"/Users/edwardlee/Documents/precious-metals-mvp/pages/_app.js\",\n                        lineNumber: 21,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/edwardlee/Documents/precious-metals-mvp/pages/_app.js\",\n                lineNumber: 19,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"main\", {\n                className: \"container\",\n                children: children\n            }, void 0, false, {\n                fileName: \"/Users/edwardlee/Documents/precious-metals-mvp/pages/_app.js\",\n                lineNumber: 33,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"footer\", {\n                className: \"footer\",\n                children: \"\\xa9 2025 Precious Metals Tracker – All rights reserved.\"\n            }, void 0, false, {\n                fileName: \"/Users/edwardlee/Documents/precious-metals-mvp/pages/_app.js\",\n                lineNumber: 34,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Layout, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"/Users/edwardlee/Documents/precious-metals-mvp/pages/_app.js\",\n            lineNumber: 44,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/edwardlee/Documents/precious-metals-mvp/pages/_app.js\",\n        lineNumber: 43,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsZ0JBQWdCOztBQUNlO0FBQ0Y7QUFDVztBQUV4QyxTQUFTRSxPQUFPLEVBQUVDLFFBQVEsRUFBRTtJQUMxQixNQUFNQyxTQUFTSCxzREFBU0E7SUFDeEIsTUFBTUksV0FBVztRQUNmO1lBQUVDLE1BQU07WUFBS0MsT0FBTztRQUFTO1FBQzdCO1lBQUVELE1BQU07WUFBY0MsT0FBTztRQUFZO1FBQ3pDO1lBQUVELE1BQU07WUFBV0MsT0FBTztRQUFTO1FBQ25DO1lBQUVELE1BQU07WUFBY0MsT0FBTztRQUFZO1FBQ3pDO1lBQUVELE1BQU07WUFBV0MsT0FBTztRQUFTO1FBQ25DO1lBQUVELE1BQU07WUFBVUMsT0FBTztRQUFRO0tBQ2xDO0lBRUQscUJBQ0U7OzBCQUNFLDhEQUFDQztnQkFBSUMsV0FBVTs7a0NBQ2IsOERBQUNDO3dCQUFJRCxXQUFVO2tDQUFPOzs7Ozs7a0NBQ3RCLDhEQUFDQzt3QkFBSUQsV0FBVTtrQ0FDWkosU0FBU00sR0FBRyxDQUFDLENBQUNDLHFCQUNiLDhEQUFDWixzQ0FBSUE7Z0NBQWlCTSxNQUFNTSxLQUFLTixJQUFJO2dDQUFFTyxjQUFjOzBDQUNuRCw0RUFBQ0M7b0NBQ0NMLFdBQVdMLE9BQU9XLFFBQVEsS0FBS0gsS0FBS04sSUFBSSxHQUFHLGVBQWU7OENBRXpETSxLQUFLTCxLQUFLOzs7Ozs7K0JBSkpLLEtBQUtOLElBQUk7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBVTFCLDhEQUFDVTtnQkFBS1AsV0FBVTswQkFBYU47Ozs7OzswQkFDN0IsOERBQUNjO2dCQUFPUixXQUFVOzBCQUFTOzs7Ozs7OztBQUtqQztBQUVBLFNBQVNTLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUU7SUFDckMscUJBQ0UsOERBQUNsQjtrQkFDQyw0RUFBQ2lCO1lBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7QUFHOUI7QUFFQSxpRUFBZUYsS0FBS0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3ByZWNpb3VzLW1ldGFscy1tdnAvLi9wYWdlcy9fYXBwLmpzP2UwYWQiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gcGFnZXMvX2FwcC5qc1xuaW1wb3J0IFwiLi4vc3R5bGVzL2dsb2JhbHMuY3NzXCI7XG5pbXBvcnQgTGluayBmcm9tIFwibmV4dC9saW5rXCI7XG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tIFwibmV4dC9yb3V0ZXJcIjtcblxuZnVuY3Rpb24gTGF5b3V0KHsgY2hpbGRyZW4gfSkge1xuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKTtcbiAgY29uc3QgbmF2SXRlbXMgPSBbXG4gICAgeyBocmVmOiBcIi9cIiwgbGFiZWw6IFwiUHJpY2VzXCIgfSxcbiAgICB7IGhyZWY6IFwiL3BvcnRmb2xpb1wiLCBsYWJlbDogXCJQb3J0Zm9saW9cIiB9LFxuICAgIHsgaHJlZjogXCIvYWxlcnRzXCIsIGxhYmVsOiBcIkFsZXJ0c1wiIH0sXG4gICAgeyBocmVmOiBcIi93YXRjaGxpc3RcIiwgbGFiZWw6IFwiV2F0Y2hsaXN0XCIgfSxcbiAgICB7IGhyZWY6IFwiL2NoYXJ0c1wiLCBsYWJlbDogXCJDaGFydHNcIiB9LFxuICAgIHsgaHJlZjogXCIvbGVhcm5cIiwgbGFiZWw6IFwiTGVhcm5cIiB9LFxuICBdO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxuYXYgY2xhc3NOYW1lPVwibmF2XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibG9nb1wiPlByZWNpb3VzIE1ldGFsczwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdi1saW5rc1wiPlxuICAgICAgICAgIHtuYXZJdGVtcy5tYXAoKGl0ZW0pID0+IChcbiAgICAgICAgICAgIDxMaW5rIGtleT17aXRlbS5ocmVmfSBocmVmPXtpdGVtLmhyZWZ9IGxlZ2FjeUJlaGF2aW9yPlxuICAgICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17cm91dGVyLnBhdGhuYW1lID09PSBpdGVtLmhyZWYgPyBcImFjdGl2ZS1uYXZcIiA6IFwiXCJ9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7aXRlbS5sYWJlbH1cbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbmF2PlxuICAgICAgPG1haW4gY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+e2NoaWxkcmVufTwvbWFpbj5cbiAgICAgIDxmb290ZXIgY2xhc3NOYW1lPVwiZm9vdGVyXCI+XG4gICAgICAgIMKpIDIwMjUgUHJlY2lvdXMgTWV0YWxzIFRyYWNrZXIg4oCTIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gICAgICA8L2Zvb3Rlcj5cbiAgICA8Lz5cbiAgKTtcbn1cblxuZnVuY3Rpb24gTXlBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9KSB7XG4gIHJldHVybiAoXG4gICAgPExheW91dD5cbiAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cbiAgICA8L0xheW91dD5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTXlBcHA7XG4iXSwibmFtZXMiOlsiTGluayIsInVzZVJvdXRlciIsIkxheW91dCIsImNoaWxkcmVuIiwicm91dGVyIiwibmF2SXRlbXMiLCJocmVmIiwibGFiZWwiLCJuYXYiLCJjbGFzc05hbWUiLCJkaXYiLCJtYXAiLCJpdGVtIiwibGVnYWN5QmVoYXZpb3IiLCJhIiwicGF0aG5hbWUiLCJtYWluIiwiZm9vdGVyIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./pages/_app.js")));
module.exports = __webpack_exports__;

})();