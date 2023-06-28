import { ethers, isError } from "ethers";
import React from "react";
import { Vault } from "../../../../api";
import { useWalletWrapperContext } from "../../../../providers/wallet/wallet-wrapper-provider";
import { approveERC20 } from "../../../../shared";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  prepareVaultAction,
  FormAction,
  resetVaultAction,
  failVaultAction,
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

    dispatch(prepareVaultAction({ action, vault, amount }));

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
  const send = useWriteTransactionSender();

  const execute = async (vault: Vault, amount: bigint) => {
    await send(async (signer) => {
      return await approveERC20(signer, {
        tokenAddress: vault.underlyingAsset.address,
        spenderAddress: vault.address,
        amount,
      });
    });
  };

  return React.useCallback(execute, [send]);
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

function useWriteTransactionSender() {
  const { provider } = useWalletWrapperContext();
  const dispatch = useAppDispatch();

  const send = async <T>(
    transactionBuilder: (signer: ethers.JsonRpcSigner) => Promise<T>
  ): Promise<T | null> => {
    try {
      const signer = await provider!.getSigner();
      return await transactionBuilder(signer);
    } catch (error) {
      dispatch(failVaultAction(error as Error));
      return null;
    }
  };

  return React.useCallback(send, [provider, dispatch]);
}
