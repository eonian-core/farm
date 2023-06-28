import { toast } from "react-toastify";
import { RootState } from "../../store";
import { ExecuteActionPayload, FormAction } from "./vaultActionSlice";

export const validationToastId = "validation-toast-id";

export function validateAndShowToast(
  payload: ExecuteActionPayload,
  state: RootState
) {
  try {
    const { action } = payload;
    switch (action) {
      case FormAction.DEPOSIT:
        validateDeposit(payload, state);
        break;
      case FormAction.WITHDRAW:
        validateWithdraw(payload, state);
        break;
    }
    // Dimiss the active toast if the validation passed
    toast.dismiss(validationToastId);
  } catch (error) {
    if (error instanceof Error) {
      const content = error.message;
      const isToastActive = toast.isActive(validationToastId);
      if (isToastActive) {
        toast.update(validationToastId, { render: content });
      } else {
        toast.warning(content, { toastId: validationToastId });
      }
    }
    throw error;
  }
}

function validateWithdraw(payload: ExecuteActionPayload, state: RootState) {}

function validateDeposit(payload: ExecuteActionPayload, state: RootState) {
  const { amount } = payload;
  if (amount <= 0) {
    throw new Error("Please enter an amount greater than 0 to continue.");
  }

  const { underlyingAsset } = payload.vault;
  const { walletBalance } = state.vaultUser;
  const assetSymbol = underlyingAsset.symbol;
  if (amount > walletBalance) {
    throw new Error(
      `Insufficient token balance in your wallet: ${walletBalance} ${assetSymbol}`
    );
  }
}
