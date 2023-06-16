declare const easings: {
    linear(t: number): number;
    easeOutQuad(t: number): number;
    easeOutQuint(t: number): number;
    easeOutExpo(t: number): number;
    easeOutBack(t: number): number;
    easeOutBounce(t: number): number;
};
type easingType = keyof typeof easings;
type destination = HTMLElement | number;
interface PageScrollOption {
    el?: HTMLElement;
    duration?: number;
    easing?: easingType;
    disableInterrupt?: boolean;
}
export default function (destination: destination, options?: PageScrollOption): Promise<void>;
export {};
