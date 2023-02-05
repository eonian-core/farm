

import { useInView } from "framer-motion"
import FadeIn from 'react-fade-in';
import { useEffect, useRef, useState } from "react"


export interface FadeInChildrenProps {
    /** The content to be rendered */
    children: React.ReactNode

    className?: string

    /** The delay before the animation starts, default 0.2s */
    initialDelay?: number
    /** The delay between each child, default 0.05s */
    delay?: number
    /** The duration of the animation, 0.4s */
    duration?: number
    /** The amount of the element that needs to be visible before triggering the animation, default is 'all' */
    amount?: "some" | "all" | number

}

/** Renders in normal div which children fade in sequentaly one by one */
export const FadeInChildren = ({
    children,
    className,
    delay = 0.05,
    duration = 0.4,
    initialDelay = 0.2,
    amount = 'all'
}: FadeInChildrenProps) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount })
    const delayedIsInView = useDelay(toMs(initialDelay), isInView)

    return (
        <div ref={ref}>
            <FadeIn 
                className={className} 
                delay={toMs(delay)} 
                visible={delayedIsInView} 
                transitionDuration={toMs(duration)}
                >
                {children}
            </FadeIn>
        </div>
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