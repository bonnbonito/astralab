/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/react-dom/client.js":
/*!******************************************!*\
  !*** ./node_modules/react-dom/client.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) {} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ }),

/***/ "./scripts/dashboard/components/App.tsx":
/*!**********************************************!*\
  !*** ./scripts/dashboard/components/App.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var _Row__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Row */ "./scripts/dashboard/components/Row.tsx");
/* harmony import */ var _Tabs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Tabs */ "./scripts/dashboard/components/Tabs.tsx");
/* harmony import */ var _DashboardContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DashboardContext */ "./scripts/dashboard/components/DashboardContext.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




function App() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_DashboardContext__WEBPACK_IMPORTED_MODULE_2__.DashboardContext, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Tabs__WEBPACK_IMPORTED_MODULE_1__["default"], {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "grid grid-cols-1 gap-4",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Row__WEBPACK_IMPORTED_MODULE_0__["default"], {})
    })]
  });
}

/***/ }),

/***/ "./scripts/dashboard/components/DashboardContext.tsx":
/*!***********************************************************!*\
  !*** ./scripts/dashboard/components/DashboardContext.tsx ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DashboardContext: () => (/* binding */ DashboardContext),
/* harmony export */   useDashboard: () => (/* binding */ useDashboard)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const Dashboard = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({});
const useDashboard = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(Dashboard);
const DashboardContext = ({
  children
}) => {
  const [tabActive, setTabActive] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('All');
  const [trelloCards, setTrelloCards] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(() => {
    var _dashboard$cards;
    const dashboard = window?.astralabDashboard;
    return (_dashboard$cards = dashboard?.cards) !== null && _dashboard$cards !== void 0 ? _dashboard$cards : [];
  });
  const filterCards = filter => {
    var _dashboard$cards2;
    setTabActive(filter);
    const dashboard = window?.astralabDashboard;
    const cards = (_dashboard$cards2 = dashboard?.cards) !== null && _dashboard$cards2 !== void 0 ? _dashboard$cards2 : [];
    setTrelloCards(filter === 'All' ? cards : filter === 'Recently Updated' ? [...cards].sort((a, b) => new Date(b.date_updated).getTime() - new Date(a.date_updated).getTime()) : cards.filter(card => card.meta.trello_card_list?.[0] === filter));
  };
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {}, [trelloCards]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(Dashboard.Provider, {
    value: {
      tabActive,
      setTabActive,
      trelloCards,
      setTrelloCards,
      filterCards
    },
    children: children
  });
};

/***/ }),

/***/ "./scripts/dashboard/components/Icons.js":
/*!***********************************************!*\
  !*** ./scripts/dashboard/components/Icons.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CommentIcon: () => (/* binding */ CommentIcon),
/* harmony export */   CommentUpdatedIcon: () => (/* binding */ CommentUpdatedIcon)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

const CommentIcon = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", {
  width: "17",
  height: "17",
  viewBox: "0 0 17 17",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
    d: "M0 17V1.65773C0 1.19448 0.156579 0.802384 0.469737 0.481431C0.782895 0.160477 1.16547 0 1.61746 0H15.3825C15.8345 0 16.2171 0.160477 16.5303 0.481431C16.8434 0.802384 17 1.19448 17 1.65773V12.0974C17 12.5607 16.8434 12.9528 16.5303 13.2737C16.2171 13.5947 15.8345 13.7552 15.3825 13.7552H3.16603L0 17ZM2.59474 12.3796H15.3825C15.4514 12.3796 15.5145 12.3502 15.5718 12.2914C15.6292 12.2327 15.6579 12.168 15.6579 12.0974V1.65773C15.6579 1.58712 15.6292 1.52247 15.5718 1.46378C15.5145 1.40494 15.4514 1.37552 15.3825 1.37552H1.61746C1.54857 1.37552 1.48549 1.40494 1.42822 1.46378C1.37081 1.52247 1.34211 1.58712 1.34211 1.65773V13.6495L2.59474 12.3796Z",
    fill: "#222222"
  })
});
const CommentUpdatedIcon = () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("svg", {
  width: "17",
  height: "18",
  viewBox: "0 0 17 18",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
    d: "M0 18V3.17051C0 2.72275 0.154545 2.34376 0.463636 2.03353C0.772727 1.72331 1.15033 1.56819 1.59645 1.56819H10.4649C10.4174 1.78979 10.3922 2.00997 10.3894 2.22876C10.3866 2.44754 10.4005 2.67053 10.4309 2.89774H1.59645C1.52845 2.89774 1.46619 2.92617 1.40968 2.98305C1.35301 3.03978 1.32468 3.10226 1.32468 3.17051V14.7615L2.56104 13.5341H15.1828C15.2508 13.5341 15.313 13.5056 15.3695 13.4488C15.4262 13.392 15.4545 13.3295 15.4545 13.2613V6.55065C15.7081 6.49378 15.9439 6.42102 16.1619 6.33239C16.3798 6.24375 16.5855 6.12727 16.7792 5.98294V13.2613C16.7792 13.7091 16.6247 14.088 16.3156 14.3983C16.0065 14.7085 15.6289 14.8636 15.1828 14.8636H3.12491L0 18ZM1.32468 3.17051V14.1477V2.89774V3.17051ZM14.5714 4.87499C13.8978 4.87499 13.3246 4.63781 12.852 4.16346C12.3792 3.68896 12.1429 3.11364 12.1429 2.43749C12.1429 1.76135 12.3792 1.1861 12.852 0.711748C13.3246 0.237249 13.8978 0 14.5714 0C15.2451 0 15.8182 0.237249 16.2909 0.711748C16.7636 1.1861 17 1.76135 17 2.43749C17 3.11364 16.7636 3.68896 16.2909 4.16346C15.8182 4.63781 15.2451 4.87499 14.5714 4.87499Z",
    fill: "#FF0000"
  })
});


