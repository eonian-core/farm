import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Vault } from "../../../api";
import { createVaultActionToast } from "../../../earn/[symbol]/components";
import { toBigIntWithDecimals } from "../../../shared";
import { RootState } from "../../store";
import { validateAndShowToast } from "./validation";

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
  amount: number;

  steps: FormActionStep[];
  completedSteps: FormActionStep[];
  stepsSkipped: number;

  toastId: number | string | null;
}

const initialState: VaultActionSlice = {
  ongoingAction: null,

  vaultName: null,
  assetSymbol: null,
  amount: 0,

  steps: [],
  completedSteps: [],
  stepsSkipped: 0,

  toastId: null,
};

export interface ExecuteActionPayload {
  action: FormAction;
  vault: Vault;
  amount: number;
}

export const startVaultAction = createAsyncThunk(
  "vaultAction/executeAction",
  async (payload: ExecuteActionPayload, { getState }) => {
    const state = getState() as RootState;
    const { amount, action, vault } = payload;
    const { assetAllowanceBN } = state.vaultUser;
    
    validateAndShowToast(payload, state);

    let completedSteps: FormActionStep[] = [];
    let stepsSkipped = 0;

    if (action === FormAction.DEPOSIT) {
      const allowanceBN = BigInt(assetAllowanceBN);
      const amountBN = toBigIntWithDecimals(amount, vault.underlyingAsset.decimals);
      if (allowanceBN >= amountBN) {
        completedSteps = [FormActionStep.APPROVAL];
        stepsSkipped++;
      }
    }
    return { ...payload, completedSteps, stepsSkipped };
  }
);

const vaultActionSlice = createSlice({
  name: "vaultAction",
  initialState,
  reducers: {
    reset: (state) => {
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
  },
  extraReducers(builder) {
    builder
      .addCase(startVaultAction.fulfilled, (state, action) => {
        const {
          action: newAction,
          vault,
          amount,
          stepsSkipped,
          completedSteps,
        } = action.payload;

        state.ongoingAction = newAction;

        state.vaultName = vault.name;
        state.assetSymbol = vault.underlyingAsset.symbol;
        state.amount = amount;

        state.steps = formActionSteps[newAction];
        state.completedSteps = completedSteps;
        state.stepsSkipped = stepsSkipped;

        state.toastId = createVaultActionToast();
      })
      .addCase(startVaultAction.rejected, () => initialState);
  },
});

export const { reset, goToNextActionStep } = vaultActionSlice.actions;
export default vaultActionSlice.reducer;
