(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["vue-smooth-height"] = factory();
	else
		root["vue-smooth-height"] = factory();
})(this, function() {
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _parseCssTransition = __webpack_require__(1);

var _parseCssTransition2 = _interopRequireDefault(_parseCssTransition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Vue lifecycle hook
function created() {
    this._smoothElements = [];
}

// Vue specific object
var methods = {
    $registerElement: function $registerElement(options) {
        console.warn('vue-smooth-height: $registerElement is deprecated. Use $smoothElement instead');
        this.$smoothElement(options);
    },
    $removeElementElement: function $removeElementElement(options) {
        console.warn('vue-smooth-height: $removeElementElement is deprecated. Use $unsmoothElement instead');
        this.$unsmoothElement(options);
    },
    $registerSmoothElement: function $registerSmoothElement(options) {
        console.warn('vue-smooth-height: $registerSmoothElement is deprecated. Use $smoothElement instead');
        this.$smoothElement(options);
    },
    $removeElementSmoothElement: function $removeElementSmoothElement(options) {
        console.warn('vue-smooth-height: $removeElementSmoothElement is deprecated. Use $unsmoothElement instead');
        this.$unsmoothElement(options);
    },
    $smoothElement: function $smoothElement(options) {
        var _addElement = addElement.bind(this);
        if (Array.isArray(options)) options.forEach(_addElement);else _addElement(options);
    },
    $unsmoothElement: function $unsmoothElement(options) {
        var _removeElement = removeElement.bind(this);
        if (Array.isArray(options)) options.forEach(_removeElement);else _removeElement(options);
    }
};

// 'this' is vue component
function addElement(option) {
    if (!option.el) {
        console.error('vue-smooth-height: Missing required property: "el"');
        return;
    }
    var defaultOptions = {
        el: null,
        hideOverflow: false,
        debug: false,
        hasExistingHeightTransition: false,
        transitionState: STATES.START,
        log: function log(text) {
            if (option.debug) console.log('VSM_DEBUG: ' + text);
        }
    };
    option = Object.assign(defaultOptions, option);
    option.endListener = endListener.bind(option);
    option.stopTransition = stopTransition.bind(option);
    this._smoothElements.push(option);
}

// 'this' is vue component
function removeElement(option) {
    var root = this.$el;
    var index = this._smoothElements.findIndex(function (d) {
        return select(root, d.el).isEqualNode(select(root, option.el));
    });
    if (index == -1) {
        console.error('vue-smooth-height: Remove smooth element failed due to invalid el option');
        return;
    }
    this._smoothElements.splice(index, 1);
}

function select(rootEl, el) {
    if (typeof el === 'string') return rootEl.matches(el) ? rootEl : rootEl.querySelector(el);else return el;
}

var STATES = {
    IN_PROGRESS: 1,
    ENDED: 2,
    INTERRUPTED: 3

    // Vue lifecycle hook
};function beforeUpdate() {
    var _this = this;

    if (!this._smoothElements || !this._smoothElements.length || !this.$el) return;

    this._smoothElements.forEach(function (option) {
        var el = option.el;
        // Find element during update time, instead of registration time

        var $el = select(_this.$el, el);
        if (!$el) {
            return;
        }
        option.$el = $el;
        var height = window.getComputedStyle($el)['height'];
        option.beforeHeight = height;
        if (option.transitionState === STATES.IN_PROGRESS) {
            option.stopTransition();
            option.log('Transition was interrupted.');
        }
        option.transitionState = STATES.IN_PROGRESS;
    });
}

// Vue lifecycle hook
function updated() {
    var _this2 = this;

    if (!this._smoothElements || !this._smoothElements.length || !this.$el) return;

    this._smoothElements.forEach(function (option) {
        if (!option.$el) {
            return;
        }
        _this2.$nextTick(function () {
            return doSmoothReflow(option);
        });
    });
}

function doSmoothReflow(option) {
    var $el = option.$el,
        beforeHeight = option.beforeHeight,
        hideOverflow = option.hideOverflow;


    var computedStyle = window.getComputedStyle($el);
    var afterHeight = computedStyle['height'];
    if (beforeHeight == afterHeight) {
        option.transitionState = STATES.ENDED;
        option.log('Element height did not change between render.');
        return;
    }
    option.log('Previous height: ' + beforeHeight + ' Current height: ' + afterHeight);

    var transition = computedStyle.transition;
    var parsedTransition = (0, _parseCssTransition2.default)(transition);
    if (hasHeightTransition(parsedTransition)) {
        option.hasExistingHeightTransition = true;
    } else {
        option.hasExistingHeightTransition = false;
        addHeightTransition($el, parsedTransition);
    }

    if (hideOverflow) {
        //save overflow properties before overwriting
        var overflowY = computedStyle.overflowY,
            overflowX = computedStyle.overflowX;

        option.overflowX = overflowX;
        option.overflowY = overflowY;

        $el.style.overflowX = 'hidden';
        $el.style.overflowY = 'hidden';
    }

    $el.style['height'] = beforeHeight;
    $el.offsetHeight; // Force reflow
    $el.style['height'] = afterHeight;
    $el.addEventListener('transitionend', option.endListener, { passive: true });
}

function hasHeightTransition(parsedTransition) {
    return parsedTransition.find(function (t) {
        return ['all', 'height'].includes(t.name) && t.duration > 0;
    });
}

// Delay and Duration are in milliseconds
// Add height transition to existing transitions.
function addHeightTransition($el, parsedTransition) {
    var transitions = parsedTransition.map(function (t) {
        return t.name + ' ' + t.duration + 'ms ' + t.timingFunction + ' ' + t.delay + 'ms';
    });
    $el.style.transition = transitions.join(',') + ',height 1s';
}

// 'this' is the option object
function endListener(e) {
    if (e.currentTarget !== e.target || e.propertyName !== 'height') return;
    this.stopTransition();
}

// Gets called manually if transition is interrupted
// 'this' is the options object
function stopTransition() {
    var $el = this.$el,
        hideOverflow = this.hideOverflow,
        overflowX = this.overflowX,
        overflowY = this.overflowY,
        hasExistingHeightTransition = this.hasExistingHeightTransition;


    $el.style['height'] = null; // Change height back to auto
    if (hideOverflow) {
        // Restore original overflow properties
        $el.style.overflowX = overflowX;
        $el.style.overflowY = overflowY;
    }
    // Clean up inline transition
    if (!hasExistingHeightTransition) {
        $el.style.transition = null;
    }
    $el.removeEventListener('transitionend', this.endListener);
    this.transitionState = STATES.ENDED;
}

exports.default = {
    methods: methods,
    created: created,
    beforeUpdate: beforeUpdate,
    updated: updated
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const toMillies = __webpack_require__(2);

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
/* 2 */
/***/ (function(module, exports) {


function toMillies(value) {
  if (!value) {
    return;
  }

  const isMillies = value.endsWith('ms');

  return parseFloat(value) * (isMillies ? 1 : 1000);
}

module.exports = toMillies;


/***/ })
/******/ ]);
});