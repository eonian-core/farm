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
import { PercentButtonGroup, VaultInfoCard, VaultLink } from "../components";
import {
  useVaultUserInfo,
  useNumberInputValue,
  useExecuteTransaction,
} from "../hooks";
import {
  FormAction,
  FormActionStep,
} from "../../../store/slices/vaultActionSlice";
import { getActiveStepSelector } from "../../../store";

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

  const [formAction, setFormAction] = React.useState<FormAction>(
    FormAction.DEPOSIT
  );

  const [value, displayValue, handleValueChange] = useInputValue();
  const [currentBalance, walletBalance, vaultBalance] = useBalance(formAction);
  const vaultChain = useVaultChain();
  const hasPendingTransactions = useHasPendingTransactions();
  const executeTransaction = useExecuteTransaction();

  const handleSubmit = React.useCallback(
    async (formAction: FormAction) => {
      // Refresh vault <-> user data before the transaction to make sure all calculations are correct.
      await refetechVaultUserData!();

      // Execute Deposit/Withdraw transaction
      await executeTransaction(formAction, vault, value);

      // Refresh wallet balance & vault deposit after the transaction executed.
      refetechVaultUserData!();
    },
    [executeTransaction, refetechVaultUserData, vault, value]
  );

  const isFirstRequestFinished = lastRequestForWallet === wallet?.address;
  const isWalletNotConnected = status === WalletStatus.NOT_CONNECTED;
  const isFormReady =
    !isLoading || isFirstRequestFinished || isWalletNotConnected;

  return (
    <div className={styles.container}>
      <Card variant="flat" className={styles.disclamer}>
        <p>🛠 Alpha test application may display APY lower than actual.</p>
      </Card>
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
            maxValue={currentBalance}
            onValueChange={handleValueChange}
            disabled={hasPendingTransactions}
          />
          <FormInput
            assetSymbol={vault.asset.symbol}
            decimals={vault.asset.decimals}
            value={displayValue}
            balance={currentBalance}
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
      <h4>
        <VaultLink vault={vault} chainId={vaultChain.id} />
      </h4>
    </div>
  );
};

function useInputValue() {
  const { assetDecimals } = useAppSelector((state) => state.vaultUser);
  return useNumberInputValue(0n, assetDecimals);
}

function useBalance(
  action: FormAction
): [current: bigint, wallet: bigint, vault: bigint] {
  const { walletBalanceBN, vaultBalanceBN } = useAppSelector(
    (state) => state.vaultUser
  );
  const wallet = BigInt(walletBalanceBN);
  const vault = BigInt(vaultBalanceBN);
  switch (action) {
    case FormAction.DEPOSIT:
      return [wallet, wallet, vault];
    case FormAction.WITHDRAW:
      return [vault, wallet, vault];
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
