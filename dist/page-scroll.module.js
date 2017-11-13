/*!
 * page-scroll.js
 * https://github.com/yomotsu/page-scroll
 * (c) 2017 @yomotsu
 * Released under the MIT License.
 */
// based on https://pawelgrzybek.com/page-scroll-in-vanilla-javascript/

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

var pageScroll = function (destination, options) {

	var duration = options && options.duration || 500;
	var easing = options && options.easing || 'easeOutExpo';
	var callback = options && options.callback || function () {};

	var canceled = false;

	var startY = window.pageYOffset;
	var startTime = Date.now();

	var documentHeight = getDocumentHeight();
	var windowHeight = getWindowHeight();
	var destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
	var destinationY = documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset;

	(function scroll() {

		if (canceled) return;

		var elapsedTime = Date.now() - startTime;
		var progress = Math.min(1, elapsedTime / duration);
		var timeFunction = easings[easing](progress);

		if (1 <= progress) {

			window.scroll(0, destinationY);
			callback();
			return;
		}

		rAF(scroll);

		window.scroll(0, timeFunction * (destinationY - startY) + startY);
	})();

	return function () {

		canceled = true;
	};
};

function getDocumentHeight() {

	return Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
}

function getWindowHeight() {

	return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

function rAF(callback) {

	if (!!window.requestAnimationFrame) {

		window.requestAnimationFrame(callback);
		return;
	}

	window.setTimeout(callback, 1000 / 60);
}

export default pageScroll;
