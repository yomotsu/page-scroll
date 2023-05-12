/*!
 * page-scroll
 * https://github.com/yomotsu/page-scroll
 * (c) 2017 @yomotsu
 * Released under the MIT License.
 */
const isBrowser = typeof window !== 'undefined';
const scrollingElement = isBrowser ? (document.scrollingElement || document.documentElement) : null;
const easings = {
    linear(t) {
        return t;
    },
    easeOutQuad(t) {
        return t * (2 - t);
    },
    easeOutQuint(t) {
        return 1 + (--t) * t * t * t * t;
    },
    easeOutExpo(t) {
        return t == 1 ? t : 1 - Math.pow(2, -10 * t);
    },
    easeInOutBack(t) {
        const f = t < 0.5 ? 2 * t : 1 - (2 * t - 1);
        const g = Math.pow(f, 3) - f * Math.sin(f * Math.PI);
        return t < 0.5 ? 0.5 * g : 0.5 * (1 - g) + 0.5;
    }
};
function pageScroll (destination, options = {}) {
    return new Promise((resolve, reject) => {
        if (!scrollingElement) {
            reject();
            return;
        }
        const hasEl = !!options.el;
        const el = options.el || scrollingElement;
        const duration = isNumber(options.duration) ? options.duration : 500;
        const easing = options.easing || 'easeOutExpo';
        const disableInterrupt = options.disableInterrupt || false;
        let canceled = false;
        if (el instanceof HTMLElement)
            el.style.scrollBehavior = 'auto';
        const startY = el.scrollTop;
        const startTime = Date.now();
        const contentHeight = hasEl ? el.scrollHeight : getDocumentHeight();
        const containerHeight = hasEl ? el.clientHeight : getWindowHeight();
        const destinationOffset = typeof destination === 'number' ? destination :
            el === scrollingElement ? destination.getBoundingClientRect().top + window.pageYOffset :
                destination.offsetTop;
        const destinationY = contentHeight - destinationOffset < containerHeight ?
            contentHeight - containerHeight :
            destinationOffset;
        const endScrolling = () => {
            canceled = true;
            if (el instanceof HTMLElement)
                el.style.scrollBehavior = '';
            document.removeEventListener('wheel', cancelScrolling);
            document.removeEventListener('touchmove', cancelScrolling);
        };
        const cancelScrolling = () => {
            endScrolling();
            reject();
        };
        if (duration <= 0) {
            el.scrollTop = destinationY;
            resolve();
            return;
        }
        (function scroll() {
            if (canceled)
                return;
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min(1, (elapsedTime / duration));
            const timeFunction = easings[easing](progress);
            if (1 <= progress) {
                el.scrollTop = destinationY;
                endScrolling();
                resolve();
                return;
            }
            requestAnimationFrame(scroll);
            el.scrollTop = (timeFunction * (destinationY - startY)) + startY;
        })();
        if (!disableInterrupt) {
            document.addEventListener('wheel', cancelScrolling);
            document.addEventListener('touchmove', cancelScrolling);
        }
    });
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

export { pageScroll as default };
