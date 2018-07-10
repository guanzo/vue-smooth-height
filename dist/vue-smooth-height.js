(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["vue-smooth-height"] = factory();
	else
		root["vue-smooth-height"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/parse-css-transition/index.js":
/*!****************************************************!*\
  !*** ./node_modules/parse-css-transition/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const toMillies = __webpack_require__(/*! ./to-millies */ "./node_modules/parse-css-transition/to-millies.js");

function isTime(value) {
  return /^-?(0?\.)?\d+m?s$/.test(value);
}

function parseSingleTransition(transition) {
  const [
    name,
    duration,
    timingFunctionOrDelay,
    delay,
  ] = transition
    .split(/\s+/)

  if (isTime(timingFunctionOrDelay)) {
    return {
      delay: toMillies(timingFunctionOrDelay),
      duration: toMillies(duration),
      name,
    };
  }

  return {
    delay: toMillies(delay),
    duration: toMillies(duration),
    name,
    timingFunction: timingFunctionOrDelay,
  };
}

function parseCssTransition(transition) {
  return transition
    .split(',')
    .map(value => value.trim())
    .filter(value => value.length > 0)
    .map(parseSingleTransition);
}

module.exports = parseCssTransition;


/***/ }),

/***/ "./node_modules/parse-css-transition/to-millies.js":
/*!*********************************************************!*\
  !*** ./node_modules/parse-css-transition/to-millies.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {


function toMillies(value) {
  if (!value) {
    return;
  }

  const isMillies = value.endsWith('ms');

  return parseFloat(value) * (isMillies ? 1 : 1000);
}

module.exports = toMillies;


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _parseCssTransition = _interopRequireDefault(__webpack_require__(/*! parse-css-transition */ "./node_modules/parse-css-transition/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var mixin = {
  methods: {
    $smoothElement: function $smoothElement(options) {
      var _addElement = addElement.bind(this);

      if (Array.isArray(options)) options.forEach(_addElement);else _addElement(options);
    },
    $unsmoothElement: function $unsmoothElement(options) {
      var _removeElement = removeElement.bind(this);

      if (Array.isArray(options)) options.forEach(_removeElement);else _removeElement(options);
    }
  },
  created: function created() {
    this._smoothElements = [];
  },
  beforeUpdate: function beforeUpdate() {
    var _this = this;

    if (!this._smoothElements || !this._smoothElements.length) return;

    this._smoothElements.forEach(function (e) {
      // Retrieve registered element on demand
      // El could have been hidden by v-if/v-show
      var $el = select(_this.$el, e.options.el);
      e.setBeforeHeight($el);
    });
  },
  updated: function updated() {
    var _this2 = this;

    if (!this._smoothElements || !this._smoothElements.length) return;
    this.$nextTick(function () {
      _this2._smoothElements.forEach(function (e) {
        // Retrieve registered element on demand
        // El could have been hidden by v-if/v-show
        var $el = select(_this2.$el, e.options.el);
        e.doSmoothReflow($el);
      });
    });
  }
}; // 'this' is vue component

function addElement() {
  var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!option.hasOwnProperty('el')) {
    option.el = this.$el;
  }

  this._smoothElements.push(new SmoothElement(option));
} // 'this' is vue component


function removeElement(option) {
  var root = this.$el;

  var index = this._smoothElements.findIndex(function (d) {
    return select(root, d.el) === select(root, option.el);
  });

  if (index == -1) {
    console.error("VSM_ERROR: $unsmoothElement failed due to invalid el option");
    return;
  }

  var smoothEl = this._smoothElements[index];
  smoothEl.remove();

  this._smoothElements.splice(index, 1);
}

function select(rootEl, el) {
  if (typeof el === 'string') return rootEl.matches(el) ? rootEl : rootEl.querySelector(el);else return el;
}

var iota = 0;
var STATES = Object.freeze({
  INACTIVE: iota++,
  ACTIVE: iota++
});