/***/ }),

/***/ "./scripts/dashboard/components/Row.tsx":
/*!**********************************************!*\
  !*** ./scripts/dashboard/components/Row.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Row)
/* harmony export */ });
/* harmony import */ var _Icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Icons */ "./scripts/dashboard/components/Icons.js");
/* harmony import */ var _DashboardContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DashboardContext */ "./scripts/dashboard/components/DashboardContext.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function Row() {
  const {
    trelloCards
  } = (0,_DashboardContext__WEBPACK_IMPORTED_MODULE_1__.useDashboard)();
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const hasUpdates = card => {
    try {
      const activitiesString = card.meta?.trello_card_activities?.[0];
      if (!activitiesString) return false;
      return activitiesString.includes('"type":"commentCard"') && !activitiesString.includes('# **Reply');
    } catch (error) {
      console.error('Error in hasUpdates function:', error);
      return false;
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
    children: trelloCards.length > 0 ? trelloCards?.map(card => {
      var _card$meta$trello_car;
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        className: "p-4 px-6 border border-input rounded block sm:grid sm:max-lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-6 items-center justify-between gap-4",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "flex gap-2 items-center",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
            className: "font-semibold text-base uppercase",
            children: "Project Name:"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
            className: "text-sm uppercase",
            children: card.title
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "flex gap-2 items-center",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
            className: "font-semibold text-base uppercase",
            children: "Date:"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
            className: "text-sm uppercase",
            children: formatDate(card.date)
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "flex gap-2 items-center",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
            className: "font-semibold text-base uppercase",
            children: "Status:"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
            className: "text-sm uppercase",
            children: card.meta.trello_card_list
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "flex gap-2 items-center",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
            className: "font-semibold text-base uppercase",
            children: "Project ID:"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
            className: "text-sm uppercase",
            children: card.id
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
          className: "flex gap-2 items-center justify-end col-span-2",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
            className: "text-sm uppercase flex gap-2 items-center",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
              children: (_card$meta$trello_car = card.meta.trello_card_comment_count) !== null && _card$meta$trello_car !== void 0 ? _card$meta$trello_car : 0
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
              children: hasUpdates(card) ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_Icons__WEBPACK_IMPORTED_MODULE_0__.CommentUpdatedIcon, {}) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_Icons__WEBPACK_IMPORTED_MODULE_0__.CommentIcon, {})
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("a", {
            className: "text-sm uppercase p-2 px-4 border border-input text-center ml-4 rounded hover:bg-input hover:text-white max-[1024px]:w-full",
            href: card.url,
            children: "View Details"
          }), card.meta.review_studio_link && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("a", {
            className: "text-sm uppercase p-2 px-4 border bg border-input text-center ml-4 rounded hover:bg-input hover:text-white max-[1024px]:w-full",
            href: card.meta.review_studio_link,
            children: "Review Design"
          })]
        })]
      }, card.id);
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "p-4 px-6 border border-input rounded block sm:grid sm:max-lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-6 items-center justify-between gap-4 bg-gray-100",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
        children: "No orders yet"
      })
    })
  });
}

/***/ }),

/***/ "./scripts/dashboard/components/Tabs.tsx":
/*!***********************************************!*\
  !*** ./scripts/dashboard/components/Tabs.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Tabs)
/* harmony export */ });
/* harmony import */ var _DashboardContext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DashboardContext */ "./scripts/dashboard/components/DashboardContext.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function Tabs() {
  const {
    filterCards,
    tabActive
  } = (0,_DashboardContext__WEBPACK_IMPORTED_MODULE_0__.useDashboard)();
  const tabsArray = ['All', 'Recently Updated', 'To Do', 'Doing', 'Done'];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: "mt-2 flex no-wrap justify-between border-b-[#D2D2D2] border-b uppercase overflow-x-auto mb-8",
    children: tabsArray.map(tabName => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: `px-6 py-2 text-center cursor-pointer border whitespace-nowrap font-semibold ${tabActive === tabName ? 'border-t-[#D2D2D2] border-x-[#D2D2D2]' : 'border-transparent border-b-0'}`,
      onClick: () => filterCards(tabName),
      children: tabName
    }, tabName))
  });
}

/***/ }),

/***/ "@wordpress/dom-ready":
/*!**********************************!*\
  !*** external ["wp","domReady"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["domReady"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["ReactDOM"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

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
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*************************************!*\
  !*** ./scripts/dashboard/index.tsx ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/dom-ready */ "@wordpress/dom-ready");
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _components_App__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/App */ "./scripts/dashboard/components/App.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_0___default()(() => {
  const dashboardComponent = document.getElementById('dashboardComponent');
  if (dashboardComponent) {
    const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(dashboardComponent);
    root.render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_components_App__WEBPACK_IMPORTED_MODULE_2__["default"], {}));
  } else {
    console.error('Root element with id "test" not found');
  }
});
})();

/******/ })()
;
//# sourceMappingURL=dashboard.js.map