// based on https://pawelgrzybek.com/page-scroll-in-vanilla-javascript/

const scrollingElement: Element = document.scrollingElement || document.documentElement;

const easings = {

	linear( t: number ): number {

		return t;

	},

	easeOutQuad( t: number ): number {

		return t * ( 2 - t );

	},

	easeOutQuint( t: number ): number {

		return 1 + ( -- t ) * t * t * t * t;

	},

	easeOutExpo( t: number ): number {

		return t == 1 ? t : 1 - Math.pow( 2, - 10 * t );

	},

	easeInOutBack( t: number ): number {

		const f = t < 0.5 ? 2 * t : 1 - ( 2 * t - 1 );
		const g = Math.pow( f, 3 ) - f * Math.sin( f * Math.PI );

		return t < 0.5 ? 0.5 * g : 0.5 * ( 1 - g ) + 0.5;

	}

};

type easingType = 'linear' | 'easeOutQuad' | 'easeOutQuint' | 'easeOutExpo' | 'easeInOutBack';
type destination = HTMLElement | number;
interface PageScrollOption {
	el?: HTMLElement;
	duration?: number;
	easing?: easingType;
	callback?: Function;
	allowInterrupt?: boolean;
}
interface cancelScrolling { (): void }

export default function ( destination: destination, options: PageScrollOption = {} ): cancelScrolling {

	const hasEl = !! options.el;
	const el       = options.el || scrollingElement;
	const duration = isNumber( options.duration ) ? options.duration as number : 500;
	const easing   = options.easing || 'easeOutExpo';
	const callback = options.callback || function () {};
	const allowInterrupt = options.allowInterrupt || false;

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

	const cancelScrolling = (): void => {

		canceled = true;
		document.removeEventListener( 'wheel', cancelScrolling );
		document.removeEventListener( 'touchmove', cancelScrolling );

	};

	if ( duration <= 0 ) {

		el.scrollTop = destinationY;
		callback();
		return () => {};

	}

	( function scroll() {

		if ( canceled ) return;

		const elapsedTime = Date.now() - startTime;
		const progress = Math.min( 1, ( elapsedTime / duration ) );
		const timeFunction = easings[ easing ]( progress );

		if ( 1 <= progress ) {

			el.scrollTop = destinationY;
			cancelScrolling();
			callback();
			return;

		}

		requestAnimationFrame( scroll );
		el.scrollTop = ( timeFunction * ( destinationY - startY ) ) + startY;

	} )();

	if ( allowInterrupt ) {

		document.addEventListener( 'wheel', cancelScrolling );
		document.addEventListener( 'touchmove', cancelScrolling );

	}

	return () => {

		cancelScrolling();

	};

}

function getDocumentHeight(): number {

	return Math.max(
		document.body.scrollHeight,
		document.body.offsetHeight,
		document.documentElement.clientHeight,
		document.documentElement.scrollHeight,
		document.documentElement.offsetHeight
	);

}

function getWindowHeight(): number {

	return window.innerHeight ||
		document.documentElement.clientHeight ||
		document.body.clientHeight;

}

function isNumber( value: any ): boolean {

	return ( ( typeof value === 'number' ) && ( isFinite( value ) ) );

}
