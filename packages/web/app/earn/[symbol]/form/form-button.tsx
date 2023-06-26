"use client";

import React from "react";
import { Button, ButtonProps } from "@nextui-org/react";

import styles from "./form-button.module.scss";
import { FormAction } from "./form-header";
import { useWalletWrapperContext } from "../../../providers/wallet/wallet-wrapper-provider";
import { Chain, WalletStatus } from "../../../providers/wallet/wrappers/types";

interface Props extends Omit<ButtonProps, "onSubmit"> {
  formAction: FormAction;
  vaultChain: Chain;
  onSubmit: (formAction: FormAction) => void;
}

const FormButton: React.FC<Props> = ({
  formAction,
  vaultChain,
  onSubmit,
  ...restProps
}) => {
  const { status, connect, chain, setCurrentChain } = useWalletWrapperContext();

  const isOnDifferentChain = vaultChain.id !== chain?.id;

  const text = React.useMemo(() => {
    switch (status) {
      case WalletStatus.NOT_CONNECTED:
        return "Connect to a wallet";
      case WalletStatus.CONNECTING:
        return "Connecting to a wallet...";
      case WalletStatus.CONNECTED: {
        if (isOnDifferentChain) {
          return `Switch to ${vaultChain.name}`;
        }
        return formAction === FormAction.DEPOSIT ? "Deposit" : "Withdraw";
      }
    }
  }, [isOnDifferentChain, vaultChain, formAction, status]);

  const handlePress = React.useCallback(() => {
    switch (status) {
      case WalletStatus.NOT_CONNECTED:
        return connect();
      case WalletStatus.CONNECTED: {
        if (isOnDifferentChain) {
          return setCurrentChain(vaultChain.id);
        }
        return onSubmit(formAction);
      }
    }
  }, [
    isOnDifferentChain,
    vaultChain,
    status,
    setCurrentChain,
    connect,
    formAction,
    onSubmit,
  ]);

  return (
    <Button
      auto
      color="primary"
      size="lg"
      className={styles.button}
      onPress={handlePress}
      {...restProps}
    >
      {text}
    </Button>
  );
};

export default FormButton;
