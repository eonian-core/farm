import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { error } from "console";
import { ethers } from "ethers";
import { toast, UpdateOptions } from "react-toastify";
import { Vault } from "../../api";
import { createVaultActionToast } from "../../earn/[symbol]/components";
import { parseError } from "../../shared";

const TOAST_ID = "vault-action-toast";

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
  isTransactionActive: boolean;

  error: string | null;
}

const initialState: VaultActionSlice = {
  ongoingAction: null,

  vaultName: null,
  assetSymbol: null,
  amountBN: "0",

  steps: [],
  completedSteps: [],
  stepsSkipped: 0,
  isTransactionActive: false,

  error: null,
};

interface PrepareActionPayload {
  action: FormAction;
  vault: Vault;
  amount: bigint;
  stepsToSkip?: number;
}

const vaultActionSlice = createSlice({
  name: "vaultAction",
  initialState,
  reducers: {
    resetVaultAction: () => {
      toast.dismiss(TOAST_ID);
      return initialState;
    },
    initVaultAction: (state, action: PayloadAction<PrepareActionPayload>) => {
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

      state.isTransactionActive = false;
      state.error = null;
    },
    goToNextActionStep: (state) => {
      const { error, ongoingAction, steps, completedSteps } = state;

      state.isTransactionActive = false;

      if (!ongoingAction || !!error) {
        return;
      }

      const stepsDone = completedSteps.length;
      if (stepsDone < steps.length) {
        const nextActionStep = steps[stepsDone];
        state.completedSteps = [...state.completedSteps, nextActionStep];
      }

      const progress = state.completedSteps.length / steps.length;
      toast.update(TOAST_ID, { progress });
    },
    setTransactionStarted: (state) => {
      state.isTransactionActive = true;
    },
    failVaultAction: (state, action: PayloadAction<Error>) => {
      const error = action.payload;
      const [message, severity] = parseError(error);
      const update: UpdateOptions = {
        render: message,
        type: severity,
        autoClose: 7500,
        progress: 0,
      };
      toast.update(TOAST_ID, update);

      state.error = message;
    },
  },
});

export const prepareVaultAction = createAsyncThunk(
  "vaultAction/start",
  (payload: PrepareActionPayload, { dispatch }) => {
    dispatch(vaultActionSlice.actions.initVaultAction(payload));

    toast(createVaultActionToast(), {
      autoClose: false,
      closeOnClick: false,
      toastId: TOAST_ID,
      progress: 0,
    });

    const unsubscribe = toast.onChange(({ id, status }) => {
      if (id === TOAST_ID && status === "removed") {
        dispatch(resetVaultAction());
        unsubscribe();
      }
    });
  }
);

export const {
  resetVaultAction,
  goToNextActionStep,
  failVaultAction,
  initVaultAction,
  setTransactionStarted,
} = vaultActionSlice.actions;
export default vaultActionSlice.reducer;
