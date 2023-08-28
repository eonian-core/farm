import { createSelector } from '@reduxjs/toolkit'
import { FormActionStep } from '../slices/vaultActionSlice'
import type { RootState } from '../store'

export const getActiveStepSelector = createSelector(
  (state: RootState) => state.vaultAction.steps,
  (state: RootState) => state.vaultAction.completedSteps,
  (steps, completedSteps) => {
    if (steps.length > 0 && steps.length === completedSteps.length) {
      return FormActionStep.DONE
    }

    return completedSteps.length >= steps.length ? null : steps[completedSteps.length]
  },
)
