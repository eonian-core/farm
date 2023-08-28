'use client'

import React from 'react'
import LandingOnlyRadial from '../footer-radial/footer-radial'
import { useOnResizeEffect } from '../resize-hooks/useOnResizeEffect'
import styles from './sliding-footer.module.scss'

interface SlidingFooterProps {
  children: React.ReactNode
  footer: React.ReactNode
}

// Optional: set a default value to prevent scroll bar jitter
const minFooterHeight = 450

const SlidingFooter: React.FC<SlidingFooterProps> = ({ children, footer }) => {
  const footerRef = React.useRef<HTMLDivElement>(null)

  const [margin, setMargin] = React.useState(minFooterHeight)

  // Set content's margin as footer's height
  useOnResizeEffect(() => {
    const { current: footer } = footerRef
    setMargin(Math.max(footer?.offsetHeight ?? 0, minFooterHeight))
  }, [])

  return (
    <>
      <div className={styles.content} style={{ marginBottom: `${margin}px` }}>
        {children}

        <LandingOnlyRadial />
      </div>
      <div ref={footerRef} className={styles.footer} style={{ minHeight: `${minFooterHeight}px` }}>
        {footer}
      </div>
    </>
  )
}

export default SlidingFooter
