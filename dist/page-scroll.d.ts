declare type easingType = 'linear' | 'easeOutQuad' | 'easeOutQuint' | 'easeOutExpo' | 'easeInOutBack';
declare type destination = HTMLElement | number;
interface PageScrollOption {
    el?: HTMLElement;
    duration?: number;
    easing?: easingType;
    callback?: Function;
    allowInterrupt?: boolean;
}
interface cancelScrolling {
    (): void;
}
export default function (destination: destination, options?: PageScrollOption): cancelScrolling;
export {};
