import clsx from 'clsx'
import type { CSSProperties } from 'react'
import React from 'react'
import { HIW_ANIMATION_DURATION, HIW_ITEM_WIDTH } from './constants'
import styles from './flow-slider-item.module.scss'
import { HIWContext } from './context'

export interface FlowSliderItemProps {
  stepLabel: string
  children: React.ReactNode
}

const FlowSliderItem: React.FC<FlowSliderItemProps> = ({ stepLabel, children }) => {
  const contentRef = React.useRef<HTMLDivElement>(null)

  const { steps, activeStep, setActiveStep } = React.useContext(HIWContext)

  const handleClick = React.useCallback(() => {
    setActiveStep(stepLabel)
  }, [stepLabel, setActiveStep])

  const isActive = stepLabel === activeStep
  const activeRelativeOffsetY = useRelativeOffsetY(contentRef, [isActive])
  const numberColor = usePointColor(stepLabel)

  const distanceOpacity = React.useMemo(() => {
    const activeIndex = steps.indexOf(activeStep)
    const currentIndex = steps.indexOf(stepLabel)
    const distance = Math.abs(activeIndex - currentIndex)
    if (distance <= 1) {
      return 1.0
    }

    const fadeStep = 0.3
    return Math.max(1.0 - fadeStep * distance, 0)
  }, [stepLabel, steps, activeStep])

  const contentStyles = React.useMemo(() => {
    const styles = {
      transitionDuration: `${HIW_ANIMATION_DURATION}ms`,
      opacity: distanceOpacity,
    } as CSSProperties
    const hasOffset = isActive && activeRelativeOffsetY != null
    if (hasOffset) {
      styles.transform = `translateY(${activeRelativeOffsetY}px)`
    }

    if (numberColor) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (styles as any)['--card-number-color'] = numberColor
    }

    return styles
  }, [isActive, activeRelativeOffsetY, numberColor, distanceOpacity])

  const className = clsx(styles.container, {
    [styles.containerActive]: isActive,
  })
  return (
    <div className={className} style={{ width: `${HIW_ITEM_WIDTH}px` }} id={stepLabel}>
      <div ref={contentRef} onClick={handleClick} className={styles.wrapper} style={contentStyles}>
        <div className={styles.gradient} />
        <div className={styles.content}>
          <h3>{stepLabel}</h3>
          {children}
        </div>
      </div>
    </div>
  )
}

function usePointColor(key: string) {
  const [color, setColor] = React.useState<string | null>(null)
  React.useEffect(() => {
    const point = document.getElementById(`point-${key}`)
    const color = point?.getAttribute('data-color')
    color && setColor(color)
  }, [key])
  return color
}

function useRelativeOffsetY<T extends HTMLElement>(ref: React.RefObject<T>, deps: any[]) {
  const [offsetY, setOffsetY] = React.useState<number | null>(null)
  React.useEffect(() => {
    const { current: element } = ref
    const parent = element?.parentElement
    const diagram = document.getElementById('flow-diagram')
    if (!element || !parent || !diagram) {
      return
    }

    const { height } = element.getBoundingClientRect()
    const { height: parentHeight, y: parentY } = parent.getBoundingClientRect()
    const { y: diagramY } = diagram.getBoundingClientRect()
    const reverse = parentY > diagramY
    setOffsetY(reverse ? -parentHeight / 2 : parentHeight - height - parentHeight / 2)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return offsetY
}

export default FlowSliderItem
