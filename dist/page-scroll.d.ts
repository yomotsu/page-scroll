type easingType = 'linear' | 'easeOutQuad' | 'easeOutQuint' | 'easeOutExpo' | 'easeInOutBack';
type destination = HTMLElement | number;
interface PageScrollOption {
    el?: HTMLElement;
    duration?: number;
    easing?: easingType;
    disableInterrupt?: boolean;
}
export default function (destination: destination, options?: PageScrollOption): Promise<void>;
export {};
