"use client";

import React from "react";
import Image from "next/image";
import { useWalletWrapperContext } from "../../../providers/wallet/wallet-wrapper-provider";
import { useAppSelector } from "../../../store/hooks";
import {
  FormAction,
  FormActionStep,
} from "../../../store/slices/vaultActionSlice";

import styles from "./vault-action-toast.module.scss";
import { getActiveStepSelector } from "../../../store";
import { toNumberFromDecimals } from "../../../shared";
import { Loading } from "@nextui-org/react";

export const VaultActionToast = () => {
  const [total, confirmed] = useTransactionCounters();

  const description = useTransactionDescription();

  return (
    <div className={styles.container}>
      <ToastImage />
      <div>
        <h4>
          {confirmed} / {total} Transaction confirmed
        </h4>
        {description && <div className={styles.description}>{description}</div>}
      </div>
    </div>
  );
};

function useTransactionCounters(): [total: number, confirmed: number] {
  const { steps, completedSteps, stepsSkipped } = useAppSelector(
    (state) => state.vaultAction
  );
  return [steps.length - stepsSkipped, completedSteps.length - stepsSkipped];
}

function useTransactionDescription(): string | undefined {
  const { activeAction, amountBN, assetSymbol } = useAppSelector(
    (state) => state.vaultAction
  );
  const { assetDecimals } = useAppSelector((state) => state.vaultUser);
  const activeStep = useAppSelector(getActiveStepSelector);

  const amount = toNumberFromDecimals(amountBN, assetDecimals);
  switch (activeStep) {
    case FormActionStep.APPROVAL:
      return `Approve spending ${amount} ${assetSymbol} to complete the deposit`;
    case FormActionStep.CONFIRMATION: {
      switch (activeAction) {
        case FormAction.DEPOSIT:
          return `Confirm wallet transaction to complete deposit of ${amount} ${assetSymbol}`;
        case FormAction.WITHDRAW:
          return `Confirm wallet transaction to complete withdrawal of ${amount} ${assetSymbol}`;
      }
    }
    case FormActionStep.DONE: {
      switch (activeAction) {
        case FormAction.DEPOSIT:
          return `You have successfully deposited ${amount} ${assetSymbol}`;
        case FormAction.WITHDRAW:
          return `You have successfully withdrew ${amount} ${assetSymbol}`;
      }
    }
  }
}

function ToastImage() {
  const { wallet } = useWalletWrapperContext();
  const { isTransactionActive } = useAppSelector((state) => state.vaultAction);

  if (isTransactionActive) {
    return <Loading className={styles.image} size="md" />;
  }

  const size = 32; // Same size as <Loading /> component has.
  return (
    wallet && (
      <Image
        className={styles.image}
        src={wallet.iconImageSrc}
        alt={wallet.label}
        width={size}
        height={size}
      />
    )
  );
}

export const createVaultActionToast = () => {
  return <VaultActionToast />;
};
