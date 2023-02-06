import { motion, useInView } from "framer-motion";
import React, {
    Children,
    JSXElementConstructor,
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from "react";
import { toMs, useDelay, useFadeInListContext } from "./fade-in-list";

interface FadeInChildListProps {
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

export default function FadeInChildList({
    duration = 0.4,
    delay = 0.05,
    initialDelay = 0.2,
    children,
    className,
    childClassName,
    amount = 0.9,
    isUl,
    onComplete
}: PropsWithChildren<FadeInChildListProps>) {
    const { isVisible } = useFadeInListContext()
    const delayedIsInView = useDelay(toMs(initialDelay), isVisible)

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
        <WrapperTag className={className}>
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
        </WrapperTag>
    );
}

