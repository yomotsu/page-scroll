// based on https://pawelgrzybek.com/page-scroll-in-vanilla-javascript/

const scrollingElement = 'scrollingElement' in document ? document.scrollingElement : document.documentElement;

const easings = {

	linear( t ) {

		return t;

	},

	easeOutQuad( t ) {

		return t * ( 2 - t );

	},

	easeOutQuint( t ) {

		return 1 + ( --t ) * t * t * t * t;

	},

	easeOutExpo( t ) {

		return t == 1 ? t : 1 - Math.pow( 2, - 10 * t );

	},

	easeInOutBack( t ) {

		const f = t < 0.5 ? 2 * t : 1 - ( 2 * t - 1 );
		const g = Math.pow( f, 3 ) - f * Math.sin( f * Math.PI );

		return t < 0.5 ? 0.5 * g : 0.5 * ( 1 - g ) + 0.5;

	}

};

export default function ( destination, options = {} ) {

	const hasEl = !! options.el;
	const el       = options.el || scrollingElement;
	const duration = options.duration || 500;
	const easing   = options.easing || 'easeOutExpo';
	const callback = options.callback || function () {};

	let canceled = false;

	const startY = el.scrollTop;
	const startTime = Date.now();

	const contentHeight = hasEl ? el.scrollHeight : getDocumentHeight();
	const containerHeight = hasEl ? el.clientHeight : getWindowHeight();
	const destinationOffset = typeof destination === 'number' ?
		destination :
		destination.offsetTop;
	const destinationY = contentHeight - destinationOffset < containerHeight ?
		contentHeight - containerHeight :
		destinationOffset;

	( function scroll() {

		if ( canceled ) return;

		const elapsedTime = Date.now() - startTime;
		const progress = Math.min( 1, ( elapsedTime / duration ) );
		const timeFunction = easings[ easing ]( progress );

		if ( 1 <= progress ) {

			el.scrollTop = destinationY;
			callback();
			return;

		}

		rAF( scroll );

		el.scrollTop = ( timeFunction * ( destinationY - startY ) ) + startY;

	} )();

	return () => {

		canceled = true;

	};

}

function getDocumentHeight() {

	return Math.max(
		document.body.scrollHeight,
		document.body.offsetHeight,
		document.documentElement.clientHeight,
		document.documentElement.scrollHeight,
		document.documentElement.offsetHeight
	);

}

function getWindowHeight() {

	return window.innerHeight ||
		document.documentElement.clientHeight ||
		document.body.clientHeight;

}

function rAF( callback ) {

	if ( !! window.requestAnimationFrame ) {

		window.requestAnimationFrame( callback );
		return;

	}

	window.setTimeout( callback, 1000 / 60 );

}
