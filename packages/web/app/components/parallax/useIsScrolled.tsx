import { useMotionValueEvent, useScroll } from 'framer-motion'
import { useState } from 'react'

/** Returns true when page is scrolled */
export function useIsScrolled(): boolean {
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const isCurrentlyScrolled = latest > 0
    if (isCurrentlyScrolled !== isScrolled) {
      setIsScrolled(isCurrentlyScrolled)
    }
  })

  return isScrolled
}
