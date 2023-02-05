import { motion, useInView } from "framer-motion"
import FadeInChildren from 'react-fade-in';
import { useRef } from "react"


export interface FadeInProps {
    /** The content to be rendered */
    children: React.ReactNode

    className?: string

    /** The delay before the animation starts, default 0s */
    delay?: number
    /** The duration of the animation, 1s */
    duration?: number
    /** Does need zoom in when fade in, default is true */
    zoomIn?: boolean

    /** Should the animation play only once, default is true */
    once?: boolean
    /** The amount of the element that needs to be visible before triggering the animation, default is 'all' */
    amount?: "some" | "all" | number
}

/** Renders in normal div which will appear visible only on view */
export const FadeIn = ({
    children,
    className,
    delay = 0,
    duration = 1,
    zoomIn = true,
    once = true,
    amount = 'all'
}: FadeInProps) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once, amount })

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, scale: zoomIn ? 0.9 : 1 }}
            animate={isInView && { opacity: 1, scale: 1 }}
            transition={{
                duration,
                delay,
                ease: [0, 0.71, 0.2, 1.01]
            }}
        >
            {children}
        </motion.div>
    )
}

export default FadeIn
