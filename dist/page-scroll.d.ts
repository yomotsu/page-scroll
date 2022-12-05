type easingType = 'linear' | 'easeOutQuad' | 'easeOutQuint' | 'easeOutExpo' | 'easeInOutBack';
type destination = HTMLElement | number;
interface PageScrollOption {
    el?: HTMLElement;
    duration?: number;
    easing?: easingType;
    callback?: Function;
    disableInterrupt?: boolean;
}
interface cancelScrolling {
    (): void;
}
export default function (destination: destination, options?: PageScrollOption): cancelScrolling;
export {};
