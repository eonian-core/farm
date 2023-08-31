'use client'

import type { MotionStyle, MotionValue } from 'framer-motion'
import { motion, useTransform, useWillChange } from 'framer-motion'
import clsx from 'clsx'
import { useWindowSize } from '../resize-hooks/useWindowSize'
import { useScrollYContext } from './parallax-container'
import styles from './parallax-block.module.scss'

export interface FixedBlockProps {
  x: number | string
  y: number | string
  children: React.ReactNode
  styles?: MotionStyle
  spring?: Motion.SpringOptions
  className?: string
  /** Point where image will stop be fixed, can be from 0 to 1. By default 0.5 */
  threshold?: number
  /** Used for calculate how fast scale must grow */
  scale?: { multiplier?: number; accselerator?: number }
}

/** Block which linked to scroll progress, it will slowly grow and becove visible on first half of container scroll. Then it will work as normal div */
export function FixedBlock({
  x,
  y,
  styles: motionStyles = {},
  threshold = 0.5,
  className,
  children,
  scale = {},
}: FixedBlockProps) {
  const scrollYProgress = useScrollYContext()!

  const opacity = useOpacityProgress(scrollYProgress, threshold)
  const { multiplier, accselerator } = scale
  const newScale = useScaleProgress(scrollYProgress, threshold, multiplier, accselerator)

  const { height } = useWindowSize()
  const newY = useFixedParallaxProgress(scrollYProgress, threshold, height)

  const willChange = useWillChange()
  return (
    <motion.div
      className={clsx(styles.parallaxBlock, className)}
      style={{
        left: typeof x === 'number' ? `${x * 100}%` : x,
        top: typeof y === 'number' ? `${y * 100}%` : y,
        y: newY,
        willChange,
        opacity,
        scale: newScale,
        ...motionStyles,
      }}
    >
      {children}
    </motion.div>
  )
}
export default FixedBlock

/** Transform scroll progress in a way that it looks stick to page on first half of the scroll */
export function useFixedParallaxProgress(scrollYProgress: MotionValue<number>, threshold = 0.5, height?: number) {
  return useTransform(scrollYProgress, [0, 1], [0, height || 1000], {
    mixer: (from, to) => (value) => {
      if (value <= threshold) {
        return value * to
      }

      return to * threshold
    },
  })
}

/** Transform scroll progress in a way that it will slowly become visible on first half of the scroll */
export function useOpacityProgress(scrollYProgress: MotionValue<number>, threshold = 0.5) {
  return useTransform(scrollYProgress, [0, 1], [0, 1], {
    mixer: (from, to) => (value) => {
      if (value < threshold) {
        return value / threshold
      }

      return to
    },
  })
}

/** Transform scroll progress in a way that it will slowly grow on first half of the scroll */
export function useScaleProgress(scrollYProgress: MotionValue<number>,
  threshold = 0.5,
  multiplier = 0.8,
  accselerator = 0.6) {
  return useTransform(scrollYProgress, [0, 1], [0, 1], {
    mixer: (from, to) => (value) => {
      if (value < threshold) {
        return value * multiplier + accselerator
      }

      return to
    },
  })
}
