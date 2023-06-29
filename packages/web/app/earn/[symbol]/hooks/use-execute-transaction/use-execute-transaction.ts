import { ethers } from "ethers";
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
  goToNextActionStep,
  setTransactionStarted,
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
  const dispatch = useAppDispatch();
  const send = useWriteTransactionSender();
  const { assetAllowanceBN } = useAppSelector((state) => state.vaultUser);

  const execute = async (vault: Vault, amount: bigint) => {
    const action = FormAction.DEPOSIT;

    // Begin deposit action, skip "APPROVE" step if the allowance is already sufficient.
    const skipApprove = BigInt(assetAllowanceBN) > amount;
    const stepsToSkip = skipApprove ? 1 : 0;
    dispatch(prepareVaultAction({ action, vault, amount, stepsToSkip }));

    // Execute "approve" transaction if needed.
    if (!skipApprove) {
      await send(async (signer) => {
        return await approveERC20(signer, {
          tokenAddress: vault.underlyingAsset.address,
          spenderAddress: vault.address,
          amount,
        });
      });
    }
  };

  return React.useCallback(execute, [send, dispatch, assetAllowanceBN]);
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
    transactionBuilder: (
      signer: ethers.JsonRpcSigner
    ) => Promise<() => Promise<T>>
  ): Promise<T | null> => {
    let result: T | null;
    try {
      const signer = await provider!.getSigner();
      const wait = await transactionBuilder(signer);
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
