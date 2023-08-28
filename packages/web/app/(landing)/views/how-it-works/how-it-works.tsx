'use client'
import clsx from 'clsx'
import React from 'react'
import Container from '../../../components/contrainer/container'
import { useOnResizeEffect } from '../../../components/resize-hooks/useOnResizeEffect'
import { useInView } from '../../../components/use-in-view/use-in-view'
import { HIW_AUTOSCROLL_DURATION } from './constants'
import type { HIWContextState } from './context'
import { HIWContext, defaultHIWContextState } from './context'
import type { FlowSliderItemProps } from './flow-slider-item'
import styles from './how-it-works.module.scss'

interface Props {
  children: React.ReactNode
}

const HowItWorks: React.FC<Props> = ({ children }) => {
  const containerRef = React.useRef<HTMLElement>(null)
  const stepLabels = useStepLabels(children)

  const isInView = useInView(containerRef, { amount: 0.3 })
  const onceInView = useOnce(isInView)

  const [activeStep, setActiveStep] = React.useState(stepLabels[0])

  useOnResizeEffect(() => {
    setActiveStep(stepLabels[0])
  }, [])

  const contextValue: HIWContextState = React.useMemo(
    () => ({
      ...defaultHIWContextState,
      steps: stepLabels,
      activeStep,
      setActiveStep,
    }),
    [stepLabels, activeStep],
  )

  React.useEffect(() => {
    if (!isInView) {
      return
    }

    const interval = window.setInterval(() => {
      const index = stepLabels.indexOf(activeStep) + 1
      const nextStep = stepLabels[index >= stepLabels.length ? 0 : index]
      setActiveStep(nextStep)
    }, HIW_AUTOSCROLL_DURATION)

    return () => window.clearInterval(interval)
  }, [isInView, activeStep, stepLabels])

  return (
    <Container ref={containerRef} className={clsx(styles.container, { [styles.visible]: onceInView })}>
      <HIWContext.Provider value={contextValue}>{children}</HIWContext.Provider>
    </Container>
  )
}

export default HowItWorks

function useStepLabels(children: React.ReactNode): string[] {
  return React.useMemo(() => extractStepLabels(children), [children])
}

function extractStepLabels(children: React.ReactNode): string[] {
  const elements = React.Children.toArray(children) as React.ReactElement[]
  if (!Array.isArray(elements) || !elements.length) {
    return []
  }

  const result = []
  for (const { props } of elements) {
    if (props && 'stepLabel' in props) {
      const itemProps = props as FlowSliderItemProps
      result.push(itemProps.stepLabel)
      continue
    }

    if (props && 'children' in props) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const next = extractStepLabels(props.children)
      result.push(...next)
    }
  }
  return result
}

/** Switch state to true only once */
export function useOnce(target: boolean): boolean {
  const ref = React.useRef<boolean>(target)

  ref.current ||= target

  return ref.current
}
