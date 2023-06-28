import React from "react";
import { Vault } from "../../../../api";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  FormAction,
  resetVaultAction,
  startVaultAction,
} from "../../../../store/slices/vaultActionSlice";
import { validateAndShowToast } from "./validation";

export function useExecuteTransaction() {
  const dispatch = useAppDispatch();

  const executeDepositTransaction = useDepositTransaction();
  const executeWithdrawTransaction = useWithdrawTransaction();

  const validateTransaction = useValidateTransaction();

  const execute = async (action: FormAction, vault: Vault, amount: bigint) => {
    const isValid = validateTransaction(action, vault, amount);
    if (!isValid) {
      return dispatch(resetVaultAction());
    }

    dispatch(startVaultAction({ action, vault, amount }));

    switch (action) {
      case FormAction.DEPOSIT:
        return await executeDepositTransaction(vault, amount);
      case FormAction.WITHDRAW:
        return await executeWithdrawTransaction(vault, amount);
    }
  };

  return React.useCallback(execute, [
    validateTransaction,
    executeDepositTransaction,
    executeWithdrawTransaction,
    dispatch,
  ]);
}

function useDepositTransaction() {
  const execute = async (vault: Vault, amount: bigint) => {};
  return React.useCallback(execute, []);
}

function useWithdrawTransaction() {
  const execute = async (vault: Vault, amount: bigint) => {};
  return React.useCallback(execute, []);
}

function useValidateTransaction() {
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
