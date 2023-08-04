// based on https://pawelgrzybek.com/page-scroll-in-vanilla-javascript/

const isBrowser = typeof window !== 'undefined';
const scrollingElement: Element | null = isBrowser ? ( document.scrollingElement || document.documentElement ) : null;

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

	easeOutBack( t: number ): number {

		const c1 = 1.70158;
		const c3 = c1 + 1;
		return 1 + c3 * Math.pow( t - 1, 3 ) + c1 * Math.pow( t - 1, 2 );

	},

	easeOutBounce( t: number ): number {

		const n1 = 7.5625;
		const d1 = 2.75;

		if ( t < 1 / d1 ) {
			return n1 * t * t;
		} else if ( t < 2 / d1 ) {
			return n1 * ( t -= 1.5 / d1 ) * t + 0.75;
		} else if (t < 2.5 / d1) {
			return n1 * ( t -= 2.25 / d1 ) * t + 0.9375;
		} else {
			return n1 * ( t -= 2.625 / d1 ) * t + 0.984375;
		}
	}

};

type easingType = keyof typeof easings;
type destination = HTMLElement | number;
interface PageScrollOption {
	el?: HTMLElement;
	duration?: number;
	easing?: easingType;
	disableInterrupt?: boolean;
}

export default function ( destination: destination, options: PageScrollOption = {} ): Promise<void> {

	return new Promise( ( resolve, reject ) => {

		if ( ! scrollingElement ) {

			reject();
			return;

		}

		const hasEl = !! options.el;
		const el       = options.el || scrollingElement;
		const scrollPaddingTop = cssValueToNumber( window.getComputedStyle( el ).scrollPaddingTop );
		const duration = isNumber( options.duration ) ? options.duration as number : 500;
		const easing   = options.easing || 'easeOutExpo';
		const disableInterrupt = options.disableInterrupt || false;

		let canceled = false;

		const startY = el.scrollTop;
		const startTime = Date.now();

		const contentHeight = hasEl ? el.scrollHeight : getDocumentHeight();
		const containerHeight = hasEl ? el.clientHeight : getWindowHeight();
		const destinationOffset =
			typeof destination === 'number' ? destination :
			el === scrollingElement ? destination.getBoundingClientRect().top + window.pageYOffset :
			destination.offsetTop;
		const destinationY = contentHeight - destinationOffset < containerHeight ?
			contentHeight - containerHeight - scrollPaddingTop :
			destinationOffset - scrollPaddingTop;

		const endScrolling = (): void => {

			canceled = true;
			document.removeEventListener( 'wheel', cancelScrolling );
			document.removeEventListener( 'touchmove', cancelScrolling );

		};

		const cancelScrolling = (): void => {

			endScrolling();
			reject();

		};

		if ( duration <= 0 ) {

			el.scrollTo( { top: destinationY, behavior: 'instant' } );
			resolve();
			return;

		}

		( function scroll() {

			if ( canceled ) return;

			const elapsedTime = Date.now() - startTime;
			const progress = Math.min( 1, ( elapsedTime / duration ) );
			const timeFunction = easings[ easing ]( progress );

			if ( 1 <= progress ) {

				el.scrollTo( { top: destinationY, behavior: 'instant' } );
				endScrolling();
				resolve();
				return;

			}

			requestAnimationFrame( scroll );
			el.scrollTo( { top: ( timeFunction * ( destinationY - startY ) ) + startY, behavior: 'instant' } );

		} )();

		if ( ! disableInterrupt ) {

			document.addEventListener( 'wheel', cancelScrolling );
			document.addEventListener( 'touchmove', cancelScrolling );

		}

	} );

};

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

function cssValueToNumber( value: any ): number {

	if ( /(^-?[0-9]+)px$/.test( value ) ) return parseInt( value, 10 );
	return 0;

}

function isNumber( value: any ): boolean {

	return ( ( typeof value === 'number' ) && ( isFinite( value ) ) );

}
