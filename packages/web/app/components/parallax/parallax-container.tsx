import clsx from 'clsx'
import type { MotionValue } from 'framer-motion'
import { useScroll } from 'framer-motion'
import { createContext, useContext, useRef } from 'react'
import type { FadeInProps } from '../fade-in/fade-in'
import { FadeInBody } from '../fade-in/fade-in'
import { useInView } from '../use-in-view/use-in-view'
import styles from './parallax-container.module.scss'

const ScrollYContext = createContext<MotionValue<number> | null>(null)

/** Provides Y progress value for scroll progres over parallax container */
export const useScrollYContext = () => useContext(ScrollYContext)

export interface ParallaxContainerProps {
  children: React.ReactNode
  className?: string

  /** If true, container will fade in whel will be in view */
  fadeIn?: Omit<FadeInProps, 'children'>
}

/** Container which provides parallax context for parallax blocks */
export function ParallaxContainer({ children, className, fadeIn }: ParallaxContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const { once = true, amount = 'some' } = fadeIn || {}
  const isInView = useInView(ref, { once, amount })

  if (fadeIn) {
    return (
      <FadeInBody {...fadeIn} ref={ref} className={clsx(styles.container, className)} isInView={isInView}>
        <ScrollYContext.Provider value={scrollYProgress}>{children}</ScrollYContext.Provider>
      </FadeInBody>
    )
  }

  return (
    <div ref={ref} className={clsx(styles.container, className)}>
      <ScrollYContext.Provider value={scrollYProgress}>{children}</ScrollYContext.Provider>
    </div>
  )
}

export default ParallaxContainer
