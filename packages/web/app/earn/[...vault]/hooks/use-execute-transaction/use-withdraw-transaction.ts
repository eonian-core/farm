import React from 'react'
import type { Vault } from '../../../../api'
import { withdraw } from '../../../../shared/web3/transactions/vault'
import { useAppDispatch } from '../../../../store/hooks'
import { FormAction, prepareVaultAction } from '../../../../store/slices/vaultActionSlice'
import { useWriteTransactionSender } from './internal-hooks'

export function useWithdrawTransaction() {
  const dispatch = useAppDispatch()
  const send = useWriteTransactionSender()

  const execute = async (vault: Vault, amount: bigint) => {
    const action = FormAction.WITHDRAW

    void dispatch(prepareVaultAction({ action, vault, amount }))

    await send(withdraw, {
      vaultAddress: vault.address,
      amount,
    })
  }
  return React.useCallback(execute, [send, dispatch])
}
