import React from "react";
import { ethers } from "ethers";

import { useWalletWrapperContext } from "../../../../../providers/wallet/wallet-wrapper-provider";
import { useAppDispatch } from "../../../../../store/hooks";
import {
  setTransactionStarted,
  goToNextActionStep,
  failVaultAction,
} from "../../../../../store/slices/vaultActionSlice";

type FN<T, U extends unknown> = (
  signer: ethers.JsonRpcSigner,
  params: U
) => Promise<() => Promise<T>>;

export function useWriteTransactionSender() {
  const { provider } = useWalletWrapperContext();
  const dispatch = useAppDispatch();

  const send = async <T, U extends unknown>(
    fn: FN<T, U>,
    params: U
  ): Promise<T | null> => {
    let result: T | null;
    try {
      const signer = await provider!.getSigner();
      const wait = await fn(signer, params);
      dispatch(setTransactionStarted());
      result = await wait();
      dispatch(goToNextActionStep());
    } catch (error) {
      dispatch(failVaultAction(error as Error));
      return null;
    }
    return result;
  };

  return React.useCallback(send, [provider, dispatch]);
}
