'use client'

import type { MotionStyle, MotionValue } from 'framer-motion'
import { motion, useSpring, useTransform, useWillChange } from 'framer-motion'
import clsx from 'clsx'
import { useWindowSize } from '../resize-hooks/useWindowSize'
import { useScrollYContext } from './parallax-container'
import styles from './parallax-block.module.scss'
import type { Numberimits } from './alignToLimits'
import { alignToLimits } from './alignToLimits'

export interface ParallaxBlockProps {
  x: number
  y: number
  /** Multiplier how to increase size of the block, 1 by default */
  scale?: number
  children: React.ReactNode
  styles?: MotionStyle
  spring?: Motion.SpringOptions
  className?: string
  sizeLimits?: Numberimits
}

export function ParallaxBlock({
  x,
  y,
  scale = 1,
  styles: motionStyles = {},
  spring,
  className,
  children,
  sizeLimits = {},
}: ParallaxBlockProps) {
  const { width = 1 } = useWindowSize()
  const size = alignToLimits(width * scale, sizeLimits)
  const halfSize = size / 2

  const scrollYProgress = useScrollYContext()!
  const newY = useParallaxProgress(scrollYProgress, halfSize, scale, spring)

  const willChange = useWillChange()
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
        ...motionStyles,
      }}
    >
      {children}
    </motion.div>
  )
}

/** Use scroll progress to calculate new y position of parallax block */
export function useParallaxProgress(scrollYProgress: MotionValue<number>,
  halfSize: number,
  scale: number,
  spring: Motion.SpringOptions = {}) {
  const diff = halfSize * scale * 10

  const transform = useTransform(scrollYProgress, [1, 0], [-diff, diff])

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return useSpring(transform, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
    ...spring,
  })
}

export default ParallaxBlock
