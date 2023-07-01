"use client";

import React from "react";

import styles from "./form.module.scss";
import { Card } from "@nextui-org/react";
import FormHeader from "./form-header";
import FormButton from "./form-button";
import { Vault } from "../../../api";
import FormInput from "./form-input";
import { useAppSelector } from "../../../store/hooks";
import { useWalletWrapperContext } from "../../../providers/wallet/wallet-wrapper-provider";
import { WalletStatus } from "../../../providers/wallet/wrappers/types";
import { PercentButtonGroup, VaultInfoCard } from "../components";
import {
  useVaultUserInfo,
  useNumberInputValue,
  useExecuteTransaction,
} from "../hooks";
import {
  FormAction,
  FormActionStep,
} from "../../../store/slices/vaultActionSlice";
import { getActiveStepSelector, getBalancesSelector } from "../../../store";

interface Props {
  vault: Vault;
}

const Form: React.FC<Props> = ({ vault }) => {
  const { wallet, status } = useWalletWrapperContext();

  const refetechVaultUserData = useVaultUserInfo(vault, {
    autoUpdateInterval: 5000,
  });

  const { isLoading, lastRequestForWallet } = useAppSelector(
    (state) => state.vaultUser
  );
  const { vaultBalance } = useAppSelector(getBalancesSelector);

  const [formAction, setFormAction] = React.useState<FormAction>(
    FormAction.DEPOSIT
  );

  const [value, displayValue, bigValue, handleValueChange] = useInputValue();
  const balance = useBalance(formAction);
  const vaultChain = useVaultChain();
  const hasPendingTransactions = useHasPendingTransactions();
  const executeTransaction = useExecuteTransaction();

  const handleSubmit = React.useCallback(
    async (formAction: FormAction) => {
      // Refresh vault <-> user data before the transaction to make sure all calculations are correct.
      await refetechVaultUserData!();

      // Execute Deposit/Withdraw transaction
      await executeTransaction(formAction, vault, bigValue);

      // Refresh wallet balance & vault deposit after the transaction executed.
      refetechVaultUserData!();
    },
    [executeTransaction, refetechVaultUserData, vault, bigValue]
  );

  const isFirstRequestFinished = lastRequestForWallet === wallet?.address;
  const isWalletNotConnected = status === WalletStatus.NOT_CONNECTED;
  const isFormReady =
    !isLoading || isFirstRequestFinished || isWalletNotConnected;

  return (
    <div className={styles.container}>
      <h4>
        {vault.name} ({vault.symbol})
      </h4>
      <Card variant="bordered">
        <FormHeader
          currentAction={formAction}
          onCurrentActionChange={setFormAction}
        />

        <Card.Divider />

        <VaultInfoCard
          className={styles.fragment}
          value={value}
          currentDeposit={vaultBalance}
          vault={vault}
          formAction={formAction}
        />

        <Card.Divider />

        <Card.Body className={styles.fragment}>
          <PercentButtonGroup
            inputValue={value}
            maxValue={balance}
            onValueChange={handleValueChange}
            disabled={hasPendingTransactions}
          />
          <FormInput
            assetSymbol={vault.underlyingAsset.symbol}
            value={displayValue}
            balance={balance}
            onChange={handleValueChange}
            isLoading={!isFormReady}
            disabled={hasPendingTransactions}
          />
          <FormButton
            vaultChain={vaultChain}
            disabled={!isFormReady}
            formAction={formAction}
            onSubmit={handleSubmit}
            isLoading={hasPendingTransactions}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

function useInputValue() {
  const { assetDecimals } = useAppSelector((state) => state.vaultUser);
  return useNumberInputValue(0n, assetDecimals);
}

function useBalance(action: FormAction): number {
  const { walletBalance, vaultBalance } = useAppSelector(getBalancesSelector);
  switch (action) {
    case FormAction.DEPOSIT:
      return walletBalance;
    case FormAction.WITHDRAW:
      return vaultBalance;
  }
}

function useHasPendingTransactions() {
  const activeStep = useAppSelector(getActiveStepSelector);
  return activeStep !== null && activeStep !== FormActionStep.DONE;
}

// TODO: Refactor this logic. Temporarily (for alpha test) we use only one chain, later we will have multiple supported chains.
function useVaultChain() {
  const { chains } = useWalletWrapperContext();
  return React.useMemo(() => {
    return chains.find((chain) => chain.isDefault)!;
  }, [chains]);
}

export default Form;
