import React from 'react'

import ParallaxContainer from '../../../components/parallax/parallax-container'
import ParallaxBlock from '../../../components/parallax/parallax-block'
import { ScreenName, useScreenName } from '../../../components/resize-hooks/screens'

import styles from './solution-parallax.module.scss'

const BackgroundTextScreenMap = {
  [ScreenName.ULTRA_WIDE]: { x: 0.8, y: -0.9 },
  [ScreenName.DESKTOP]: { x: 0.7, y: -0.8 },
  [ScreenName.LAPTOP]: { x: 0.9, y: -0.7 },
  [ScreenName.TABLET]: { x: 0.75, y: -0.6 },
  [ScreenName.MOBILE]: { x: 0.6, y: -0.8 },
  [ScreenName.SMALL_MOBILE]: { x: 0.4, y: -0.8 },
}

export function SolutionParallax() {
  const screen = useScreenName()
  const position = BackgroundTextScreenMap[screen || ScreenName.DESKTOP]

  return (
    <ParallaxContainer className={styles.solutionParalax}>
      <ParallaxBlock
        {...position}
        scale={0.2}
        spring={{ stiffness: 500, damping: 80, restDelta: 0.001 }}
        className={styles.backgroundTextBox}
        sizeLimits={{ min: 400, max: 600 }}
      >
        <BackgroundText>Eonian</BackgroundText>
      </ParallaxBlock>
    </ParallaxContainer>
  )
}

export default SolutionParallax

export function BackgroundText({ children }: { children: React.ReactNode }) {
  return <div className={styles.backgroundText}>{children}</div>
}
