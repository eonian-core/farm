"use client";

import React from "react";
import { Button } from "@nextui-org/react";

import styles from "./form-button.module.scss";
import useWallet, { WalletStatus } from "../../components/wallet/use-wallet";
import { FormAction } from "./form-header";

interface Props {
  formAction: FormAction;
  onSubmit: (formAction: FormAction) => void;
}

const FormButton: React.FC<Props> = ({ formAction, onSubmit }) => {
  const { status, connect } = useWallet();

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
    >
      {text}
    </Button>
  );
};

export default FormButton;
