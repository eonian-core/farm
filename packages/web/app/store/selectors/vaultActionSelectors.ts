import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const getActiveStepSelector = createSelector(
  (state: RootState) => state.vaultAction.steps,
  (state: RootState) => state.vaultAction.completedSteps,
  (steps, completedSteps) => {
    return completedSteps.length >= steps.length
      ? null
      : steps[completedSteps.length];
  }
);
