import { motion, useInView } from "framer-motion";
import React, {
    Children,
    JSXElementConstructor,
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from "react";
import FadeInChildList from "./fade-in-child-list";

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
}: PropsWithChildren<FadeInListProps>) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount })

    const WrapperTag = isUl ? motion.ul : motion.div;

    return (
        <WrapperTag ref={ref} className={className}>
            <FadeInListContext.Provider value={{isVisible: isInView}}>
                <FadeInChildList
                    duration={duration}
                    delay={delay}
                    initialDelay={initialDelay}
                    className={childClassName}
                >{children}</FadeInChildList>
            </FadeInListContext.Provider>
        </WrapperTag>
    );
}
