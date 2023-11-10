import React from 'react'
import { toast } from 'react-toastify'

import { FormAction } from '../../../../../store/slices/vaultActionSlice'
import type { Vault } from '../../../../../api'
import { toStringNumberFromDecimals } from '../../../../../shared'
import { useAppSelector } from '../../../../../store/hooks'

export function useValidateTransaction() {
  const { walletBalanceBN, vaultBalanceBN, assetDecimals } = useAppSelector(state => state.vaultUser)
  return React.useCallback(
    (action: FormAction, vault: Vault, amount: bigint) =>
      validateAndShowToast(action, {
        vault,
        amount,
        assetDecimals,
        walletBalance: BigInt(walletBalanceBN),
        vaultBalance: BigInt(vaultBalanceBN),
      }),
    [walletBalanceBN, vaultBalanceBN, assetDecimals],
  )
}

interface ValidationData {
  vault: Vault
  amount: bigint
  assetDecimals: number
  walletBalance: bigint
  vaultBalance: bigint
}

function validateAndShowToast(action: FormAction, data: ValidationData) {
  try {
    validate(action, data)
    hideToast()
  }
  catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    showToast(message)
    return false
  }
  return true
}

function validate(action: FormAction, data: ValidationData) {
  switch (action) {
    case FormAction.DEPOSIT:
      validateDeposit(data)
      break
    case FormAction.WITHDRAW:
      validateWithdraw(data)
      break
  }
}

function validateWithdraw(data: ValidationData) {
  const { amount, vault, vaultBalance, assetDecimals } = data
  if (amount <= 0) {
    throw new Error('Please enter an amount greater than 0 to continue.')
  }

  const assetSymbol = vault.asset.symbol
  if (amount > vaultBalance) {
    const balance = toStringNumberFromDecimals(vaultBalance, assetDecimals)
    throw new Error(
      `Insufficient token balance. You are trying to withdraw more tokens than are available in your vault balance. Available balance: ${balance} ${assetSymbol}`,
    )
  }
}

function validateDeposit(data: ValidationData) {
  const { amount, vault, walletBalance, assetDecimals } = data
  if (amount <= 0) {
    throw new Error('Please enter an amount greater than 0 to continue.')
  }

  const assetSymbol = vault.asset.symbol
  if (amount > walletBalance) {
    const balance = toStringNumberFromDecimals(walletBalance, assetDecimals)
    throw new Error(`Insufficient token balance in your wallet: ${balance} ${assetSymbol}`)
  }
}

const validationToastId = 'validation-toast-id'

function showToast(content: string) {
  const isToastActive = toast.isActive(validationToastId)
  if (isToastActive) {
    toast.update(validationToastId, { render: content })
  }
  else {
    toast.warning(content, { toastId: validationToastId })
  }
}

function hideToast() {
  toast.dismiss(validationToastId)
}
