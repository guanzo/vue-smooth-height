var SmoothHeight=function(e){function t(i){if(r[i])return r[i].exports;var n=r[i]={i:i,l:!1,exports:{}};return e[i].call(n.exports,n,n.exports,t),n.l=!0,n.exports}var r={};return t.m=e,t.c=r,t.d=function(e,r,i){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="build/",t(t.s=0)}([function(e,t,r){"use strict";function i(e){var t={hideOverflow:!1,property:"height"};if(e=Object.assign(t,e),!e.el)return void console.warn('Missing required property: "el"');this._registered.push(e)}function n(e){var t=this.$el,r=this._registered.findIndex(function(r){return o(t,r.el).isEqualNode(o(t,e.el))});if(-1==r)return void console.warn("Unregister failed, invalid options object");this._registered.splice(r,1)}function o(e,t){return"string"==typeof t?e.matches(t)?e:e.querySelector(t):t}function s(e){var t=e.currentTarget;if(t===e.target){var r=this.property,i=this.hideOverflow,n=this.overflowX,o=this.overflowY;t.style[r]=null,i&&(t.style.overflowX=n,t.style.overflowY=o),t.removeEventListener("transitionend",s)}}Object.defineProperty(t,"__esModule",{value:!0}),t.default={methods:{$registerElement:function(e){var t=i.bind(this);Array.isArray(e)?e.forEach(t):t(e)},$unregisterElement:function(e){var t=n.bind(this);Array.isArray(e)?e.forEach(t):t(e)}},created:function(){this._registered=[]},beforeUpdate:function(){var e=this;this._registered&&this._registered.length&&this._registered.forEach(function(t){var r=t.el,i=t.property,n=o(e.$el,r);if(t.element=n,n){var s=window.getComputedStyle(n)[i];t.beforeProperty=s}})},updated:function(){var e=this;this._registered&&this._registered.length&&this._registered.forEach(function(t){var r=t.element,i=t.property,n=t.beforeProperty,o=t.hideOverflow;e.$nextTick(function(){var e=window.getComputedStyle(r),l=e[i];if(n!=l){o&&(r.style.overflowX="hidden",r.style.overflowY="hidden"),"0s"===e.transitionDuration&&(r.style.transition="1s");var f=e.overflowY,a=e.overflowX;t.overflowX=a,t.overflowY=f,r.style[i]=n,r.offsetHeight,r.style[i]=l,r.addEventListener("transitionend",s.bind(t),{passive:!0})}})})}}}]);