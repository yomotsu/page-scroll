/*!
 * page-scroll
 * https://github.com/yomotsu/page-scroll
 * (c) 2017 @yomotsu
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.pageScroll = factory());
}(this, (function () { 'use strict';

	var isBrowser = typeof window !== 'undefined';
	var scrollingElement = isBrowser ? (document.scrollingElement || document.documentElement) : null;
	var easings = {
	    linear: function (t) {
	        return t;
	    },
	    easeOutQuad: function (t) {
	        return t * (2 - t);
	    },
	    easeOutQuint: function (t) {
	        return 1 + (--t) * t * t * t * t;
	    },
	    easeOutExpo: function (t) {
	        return t == 1 ? t : 1 - Math.pow(2, -10 * t);
	    },
	    easeInOutBack: function (t) {
	        var f = t < 0.5 ? 2 * t : 1 - (2 * t - 1);
	        var g = Math.pow(f, 3) - f * Math.sin(f * Math.PI);
	        return t < 0.5 ? 0.5 * g : 0.5 * (1 - g) + 0.5;
	    }
	};
	function pageScroll (destination, options) {
	    if (options === void 0) { options = {}; }
	    if (!scrollingElement)
	        return function () { };
	    var hasEl = !!options.el;
	    var el = options.el || scrollingElement;
	    var duration = isNumber(options.duration) ? options.duration : 500;
	    var easing = options.easing || 'easeOutExpo';
	    var callback = options.callback || function () { };
	    var allowInterrupt = options.allowInterrupt || false;
	    var canceled = false;
	    var startY = el.scrollTop;
	    var startTime = Date.now();
	    var contentHeight = hasEl ? el.scrollHeight : getDocumentHeight();
	    var containerHeight = hasEl ? el.clientHeight : getWindowHeight();
	    var destinationOffset = typeof destination === 'number' ? destination :
	        el === scrollingElement ? destination.getBoundingClientRect().top + window.pageYOffset :
	            destination.offsetTop;
	    var destinationY = contentHeight - destinationOffset < containerHeight ?
	        contentHeight - containerHeight :
	        destinationOffset;
	    var cancelScrolling = function () {
	        canceled = true;
	        document.removeEventListener('wheel', cancelScrolling);
	        document.removeEventListener('touchmove', cancelScrolling);
	    };
	    if (duration <= 0) {
	        el.scrollTop = destinationY;
	        callback();
	        return function () { };
	    }
	    (function scroll() {
	        if (canceled)
	            return;
	        var elapsedTime = Date.now() - startTime;
	        var progress = Math.min(1, (elapsedTime / duration));
	        var timeFunction = easings[easing](progress);
	        if (1 <= progress) {
	            el.scrollTop = destinationY;
	            cancelScrolling();
	            callback();
	            return;
	        }
	        requestAnimationFrame(scroll);
	        el.scrollTop = (timeFunction * (destinationY - startY)) + startY;
	    })();
	    if (allowInterrupt) {
	        document.addEventListener('wheel', cancelScrolling);
	        document.addEventListener('touchmove', cancelScrolling);
	    }
	    return function () {
	        cancelScrolling();
	    };
	}
	function getDocumentHeight() {
	    return Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
	}
	function getWindowHeight() {
	    return window.innerHeight ||
	        document.documentElement.clientHeight ||
	        document.body.clientHeight;
	}
	function isNumber(value) {
	    return ((typeof value === 'number') && (isFinite(value)));
	}

	return pageScroll;

})));
