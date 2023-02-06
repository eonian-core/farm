import { motion, useInView } from "framer-motion";
import React, {
    Children,
    JSXElementConstructor,
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from "react";

interface FadeInListProps {
    /** The delay before the animation starts, default 0.2s */
    initialDelay?: number
    /** The delay between each child, default 0.05s */
    delay?: number
    /** The duration of the animation, 0.4s */
    duration?: number

    className?: string;
    childClassName?: string;

    /** The amount of the element that needs to be visible before triggering the animation, default is 'all' */
    amount?: "some" | "all" | number

    /** Use <ul> as wrapper tag, default false */
    isUl?: boolean
    onComplete?: () => any;
}

export interface FadeInListContextState {
    isVisible: boolean
}

/** For child list animation */
export const FadeInListContext = React.createContext<FadeInListContextState>({
    isVisible: false
})

export const useFadeInListContext = () => React.useContext(FadeInListContext)

export default function FadeInList({
    duration = 0.4,
    delay = 0.05,
    initialDelay = 0.2,
    children,
    className,
    childClassName,
    amount = 0.9,
    isUl,
    onComplete
}: PropsWithChildren<FadeInListProps>) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount })
    const delayedIsInView = useDelay(toMs(initialDelay), isInView)

    const [maxIsVisible, setMaxIsVisible] = useState(0);

    useEffect(() => {
        let count = Children.count(children);
        if (!delayedIsInView) {
            // Animate all children out
            count = 0;
        }

        if (count == maxIsVisible) {
            // We're done updating maxVisible, notify when animation is done
            const timeout = setTimeout(() => {
                onComplete && onComplete();
            }, toMs(duration));
            return () => clearTimeout(timeout);
        }

        // Move maxIsVisible toward count
        const increment = count > maxIsVisible ? 1 : -1;
        const timeout = setTimeout(() => {
            setMaxIsVisible(maxIsVisible + increment);
        }, toMs(delay));

        return () => clearTimeout(timeout);
    }, [
        Children.count(children),
        delay,
        maxIsVisible,
        delayedIsInView,
        duration,
        onComplete
    ]);

    const WrapperTag = isUl ? motion.ul : motion.div;

    return (
        <WrapperTag ref={ref} className={className}>
            <FadeInListContext.Provider value={{isVisible: delayedIsInView}}>
                {Children.map(children, (child, i) => (
                    <div
                        className={childClassName}
                        style={{
                            transition: `opacity ${duration}s, transform ${duration}s`,
                            transform: maxIsVisible > i ? "none" : "translateY(20px)",
                            opacity: maxIsVisible > i ? 1 : 0,
                        }}
                    >
                        {child}
                    </div>
                ))}
            </FadeInListContext.Provider>
        </WrapperTag>
    );
}

export const toMs = (seconds: number) => seconds * 1000

/** Add delay between change state */
export const useDelay = (delay: number, state: boolean) => {
    const [delayedState, setDelayedState] = useState(state)

    useEffect(() => {
        const timeout = setTimeout(() => setDelayedState(state), delay)
        return () => clearTimeout(timeout)
    }, [state, delay])

    return delayedState
}