import React from "react";
import { toast } from "react-toastify";

import { FormAction } from "../../../../../store/slices/vaultActionSlice";
import { Vault } from "../../../../../api";
import { toNumberFromDecimals } from "../../../../../shared";
import { useAppSelector } from "../../../../../store/hooks";

export function useValidateTransaction() {
  const { walletBalanceBN, assetDecimals } = useAppSelector(
    (state) => state.vaultUser
  );
  return React.useCallback(
    (action: FormAction, vault: Vault, amount: bigint) => {
      return validateAndShowToast(action, {
        vault,
        amount,
        assetDecimals,
        walletBalance: BigInt(walletBalanceBN),
      });
    },
    [walletBalanceBN, assetDecimals]
  );
}

interface ValidationData {
  vault: Vault;
  amount: bigint;
  walletBalance: bigint;
  assetDecimals: number;
}

function validateAndShowToast(action: FormAction, data: {
  vault: Vault;
  amount: bigint;
  walletBalance: bigint;
  assetDecimals: number;
}) {
  try {
    validate(action, data);
    hideToast();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    showToast(message);
    return false;
  }
  return true;
}

function validate(action: FormAction, data: ValidationData) {
  switch (action) {
    case FormAction.DEPOSIT:
      validateDeposit(data);
      break;
    case FormAction.WITHDRAW:
      validateWithdraw(data);
      break;
  }
}

function validateWithdraw(data: ValidationData) {}

function validateDeposit(data: ValidationData) {
  const { amount, vault, walletBalance, assetDecimals } = data;
  if (amount <= 0) {
    throw new Error("Please enter an amount greater than 0 to continue.");
  }

  const assetSymbol = vault.underlyingAsset.symbol;
  if (amount > walletBalance) {
    const balance = toNumberFromDecimals(walletBalance, assetDecimals);
    throw new Error(
      `Insufficient token balance in your wallet: ${balance} ${assetSymbol}`
    );
  }
}

const validationToastId = "validation-toast-id";

function showToast(content: string) {
  const isToastActive = toast.isActive(validationToastId);
  if (isToastActive) {
    toast.update(validationToastId, { render: content });
  } else {
    toast.warning(content, { toastId: validationToastId });
  }
}

function hideToast() {
  toast.dismiss(validationToastId);
}
