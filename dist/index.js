'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    methods: {
        /**
         * 
         * @param {Object | Array} options 
         */
        $registerElement: function $registerElement(options) {
            console.warn('$registerElement is deprecated. Use $registerSmoothElement instead');
            this.$registerSmoothElement(options);
        },
        $unregisterElement: function $unregisterElement(options) {
            console.warn('$unregisterElement is deprecated. Use $unregisterSmoothElement instead');
            this.$unregisterSmoothElement(options);
        },
        $registerSmoothElement: function $registerSmoothElement(options) {
            var addOption = _addOption.bind(this);
            if (Array.isArray(options)) options.forEach(addOption);else addOption(options);
        },
        $unregisterSmoothElement: function $unregisterSmoothElement(options) {
            var unregister = _unregister.bind(this);
            if (Array.isArray(options)) options.forEach(unregister);else unregister(options);
        }
    },
    created: function created() {
        this._registered = [];
    },
    beforeUpdate: function beforeUpdate() {
        var _this = this;

        if (!this._registered || !this._registered.length) return;
        this._registered.forEach(function (option) {
            var el = option.el,
                property = option.property;

            var element = select(_this.$el, el);
            option.element = element;
            if (!element) {
                return;
            }
            var computedProperty = window.getComputedStyle(element)[property];
            option.beforeProperty = computedProperty;
        });
    },
    updated: function updated() {
        var _this2 = this;

        if (!this._registered || !this._registered.length) return;
        this._registered.forEach(function (option) {
            var el = option.element,
                property = option.property,
                beforeProperty = option.beforeProperty,
                hideOverflow = option.hideOverflow;

            _this2.$nextTick(function () {
                var computedStyle = window.getComputedStyle(el);
                var afterProperty = computedStyle[property];
                if (beforeProperty == afterProperty) return;
                // TODO: get a transition parser and perform a more robust check
                // b/c you can have multiple transitions, in which case transitionDuration
                // could be '1s, 2s'
                if (computedStyle.transitionDuration === '0s') {
                    el.style.transition = '1s';
                }

                if (hideOverflow) {
                    //save overflow properties before overwriting
                    var overflowY = computedStyle.overflowY,
                        overflowX = computedStyle.overflowX;

                    option.overflowX = overflowX;
                    option.overflowY = overflowY;

                    el.style.overflowX = 'hidden';
                    el.style.overflowY = 'hidden';
                }

                el.style[property] = beforeProperty;
                el.offsetHeight; //force reflow
                el.style[property] = afterProperty;
                el.addEventListener('transitionend', listener.bind(option), { passive: true });
            });
        });
    }
};


function _addOption(option) {

    var defaultOptions = {
        hideOverflow: false,
        property: 'height'
    };

    option = Object.assign(defaultOptions, option);
    if (!option.el) {
        console.error('Missing required property: "el"');
        return;
    }
    this._registered.push(option);
}

function _unregister(option) {
    var root = this.$el;
    var index = this._registered.findIndex(function (d) {
        return select(root, d.el).isEqualNode(select(root, option.el));
    });
    if (index == -1) {
        console.error("Unregister failed, invalid options object");
        return;
    }
    this._registered.splice(index, 1);
}

function select(rootEl, el) {
    if (typeof el === 'string') {
        return rootEl.matches(el) ? rootEl : rootEl.querySelector(el);
    } else return el;
}

function listener(event) {
    var el = event.currentTarget;
    if (el !== event.target) {
        return;
    }
    var property = this.property,
        hideOverflow = this.hideOverflow,
        overflowX = this.overflowX,
        overflowY = this.overflowY;

    el.style[property] = null;
    if (hideOverflow) {
        //restore original overflow properties
        el.style.overflowX = overflowX;
        el.style.overflowY = overflowY;
    }
    el.removeEventListener('transitionend', listener);
}