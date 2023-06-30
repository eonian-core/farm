import React from "react";
import { Vault } from "../../../../api";
import { useAppDispatch } from "../../../../store/hooks";
import {
  FormAction,
  resetVaultAction,
} from "../../../../store/slices/vaultActionSlice";
import {
  useValidateTransaction,
} from "./internal-hooks";

import { useDepositTransaction } from "./use-deposit-transaction";
import { useWithdrawTransaction } from "./use-withdraw-transaction";

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
