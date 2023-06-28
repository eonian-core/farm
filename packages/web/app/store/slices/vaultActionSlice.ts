import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { error } from "console";
import { ethers } from "ethers";
import { toast, UpdateOptions } from "react-toastify";
import { Vault } from "../../api";
import { createVaultActionToast } from "../../earn/[symbol]/components";

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
    goToNextActionStep: (state) => {
      const { ongoingAction, steps, completedSteps } = state;
      if (!ongoingAction) {
        return;
      }

      const progress = completedSteps.length / steps.length;
      toast.update(TOAST_ID, { progress });

      const stepsDone = completedSteps.length;
      if (stepsDone < steps.length) {
        const nextActionStep = steps[stepsDone];
        state.completedSteps = [...state.completedSteps, nextActionStep];
      }
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

      state.error = null;
    },
    failVaultAction: (state, action: PayloadAction<Error>) => {
      const error = action.payload;

      const update: UpdateOptions = { type: "error", autoClose: 7500 };
      if (ethers.isError(error, "ACTION_REJECTED")) {
        update.type = "warning";
        switch (error.reason) {
          case 'rejected': {
            update.render =
              "Transaction Rejected: The transaction has been declined or canceled by the user.";
            break;
          }
        }
      }
      toast.update(TOAST_ID, update);
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
    });

    const unsubscribe = toast.onChange(({ id, status }) => {
      if (id === TOAST_ID && status === "removed") {
        dispatch(resetVaultAction());
        unsubscribe();
      }
    });
  }
);

export const { resetVaultAction, goToNextActionStep, failVaultAction } =
  vaultActionSlice.actions;
export default vaultActionSlice.reducer;
