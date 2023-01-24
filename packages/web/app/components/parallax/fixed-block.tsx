'use client';

import { motion, MotionStyle, MotionValue, useSpring, useTransform, useWillChange } from "framer-motion";
import { useScrollYContext } from "./parallax-container";
import styles from './parallax-block.module.scss'
import clsx from "clsx";
import { useWindowSize } from "../resize-hooks/useWindowSize";

export interface ParallaxBlockProps {
    x: number;
    y: number;
    /** Multiplier how to increase size of the block, 1 by default */
    scale?: number;
    children: React.ReactNode;
    styles?: MotionStyle
    spring?: Motion.SpringOptions
    className?: string;
    sizeLimits?: Numberimits
}

export const FixedBlock = ({ x, y, scale = 1, styles: motionStyles = {}, spring, className, children, sizeLimits = {} }: ParallaxBlockProps) => {
    const { width = 1 } = useWindowSize()
    const size = alignToLimits(width * scale, sizeLimits);
    const halfSize = size / 2;

    const scrollYProgress = useScrollYContext()!;
    const newY = useParallaxProgress(scrollYProgress, halfSize, scale, spring);

    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1], {mixer: (from, to) => value => {
        if(value < 0.5)
            return value * 2

        return to
    }})

    const willChange = useWillChange();
    return (
        <motion.div
            className={clsx(styles.parallaxBlock, className)}

            style={{
                left: `${x * 100}%`,
                top: `${y * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                willChange,
                y: newY,
                x: -halfSize,
                opacity,
                ...motionStyles
            }}
        >
            {children}
        </motion.div>
    );
};
export default FixedBlock;

export interface Numberimits {
    max?: number
    min?: number
}

const alignToLimits = (count: number, { min, max }: Numberimits) => {
    if (min === undefined && max === undefined) {
        return count;
    }

    if (min === undefined) {
        return Math.min(count, max!);
    }

    if (max === undefined) {
        return Math.max(count, min);
    }

    return Math.max(Math.min(count, max), min);
}

/** Use scroll progress to calculate new y position of parallax block */
export const useParallaxProgress = (scrollYProgress: MotionValue<number>, halfSize: number, scale: number, spring: Motion.SpringOptions = {}) => {
    const diff = halfSize * scale * 10;

    const transform = useTransform(
        scrollYProgress,
        [0, 1],
        [0, 1000],
        {mixer: (from, to) => value => {
            console.log('value', value, from, to)
            if(value <= 0.5)
                return value * to

            return to / 2;
        }}
    );

    console.log(transform, scrollYProgress)

    return transform
}

