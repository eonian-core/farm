import React from 'react'

export interface HIWContextState {
  steps: string[]
  activeStep: string
  setActiveStep: (label: string) => void
}

export const defaultHIWContextState = {
  steps: [],
  activeStep: '',
  setActiveStep: () => {},
}

export const HIWContext = React.createContext<HIWContextState>(defaultHIWContextState)
