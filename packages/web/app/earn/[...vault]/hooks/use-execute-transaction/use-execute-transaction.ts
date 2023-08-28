import React from 'react'
import type { Vault } from '../../../../api'
import { useAppDispatch } from '../../../../store/hooks'
import { FormAction, stopVaultAction } from '../../../../store/slices/vaultActionSlice'
import { useValidateTransaction } from './internal-hooks'

import { useDepositTransaction } from './use-deposit-transaction'
import { useWithdrawTransaction } from './use-withdraw-transaction'

export function useExecuteTransaction() {
  const dispatch = useAppDispatch()

  const executeDepositTransaction = useDepositTransaction()
  const executeWithdrawTransaction = useWithdrawTransaction()

  const validateTransaction = useValidateTransaction()

  const execute = async (action: FormAction, vault: Vault, amount: bigint): Promise<boolean> => {
    const isValid = validateTransaction(action, vault, amount)
    if (!isValid) {
      void dispatch(stopVaultAction())
      return false
    }

    try {
      switch (action) {
        case FormAction.DEPOSIT:
          await executeDepositTransaction(vault, amount)
          break
        case FormAction.WITHDRAW:
          await executeWithdrawTransaction(vault, amount)
          break
      }
    }
    catch (e) {
      console.warn(e)
      return false
    }
    return true
  }

  return React.useCallback(execute, [
    validateTransaction,
    executeDepositTransaction,
    executeWithdrawTransaction,
    dispatch,
  ])
}
