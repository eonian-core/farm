import React from 'react'
import type { ethers } from 'ethers'

import { useWalletWrapperContext } from '../../../../../providers/wallet/wallet-wrapper-provider'
import { useAppDispatch } from '../../../../../store/hooks'
import {
  failVaultAction,
  goToNextActionStep,
  setTransactionStarted,
} from '../../../../../store/slices/vaultActionSlice'

type FN<T, U> = (signer: ethers.JsonRpcSigner, params: U) => Promise<() => Promise<T>>

export function useWriteTransactionSender() {
  const { provider } = useWalletWrapperContext()
  const dispatch = useAppDispatch()

  const send = async <T, U>(fn: FN<T, U>, params: U): Promise<T> => {
    let result: T
    try {
      const signer = await provider!.getSigner()
      const wait = await fn(signer, params)
      dispatch(setTransactionStarted())
      result = await wait()
      dispatch(goToNextActionStep())
    }
    catch (error) {
      dispatch(failVaultAction(error as Error))
      throw error
    }
    return result
  }

  return React.useCallback(send, [provider, dispatch])
}
