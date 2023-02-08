import { ForwardRefComponent, motion, } from "framer-motion";
import React, {
    PropsWithChildren,
    useRef,
} from "react";
import { useInView } from "../use-in-view/use-in-view";
import FadeInChildList, { FadeInChildListProps } from "./fade-in-child-list";

export interface FadeInListProps extends FadeInWrapperProps, FadeInChildListProps {
    /** Class for children item wrappers */
    childClassName?: string;
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
    children,
    childClassName,
    ...props
}: PropsWithChildren<FadeInListProps>) {
    return (
        <FadeInWrapper {...props}>
            <FadeInChildList
                {...props}
                className={childClassName}
            >{children}</FadeInChildList>
        </FadeInWrapper>
    )
}

export interface FadeInWrapperProps extends PropsWithChildren {
    /** Use <ul> as wrapper tag, default false */
    isUl?: boolean
    /** Use <section> as wrapper tag, default false */
    isSection?: boolean

    className?: string;

    /** The amount of the element that needs to be visible before triggering the animation, default is 'all' */
    amount?: "some" | "all" | number
    /** Trigger the animation only once, default true */
    once?: boolean
}

export const FadeInWrapper = ({
    children,
    className,
    amount = 0.9,
    once = true,
    isUl,
    isSection,
}: FadeInWrapperProps) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once, amount })
    

    // Possible to pass wrapper component through props
    // but it in some situations breaks react refs on mobile 
    let WrapperTag: ForwardRefComponent<any, any> = motion.div;
    if (isUl) {
        WrapperTag = motion.ul;
    }
    if (isSection) {
        WrapperTag = motion.section;
        console.log('isInView', isInView, className, amount);
        return (
            <motion.section ref={ref} className={className}>
                <FadeInListContext.Provider value={{ isVisible: isInView }}>
                    {children}
                </FadeInListContext.Provider>
            </motion.section>
        );
    }

    return (
        <WrapperTag ref={ref} className={className}>
            <FadeInListContext.Provider value={{ isVisible: isInView }}>
                {children}
            </FadeInListContext.Provider>
        </WrapperTag>
    );
}