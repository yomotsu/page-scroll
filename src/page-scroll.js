// based on https://pawelgrzybek.com/page-scroll-in-vanilla-javascript/

const easings = {

	linear ( t ) {

		return t;

	},

	easeOutQuad ( t ) {

		return t * ( 2 - t );

	},

	easeOutQuint ( t ) {

		return 1 + ( --t ) * t * t * t * t;

	},

	easeOutExpo: function (t) {

		return t == 1 ? t : 1 - Math.pow( 2, -10 * t );

	},

	easeInOutBack ( t ) {

		const f = t < 0.5 ? 2 * t : 1 - ( 2 * t - 1 );
		const g = Math.pow( f, 3 ) - f * Math.sin( f * Math.PI );

		return t < 0.5 ? 0.5 * g : 0.5 * ( 1 - g ) + 0.5;

	}

};

export default function ( destination, options ) {

	const duration = options && options.duration || 500;
	const easing   = options && options.easing || 'easeOutExpo';
	const callback = options && options.callback || function () {};

	let canceled = false;

	const startY = window.pageYOffset;
	const startTime = Date.now();

	const documentHeight = getDocumentHeight();
	const windowHeight   = getWindowHeight();
	const destinationOffset = typeof destination === 'number' ?
		destination :
		destination.offsetTop;
	const destinationY = documentHeight - destinationOffset < windowHeight ?
		documentHeight - windowHeight :
		destinationOffset;

	( function scroll() {

		if ( canceled ) { return; }

		const elapsedTime = Date.now() - startTime;
		const progress = Math.min( 1, ( elapsedTime / duration ) );
		const timeFunction = easings[ easing ]( progress );

		if ( window.pageYOffset === destinationY || 1 <= progress ) {

			callback();
			return;

		}

		rAF( scroll );

		window.scroll( 0, ( timeFunction * ( destinationY - startY ) ) + startY );

	} )();

	return function () { canceled = true; };

}

function getDocumentHeight () {

	return Math.max(
		document.body.scrollHeight,
		document.body.offsetHeight,
		document.documentElement.clientHeight,
		document.documentElement.scrollHeight,
		document.documentElement.offsetHeight
	);

}

function getWindowHeight () {

	return window.innerHeight ||
		document.documentElement.clientHeight ||
		document.body.clientHeight;

}

function rAF ( callback ) {

	if ( !! window.requestAnimationFrame ) {

		window.requestAnimationFrame( callback );
		return;

	}

	window.setTimeout( callback, 1000 / 60 );

};
