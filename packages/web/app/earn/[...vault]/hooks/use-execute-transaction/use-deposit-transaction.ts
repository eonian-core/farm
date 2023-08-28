import React from 'react'

import type { Vault } from '../../../../api'
import { approveERC20 } from '../../../../shared'
import { deposit } from '../../../../shared/web3/transactions/vault'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { FormAction, prepareVaultAction } from '../../../../store/slices/vaultActionSlice'
import { useWriteTransactionSender } from './internal-hooks'

export function useDepositTransaction() {
  const dispatch = useAppDispatch()
  const send = useWriteTransactionSender()
  const { assetAllowanceBN } = useAppSelector(state => state.vaultUser)

  const execute = async (vault: Vault, amount: bigint) => {
    const action = FormAction.DEPOSIT

    // Begin deposit action, skip "APPROVE" step if the allowance is already sufficient.
    const skipApprove = BigInt(assetAllowanceBN) >= amount
    const stepsToSkip = skipApprove ? 1 : 0
    void dispatch(prepareVaultAction({ action, vault, amount, stepsToSkip }))

    let hasApprove = skipApprove

    // Execute "approve" transaction if needed.
    if (!hasApprove) {
      const result = await send(approveERC20, {
        tokenAddress: vault.asset.address,
        spenderAddress: vault.address,
        amount,
      })
      hasApprove = !!result
    }

    // Execute "deposit" transaction if approve has been granted.
    if (hasApprove) {
      await send(deposit, {
        vaultAddress: vault.address,
        amount,
      })
    }
  }

  return React.useCallback(execute, [send, dispatch, assetAllowanceBN])
}