var SmoothElement =
/*#__PURE__*/
function () {
  function SmoothElement(options) {
    _classCallCheck(this, SmoothElement);

    options = _objectSpread({
      // Element or selector string.
      el: null,
      // User can specify a transition if they don't want to use CSS
      transition: 'height .5s',
      childTransitions: true,
      hideOverflow: false,
      debug: false
    }, options);
    Object.assign(this, {
      $el: null,
      // Resolved Element from el
      hasExistingHeightTransition: false,
      beforeHeight: null,
      afterHeight: null,
      state: STATES.INACTIVE,
      options: options
    }); // transition end callback will call endListener, so it needs the correct context

    this.endListener = this.endListener.bind(this);
  }

  _createClass(SmoothElement, [{
    key: "transition",
    value: function transition(to) {
      this.state = to;
    }
    /**
     * Indicates if the smooth transition increased or decreased the elements height
     * A positive result means the height was increased
     */

  }, {
    key: "setBeforeHeight",
    value: function setBeforeHeight($el) {
      // This property could be set by a previous update
      // Reset it so it doesn't affect the current update
      this.afterHeight = null;
      var height;

      if ($el) {
        height = $el.offsetHeight;
      }

      this.beforeHeight = height;

      if (this.state === STATES.ACTIVE) {
        this.stopTransition();
        this.log('Transition was interrupted.');
      }
    }
  }, {
    key: "doSmoothReflow",
    value: function doSmoothReflow($el) {
      var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'data update';

      if (!$el) {
        this.log("Could not find registered el.");
        return;
      }

      this.$el = $el;
      this.transition(STATES.ACTIVE);
      $el.addEventListener('transitionend', this.endListener, {
        passive: true
      });
      this.log("Height transition triggered by: ".concat(context));
      var beforeHeight = this.beforeHeight,
          options = this.options; // If this.afterHeight is set, that means doSmoothReflow() was called after
      // a nested transition finished. This check is made to ensure that
      // a height transition only occurs on a false conditional render,
      // a.k.a. an element is being hidden rather than shown.
      // VSM works normally on a true conditional render.

      var afterHeight = $el.offsetHeight;

      if (this.afterHeight != null && this.afterHeight === afterHeight) {
        this.log("Element height did not change after nested transition. Height = ".concat(afterHeight));
        this.transition(STATES.INACTIVE);
        return;
      }

      if (beforeHeight === afterHeight) {
        this.log("Element height did not change. Height = ".concat(afterHeight));
        this.transition(STATES.INACTIVE);
        return;
      }

      this.afterHeight = afterHeight;
      this.log("Previous height: ".concat(beforeHeight, " Current height: ").concat(afterHeight));
      var computedStyle = window.getComputedStyle($el);
      var parsedTransition = (0, _parseCssTransition.default)(computedStyle.transition);

      if (this.hasHeightTransition(parsedTransition)) {
        this.hasExistingHeightTransition = true;
      } else {
        this.hasExistingHeightTransition = false;
        this.addHeightTransition(parsedTransition, options.transition);
      }

      if (options.hideOverflow) {
        //save overflow properties before overwriting
        var overflowY = computedStyle.overflowY,
            overflowX = computedStyle.overflowX;
        this.overflowX = overflowX;
        this.overflowY = overflowY;
        $el.style.overflowX = 'hidden';
        $el.style.overflowY = 'hidden';
      }

      $el.style['height'] = beforeHeight + 'px';
      $el.offsetHeight; // Force reflow

      $el.style['height'] = afterHeight + 'px';
    }
  }, {
    key: "hasHeightTransition",
    value: function hasHeightTransition(parsedTransition) {
      return parsedTransition.find(function (t) {
        return ['all', 'height'].includes(t.name) && t.duration > 0;
      });
    } // Delay and Duration are in milliseconds
    // Add height transition to existing transitions.

  }, {
    key: "addHeightTransition",
    value: function addHeightTransition(parsedTransition, heightTransition) {
      var transitions = parsedTransition.map(function (t) {
        return "".concat(t.name, " ").concat(t.duration, "ms ").concat(t.timingFunction, " ").concat(t.delay, "ms");
      });
      this.$el.style.transition = _toConsumableArray(transitions).concat([heightTransition]).join(',');
    }
  }, {
    key: "endListener",
    value: function endListener(e) {
      // Transition on smooth element finished
      if (e.currentTarget === e.target) {
        if (e.propertyName === 'height') {
          this.stopTransition(); // Record the height AFTER the data change, but potentially
          // BEFORE any child transitions start.
          // Useful for cases like transition mode="out-in"

          this.setBeforeHeight(this.$el);
        }
      } // Transition on element INSIDE smooth element finished
      // heightDiff <= 0 prevents calling doSmoothReflow during a
      // transition that increases height.
      // solves the case where a nested transition duration is
      // shorter than the height transition duration, causing doSmoothReflow
      // to reflow in the middle of the height transition
      else if (this.heightDiff <= 0 && this.options.childTransitions) {
          this.doSmoothReflow(this.$el, 'child transition');
        }
    }
  }, {
    key: "stopTransition",
    value: function stopTransition() {
      var $el = this.$el,
          options = this.options,
          overflowX = this.overflowX,
          overflowY = this.overflowY,
          hasExistingHeightTransition = this.hasExistingHeightTransition;
      $el.style['height'] = null; // Change height back to auto

      if (options.hideOverflow) {
        // Restore original overflow properties
        $el.style.overflowX = overflowX;
        $el.style.overflowY = overflowY;
      } // Clean up inline transition


      if (!hasExistingHeightTransition) {
        $el.style.transition = null;
      }

      this.transition(STATES.INACTIVE);
    }
  }, {
    key: "remove",
    value: function remove() {
      this.$el.removeEventListener('transitionend', this.endListener);
    }
  }, {
    key: "log",
    value: function log(text) {
      if (this.options.debug) console.log("VSM_DEBUG: ".concat(text), this.$el);
    }
  }, {
    key: "heightDiff",
    get: function get() {
      var beforeHeight = this.beforeHeight,
          afterHeight = this.afterHeight;

      if (beforeHeight == null || afterHeight == null) {
        return 0;
      }

      return afterHeight - beforeHeight;
    }
  }]);

  return SmoothElement;
}();

var _default = mixin;
exports.default = _default;

/***/ })

/******/ });
});
//# sourceMappingURL=vue-smooth-height.js.map