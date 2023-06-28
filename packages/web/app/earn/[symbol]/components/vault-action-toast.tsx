"use client";

import React from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useWalletWrapperContext } from "../../../providers/wallet/wallet-wrapper-provider";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  FormAction,
  FormActionStep,
  reset as resetVaultActionState,
} from "../../../store/slices/vaultActionSlice/vaultActionSlice";

import styles from "./vault-action-toast.module.scss";
import { getActiveStepSelector } from "../../../store";

const VaultActionToast = () => {
  const { wallet } = useWalletWrapperContext();

  useToastCloseCleanup();

  const [total, confirmed] = useTransactionCounters();

  const description = useTransactionDescription();

  return (
    <div className={styles.container}>
      {wallet && (
        <Image
          className={styles.image}
          src={wallet.iconImageSrc}
          alt={wallet.label}
          width={35}
          height={35}
        />
      )}
      <div>
        <h4>
          {confirmed} / {total} Transaction confirmed
        </h4>
        {description && <div className={styles.description}>{description}</div>}
      </div>
    </div>
  );
};

/**
 * Clears the store data after closing the toast.
 */
function useToastCloseCleanup() {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    return () => {
      dispatch(resetVaultActionState());
    };
  }, [dispatch]);
}

function useTransactionCounters(): [total: number, confirmed: number] {
  const { steps, completedSteps, stepsSkipped } = useAppSelector(
    (state) => state.vaultAction
  );
  return React.useMemo(() => {
    return [steps.length - stepsSkipped, completedSteps.length - stepsSkipped];
  }, [steps, completedSteps, stepsSkipped]);
}

function useTransactionDescription(): string | undefined {
  const { ongoingAction, amount, assetSymbol } = useAppSelector(
    (state) => state.vaultAction
  );
  const activeStep = useAppSelector(getActiveStepSelector);

  return React.useMemo(() => {
    switch (activeStep) {
      case FormActionStep.APPROVAL:
        return `Approve spending ${amount} ${assetSymbol} to complete the deposit`;
      case FormActionStep.CONFIRMATION: {
        switch (ongoingAction) {
          case FormAction.DEPOSIT:
            return `Confirm wallet transaction to complete deposit of ${amount} ${assetSymbol}`;
          case FormAction.WITHDRAW:
            return `Confirm wallet transaction to complete withdrawal of ${amount} ${assetSymbol}`;
        }
      }
    }
  }, [activeStep, ongoingAction, amount, assetSymbol]);
}

export const createVaultActionToast = (): number | string => {
  return toast(<VaultActionToast />, {
    autoClose: false,
    closeOnClick: false,
    toastId: "vault-action-toast",
  });
};
