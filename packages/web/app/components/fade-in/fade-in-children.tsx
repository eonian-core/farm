

import { useInView } from "framer-motion"
import FadeIn from 'react-fade-in';
import { useEffect, useRef, useState } from "react"


export interface FadeInChildrenProps {
    /** The content to be rendered */
    children: React.ReactNode

    className?: string
    childClassName?: string

    /** The delay before the animation starts, default 0.2s */
    initialDelay?: number
    /** The delay between each child, default 0.05s */
    delay?: number
    /** The duration of the animation, 0.4s */
    duration?: number
    /** The amount of the element that needs to be visible before triggering the animation, default is 'all' */
    amount?: "some" | "all" | number

    /** Use <ul> as wrapper tag, default false */
    isUl?: boolean

}

/** Renders in normal div which children fade in sequentaly one by one */
export const FadeInChildren = ({
    children,
    className,
    childClassName,
    delay = 0.05,
    duration = 0.4,
    initialDelay = 0.2,
    amount = 'all',
    isUl = false
}: FadeInChildrenProps) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount })
    const delayedIsInView = useDelay(toMs(initialDelay), isInView)

    return (
        <FadeIn 
            className={className} 
            childClassName={childClassName}
            delay={toMs(delay)} 
            visible={delayedIsInView} 
            transitionDuration={toMs(duration)}
            wrapperTag={props => (
                isUl 
                    ? <ul {...props} ref={ref} /> 
                    : <div {...props} ref={ref} />
            )}
        >
            {children}
        </FadeIn>
    )

}

export default FadeInChildren

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