"use client";

import React from "react";

import styles from "./form.module.scss";
import { Card } from "@nextui-org/react";
import FormHeader, { FormAction } from "./form-header";
import FormButton from "./form-button";
import { useWalletWrapperContext } from "../../../providers/wallet/wallet-wrapper-provider";
import PercentButtonGroup from "./percent-button-group";
import { Vault } from "../../../api";
import FormInput from "./form-input";
import VaultInfoCard from "./vault-info-card";
import { useNumberInputValue } from "./use-number-input-value";
import useVaultUserInfo from "./use-vault-user-info";
import { WalletStatus } from "../../../providers/wallet/wrappers/wallet-wrapper";

interface Props {
  vault: Vault;
}

const Form: React.FC<Props> = ({ vault }) => {
  const { status } = useWalletWrapperContext();

  const [{ walletBalance, vaultBalance }, hasVaultUserData] =
    useVaultUserInfo(vault);

  const isFormReady = status !== WalletStatus.CONNECTED || hasVaultUserData;

  const [formAction, setFormAction] = React.useState<FormAction>(
    FormAction.DEPOSIT
  );

  const [value, displayValue, handleValueChange] =
    useNumberInputValue(walletBalance);

  const handleSubmit = React.useCallback(() => {}, []);

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
            maxValue={walletBalance}
            onValueChange={handleValueChange}
          />
          <FormInput
            assetSymbol={vault.underlyingAsset.symbol}
            value={displayValue}
            balance={walletBalance}
            onChange={handleValueChange}
            isLoading={!isFormReady}
          />
          <FormButton
            disabled={!isFormReady}
            formAction={formAction}
            onSubmit={handleSubmit}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default Form;
