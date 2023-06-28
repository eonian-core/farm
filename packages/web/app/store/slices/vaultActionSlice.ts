import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Vault } from "../../api";
import { createVaultActionToast } from "../../earn/[symbol]/components";

export const enum FormAction {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

export const enum FormActionStep {
  APPROVAL = "APPROVAL",
  CONFIRMATION = "CONFIRMATION",
  DONE = "DONE",
}

export const formActionSteps: Record<FormAction, FormActionStep[]> = {
  [FormAction.DEPOSIT]: [FormActionStep.APPROVAL, FormActionStep.CONFIRMATION],
  [FormAction.WITHDRAW]: [FormActionStep.CONFIRMATION],
};

interface VaultActionSlice {
  ongoingAction: FormAction | null;

  vaultName: string | null;
  assetSymbol: string | null;
  amountBN: string;

  steps: FormActionStep[];
  completedSteps: FormActionStep[];
  stepsSkipped: number;

  toastId: number | string | null;
}

const initialState: VaultActionSlice = {
  ongoingAction: null,

  vaultName: null,
  assetSymbol: null,
  amountBN: "0",

  steps: [],
  completedSteps: [],
  stepsSkipped: 0,

  toastId: null,
};

export interface ExecuteActionPayload {
  action: FormAction;
  vault: Vault;
  amount: bigint;
  stepsToSkip?: number;
}

const vaultActionSlice = createSlice({
  name: "vaultAction",
  initialState,
  reducers: {
    resetVaultAction: (state) => {
      if (state.toastId) {
        toast.dismiss(state.toastId);
      }
      return initialState;
    },
    goToNextActionStep: (state) => {
      const { ongoingAction, steps, completedSteps } = state;
      if (!ongoingAction) {
        return;
      }

      if (state.toastId) {
        const progress = completedSteps.length / steps.length;
        toast.update(state.toastId, { progress });
      }

      const stepsDone = completedSteps.length;
      if (stepsDone < steps.length) {
        const nextActionStep = steps[stepsDone];
        state.completedSteps = [...state.completedSteps, nextActionStep];
      }
    },
    startVaultAction: (state, action: PayloadAction<ExecuteActionPayload>) => {
      const {
        action: newAction,
        vault,
        amount,
        stepsToSkip = 0,
      } = action.payload;

      state.ongoingAction = newAction;

      state.vaultName = vault.name;
      state.assetSymbol = vault.underlyingAsset.symbol;
      state.amountBN = amount.toString();

      state.steps = [...formActionSteps[newAction]];
      if (stepsToSkip > 0) {
        state.completedSteps = state.steps.slice(0, stepsToSkip);
        state.stepsSkipped = stepsToSkip;
      }

      state.toastId = createVaultActionToast();
    },
  },
});

export const { resetVaultAction, goToNextActionStep, startVaultAction } =
  vaultActionSlice.actions;
export default vaultActionSlice.reducer;
