"use client";

import React from "react";
import { Button, ButtonProps } from "@nextui-org/react";

import styles from "./form-button.module.scss";
import { FormAction } from "./form-header";
import { WalletStatus } from "../../../providers/wallet/wrappers/wallet-wrapper";
import { useWalletWrapperContext } from "../../../providers/wallet/wallet-wrapper-provider";

interface Props extends Omit<ButtonProps, 'onSubmit'> {
  formAction: FormAction;
  onSubmit: (formAction: FormAction) => void;
}

const FormButton: React.FC<Props> = ({ formAction, onSubmit, ...restProps }) => {
  const { status, connect } = useWalletWrapperContext();

  const text = React.useMemo(() => {
    switch (status) {
      case WalletStatus.NOT_CONNECTED:
        return "Connect to a wallet";
      case WalletStatus.CONNECTING:
        return "Connecting to a wallet...";
      case WalletStatus.CONNECTED:
        return formAction === FormAction.DEPOSIT ? "Deposit" : "Withdraw";
    }
  }, [formAction, status]);

  const handlePress = React.useCallback(() => {
    switch (status) {
      case WalletStatus.NOT_CONNECTED:
        return connect();
      case WalletStatus.CONNECTED:
        return onSubmit(formAction);
    }
  }, [status, connect, formAction, onSubmit]);

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
