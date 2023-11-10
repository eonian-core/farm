'use client'
import React from 'react'
import { HIWContext } from './context'
import FlowDiagram from './flow-diagram'

function FlowDiagramContextListener() {
  const { activeStep, setActiveStep, steps } = React.useContext(HIWContext)

  const diagramRef = React.useRef<FlowDiagram>(null)

  React.useEffect(() => {
    diagramRef.current?.selectPoint(activeStep)
  }, [activeStep])

  return (
    <>
      <FlowDiagram ref={diagramRef} onActiveStepChanged={setActiveStep} stepLabels={steps} />
    </>
  )
}

export default FlowDiagramContextListener
