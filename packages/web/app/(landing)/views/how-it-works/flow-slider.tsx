import React from 'react'
import { useOnResizeEffect } from '../../../components/resize-hooks/useOnResizeEffect'
import { HIW_ANIMATION_DURATION, HIW_ITEM_WIDTH } from './constants'
import styles from './flow-slider.module.scss'
import { HIWContext } from './context'

interface Props {
  children: React.ReactNode
}

const FlowSlider: React.FC<Props> = ({ children }) => {
  const { steps, activeStep } = React.useContext(HIWContext)

  const ref = React.useRef<HTMLDivElement>(null)

  const [offsetX, setOffsetX] = React.useState(0)
  const [translateX, setTranslateX] = React.useState(0)
  const [visibleSteps, setVisibleSteps] = React.useState(1)

  useOnResizeEffect(() => {
    const { current: container } = ref
    if (!container) {
      return
    }

    const { width: containerWidth } = container.getBoundingClientRect()
    const visibleOnScreen = Math.max(Math.floor(containerWidth / HIW_ITEM_WIDTH), 1)
    setVisibleSteps(visibleOnScreen)

    const visiblePart = visibleOnScreen * HIW_ITEM_WIDTH
    const offset = (containerWidth - visiblePart) / 2
    setOffsetX(offset)
  }, [])

  React.useEffect(() => {
    const { current: container } = ref
    const itemElement = document.getElementById(activeStep)
    if (!container || !itemElement) {
      return
    }

    const index = steps.indexOf(activeStep)
    const translateN = visibleSteps >= 3 ? Math.max(Math.min(index - 1, steps.length - visibleSteps), 0) : index
    setTranslateX(-translateN * HIW_ITEM_WIDTH)
  }, [visibleSteps, activeStep, steps])

  return (
    <div
      id="diagram-slider"
      ref={ref}
      className={styles.container}
      style={{
        left: `${offsetX}px`,
        transform: `translateX(${translateX}px)`,
        transitionDuration: `${HIW_ANIMATION_DURATION}ms`,
      }}
    >
      {children}
    </div>
  )
}

export default FlowSlider
