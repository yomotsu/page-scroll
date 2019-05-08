/*!
 * page-scroll.js
 * https://github.com/yomotsu/page-scroll
 * (c) 2017 @yomotsu
 * Released under the MIT License.
 */
// based on https://pawelgrzybek.com/page-scroll-in-vanilla-javascript/

var scrollingElement = 'scrollingElement' in document ? document.scrollingElement : document.documentElement;

var easings = {
	linear: function linear(t) {

		return t;
	},
	easeOutQuad: function easeOutQuad(t) {

		return t * (2 - t);
	},
	easeOutQuint: function easeOutQuint(t) {

		return 1 + --t * t * t * t * t;
	},
	easeOutExpo: function easeOutExpo(t) {

		return t == 1 ? t : 1 - Math.pow(2, -10 * t);
	},
	easeInOutBack: function easeInOutBack(t) {

		var f = t < 0.5 ? 2 * t : 1 - (2 * t - 1);
		var g = Math.pow(f, 3) - f * Math.sin(f * Math.PI);

		return t < 0.5 ? 0.5 * g : 0.5 * (1 - g) + 0.5;
	}
};

function pageScroll (destination) {
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


	var hasEl = !!options.el;
	var el = options.el || scrollingElement;
	var duration = options.duration || 500;
	var easing = options.easing || 'easeOutExpo';
	var callback = options.callback || function () {};
	var allowInterrupt = options.allowInterrupt || false;

	var canceled = false;

	var startY = el.scrollTop;
	var startTime = Date.now();

	var contentHeight = hasEl ? el.scrollHeight : getDocumentHeight();
	var containerHeight = hasEl ? el.clientHeight : getWindowHeight();
	var destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
	var destinationY = contentHeight - destinationOffset < containerHeight ? contentHeight - containerHeight : destinationOffset;

	var cancelScrolling = function cancelScrolling() {

		canceled = true;
		document.removeEventListener('wheel', cancelScrolling);
		document.removeEventListener('touchmove', cancelScrolling);
	};

	(function scroll() {

		if (canceled) return;

		var elapsedTime = Date.now() - startTime;
		var progress = Math.min(1, elapsedTime / duration);
		var timeFunction = easings[easing](progress);

		if (1 <= progress) {

			el.scrollTop = destinationY;
			cancelScrolling();
			callback();
			return;
		}

		requestAnimationFrame(scroll);
		el.scrollTop = timeFunction * (destinationY - startY) + startY;
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

	return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

export default pageScroll;
