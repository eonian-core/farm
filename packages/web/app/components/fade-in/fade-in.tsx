import { motion, useInView } from "framer-motion"
import FadeInChildren from 'react-fade-in';
import { useRef } from "react"


export interface FadeInProps {
    /** The content to be rendered */
    children: React.ReactNode

    className?: string

    /** The delay before the animation starts, default 0.5s */
    delay?: number
    /** The duration of the animation, 1s */
    duration?: number
    /** Does need zoom in when fade in, default is true */
    zoomIn?: boolean
}

/** Renders in normal div which will appear visible only on view */
export const FadeIn = ({
    children,
    className,
    delay = 0.5,
    duration = 1,
    zoomIn = true,
}: FadeInProps) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

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
