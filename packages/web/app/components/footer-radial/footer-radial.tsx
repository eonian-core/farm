import { usePathname } from 'next/navigation'
import React from 'react'
import { useOnResizeEffect } from '../resize-hooks/useOnResizeEffect'
import styles from './footer-radial.module.scss'
import RadialEffectPainter from './radial-effect-painter'

interface FooterRadialProps {
  radius?: number
}

// Show readial only in landing page
export const LandingOnlyRadial: React.FC<FooterRadialProps> = (props) => {
  const pathname = usePathname()

  if (pathname !== '/') {
    return null
  }

  return <FooterRadial {...props} />
}

export default LandingOnlyRadial

// keep without next/navigation for storybook support
export function FooterRadial({ radius = 60 }: FooterRadialProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  const [width, setWidth] = React.useState(0)
  const [height, setHeight] = React.useState(0)

  useOnResizeEffect(() => {
    const { current: container } = ref
    setWidth(container?.offsetWidth ?? 0)
    setHeight(container?.offsetHeight ?? 0)
  }, [])

  return (
    <div ref={ref} className={styles.container}>
      <RadialEffectPainter width={width} height={height} radius={radius} />
    </div>
  )
}
